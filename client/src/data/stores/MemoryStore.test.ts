import Store from './MemoryStore';
import IRecord from '../IRecord';
import Record from '../Record';

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
    test('last record', async () => {
        const lastRecordStored = await store.GetLastRecord();
        expect(lastRecordStored.id).toBe('0003');
    });

    test('count', ()=>{
        expect(store.Count()).toBe(records.length);
    });

    test('GetRecordById', async () => {
        let store = new Store();
        let result = await store.Upsert([new Record()]) as Record[];
        let storedItem = result[0];
        const record = await store.GetRecordById(storedItem.id);
        expect(record.id).toBe(storedItem.id);
        // expect(lastRecord).toBeInstanceOf(Item);
    });
})
