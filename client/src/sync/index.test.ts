
import IRecord from '../data/IRecord';
import Remote from '../endpoint/Remote';
import Record from '../data/Record';
//import * as fetch from 'node-fetch'
import IRequest from '../endpoint/IRequest';
import FetchRequest from '../endpoint/FetchRequest';
import Store from '../data/stores/MemoryStore';
import Sync from './index';

jest.mock('../endpoint/FetchRequest');
const endpointURL = 'http://localhost:8765';

test('Remote Send', async () => {
    let data = new Store();
    let fetchRequest = new FetchRequest();
    let remote = new Remote(endpointURL, fetchRequest);
    let sync = new Sync(data, remote);

    
    expect(data.Count()).toBe(0);
    fetchRequest["jsonResult"] = [{ id: 1, timestamp: 100000 }];
    await sync.Pull();
    expect(data.Count()).toBe(1);

});