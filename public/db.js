let db;
let budgetVersion;

// Create a new db request for a "budget" database.
const request = indexedDB.open('offline_data', budgetVersion || 21);

request.onupgradeneeded = function (e) {
  console.log('Upgrade needed in IndexDB');

  const {
    oldVersion
  } = e;
  const newVersion = e.newVersion || db.version;

  console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

  db = e.target.result;

  if (db.objectStoreNames.length === 0) {
    db.createObjectStore('offline_data', {
      autoIncrement: true
    });
  }
};

request.onerror = function (e) {
  console.log(`Woops! ${e.target.errorCode}`);
};

function checkDatabase() {
  console.log('check db invoked');

  // Open a transaction on your offline_data db
  let transaction = db.transaction(['offline_data'], 'readwrite');

  // access your offline_data object
  const store = transaction.objectStore('offline_data');

  // Get all records from store and set to a variable
  const getAll = store.getAll();

  // If the request was successful
  getAll.onsuccess = async () => {
    // If there are items in the store, we need to bulk add them when we are back online
    if (getAll.result.length > 0) {
      fetch('/api/transaction', {
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
            console.log('Clearing store 🧹');

            //* this is a thing I added to try to merge the local db and remote db
            // currentStore.add(
            //   fetch('/api/transaction')
            // )
            // console.log('updating indexedDB');
          }
        });
    }
  };
}

request.onsuccess = function (e) {
  console.log('request success db.js line 70');
  db = e.target.result;

  // Check if app is online before reading from db
  // Removed the use of navigator.onLine becasue apparently it is not reliable
  try {
    console.log('Backend online! 🗄️');
    checkDatabase();
  } catch (error) {
    console.error('Error checking database - db.js line 82');
  }
};

const saveRecord = (record) => {
  console.log('Save record invoked');
  // Create a transaction on the offline_data db with readwrite access
  const transaction = db.transaction(['offline_data'], 'readwrite');

  // Access your offline_data object store
  const store = transaction.objectStore('offline_data');

  // Add record to your store with add method.
  store.add(record);
};

// Listen for app coming back online
window.addEventListener('online', checkDatabase);