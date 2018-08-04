import Store from './Store';
import IRecord from './IRecord';

class Item implements IRecord
{
    id:string;
    timestamp: number;
}


describe("Store", ()=>{
    test('last record', () => {
        let store = new Store();
        store.Upsert([new Item()])
        const lastRecord = store.GetLastRecord();
        expect(lastRecord).toBeInstanceOf(Item);
        // expect(lastRecord).toBeInstanceOf(Item);
    });
    test('GetRecordById', () => {
        let store = new Store();
        let storedItem  = store.Upsert([new Item()])[0]
        const record = store.GetRecordById(storedItem.id);
        expect(record.id).toBe(storedItem.id);
        // expect(lastRecord).toBeInstanceOf(Item);
    });
})
