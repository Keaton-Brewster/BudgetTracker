// request a database instance
const request = window.indexedDB.open("transactions", 1);

// Create an object store inside the onupgradeneeded method.
request.onsuccess = ({
    target
}) => {
    const db = target.result;
    const objectStore = db.createObjectStore("transactions");
};

// On success console the result.
request.onsuccess = (event) => {
    console.log(request.result);
};