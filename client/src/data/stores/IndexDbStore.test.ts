import IndexDbStore from "./IndexDbStore";
import IRecord from '../IRecord';


beforeAll(x => {
    var indexedDB = require("fake-indexeddb");
    var IDBKeyRange = require("fake-indexeddb/lib/FDBKeyRange");
    // @ts-ignore
    window.indexedDB = indexedDB;
    x();
})
test('IndexDbStore', async () => {

    let store = new IndexDbStore('testdb');
    await store.Initialize();
    let recordsToStore = [{
        id: '1234'
    } as IRecord]
    let storedRecords = await store.Upsert(recordsToStore)
    let records = await store.GetAllRecords();
    expect(recordsToStore).toEqual(records);
})