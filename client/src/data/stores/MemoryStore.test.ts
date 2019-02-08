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

beforeAll(x => {
    store.Upsert(records);
    x();
})

describe("Store", () => {
    test('last record', async () => {
        const lastRecordStored = await store.GetLastRecord();
        expect(lastRecordStored.id).toBe('0003');
    });

    test('count', () => {
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

    test('delete', async () => {
        const initialItems = store.Count();
        await store.Delete(x => true); //delete all
        const itemsToSync = await store.GetPushData();

        expect(store.Count()).toBe(0);
        expect(itemsToSync.length).toBe(initialItems);
        expect(itemsToSync.filter(x => x.deleted == false).length).toBe(0);
        expect((await store.GetAllRecords()).length).toBe(0);

    });

    // test('delete incomming deleted items', async ()=>{
    //     // await store.Delete(x=>true);
    //     // var itemsToSync = await store.GetPushData();
    //     // expect(store.Count()).toBe(itemsToSync.length);
    //     // expect(itemsToSync.filter(x=>x.deleted==false).length).toBe(0);
    // });

    test('clear push dataa', async () => {
        expect((await store.GetPushData()).length).toBe(4);
        await store.Upsert({ id: null, timestamp: 0 });
        expect((await store.GetPushData()).length).toBe(5);
        await store.ClearPushData(await store.GetPushData());
        expect((await store.GetPushData()).length).toBe(0);
    });


})
