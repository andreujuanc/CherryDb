import Store from './Store';
import IRecord from './IRecord';
import Record from './Record';

const store = new Store();
const records: IRecord[] = [
    { id: '0001', timestamp: 1 },
    { id: '0002', timestamp: 2 },
    { id: '0003', timestamp: 4 },
    { id: '0004', timestamp: 3 }           
];

beforeAll(x=>{
    store.Upsert(records);
    x();
})

describe("Store", () => {
    test('last record', () => {
        const lastRecordStored = store.GetLastRecord();
        expect(lastRecordStored.id).toBe('0003');
    });

    test('count', ()=>{
        expect(store.Count()).toBe(records.length);
    });

    test('GetRecordById', () => {
        let store = new Store();
        let storedItem = store.Upsert([new Record()])[0]
        const record = store.GetRecordById(storedItem.id);
        expect(record.id).toBe(storedItem.id);
        // expect(lastRecord).toBeInstanceOf(Item);
    });
})
