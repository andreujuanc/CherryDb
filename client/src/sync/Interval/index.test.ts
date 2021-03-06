
import IRecord from '../../data/IRecord';
import Remote from '../../endpoint/Remote';
import Record from '../../data/Record';
//import * as fetch from 'node-fetch'
import IRequest from '../../endpoint/IRequest';
import FetchRequest from '../../endpoint/FetchRequest';
import MemoryStore from '../../data/stores/MemoryStore';
import IntervalSync from './index';

jest.mock('../../endpoint/FetchRequest');
const endpointURL = 'http://localhost:8765';

test('Remote Send', async () => {
    let store = new MemoryStore();
    let fetchRequest = new FetchRequest();
    let remote = new Remote(endpointURL, fetchRequest);
    let sync = new IntervalSync();

    sync.Initialize(store, remote);

    expect(store.Count()).toBe(0);
    expect((await store.GetPushData()).length).toBe(0);
    // @ts-ignore
    fetchRequest.jsonResult = [{ id: '1', timestamp: 100000 }, { id: '2', timestamp: 100001 }];
    await sync.Pull();
    expect(store.Count()).toBe(2);
    expect((await store.GetPushData()).length).toBe(0);
    
    // data.Delete(x => x.id == '1')
    await store.Upsert({ id: null, timestamp: 0 });
    expect((await store.GetPushData()).length).toBe(1);
    // @ts-ignore
    fetchRequest.jsonResult = await store.GetPushData();
    await sync.Push();

    expect((await store.GetPushData()).length).toBe(0);
        
});


