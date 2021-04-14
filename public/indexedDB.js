let db;
let cachedData;
const request = indexedDB.open('offline_data', 5);

//? This whole thing is me trying to figure out how to access the mongo data, wether online or cached
(async function syncDB() {
  await fetch('/api/transaction')
    .then(res => {
      return res.json()
    })
    .then(data => cachedData = data);

  const transaction = db.transaction(['offline_data'], 'readwrite');
  const store = transaction.objectStore('offline_data');
})();

request.onupgradeneeded = function (e) {
  db = e.target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore('offline_data', {
      autoIncrement: true
    });
  }
};

request.onerror = function ({
  errorCode
}) {
  throw new Error(`oops. Something went wrong :: indexedDB.js // 30 ==>> ${errorCode}`);
};

function checkDatabase() {
  let transaction = db.transaction(['offline_data'], 'readwrite');
  const store = transaction.objectStore('offline_data');
  const getAll = store.getAll();

  // If the request was successful
  getAll.onsuccess = () => {
    // If there are items in the store, we need to bulk add them when we are back online
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        })
        .then((response) => response.json())
        .then((res) => {
          // If our returned response is not empty
          if (res.length !== 0) {
            transaction = db.transaction(['offline_data'], 'readwrite');

            const currentStore = transaction.objectStore('offline_data');

            currentStore.clear();
          }
        });
    }
  };
}

request.onsuccess = function (e) {
  db = e.target.result;
  try {
    checkDatabase();
  } catch (e) {
    throw new Error(`Cannot check database while offline:: ${e}`)
  }
};

const saveRecord = (record) => {
  const transaction = db.transaction(['offline_data'], 'readwrite');
  const store = transaction.objectStore('offline_data');
  store.add(record);
};

window.addEventListener('online', checkDatabase);