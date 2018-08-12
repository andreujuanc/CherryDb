import IndexDbStore from "./IndexDbStore";


beforeAll(x=>{
    var indexedDB = require("fake-indexeddb");
    var IDBKeyRange = require("fake-indexeddb/lib/FDBKeyRange");
    // @ts-ignore
    window.indexedDB = indexedDB; 
    x();
})
test('IndexDbStore', async () => {
   
    let store = new IndexDbStore('testdb');
    await store.Initialize();
    let records = store.GetAllRecords();
})