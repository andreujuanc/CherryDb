import Store from './Store';
import IRecord from './IRecord';
import Record from './Record';

describe("Store", ()=>{
    test('last record', () => {
        let store = new Store();
        store.Upsert([new Record()])
        const lastRecord = store.GetLastRecord();
        expect(lastRecord).toBeInstanceOf(Record);
        // expect(lastRecord).toBeInstanceOf(Item);
    });
    test('GetRecordById', () => {
        let store = new Store();
        let storedItem  = store.Upsert([new Record()])[0]
        const record = store.GetRecordById(storedItem.id);
        expect(record.id).toBe(storedItem.id);
        // expect(lastRecord).toBeInstanceOf(Item);
    });
})
