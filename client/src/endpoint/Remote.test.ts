import IRecord from '../data/IRecord';
import Remote from './Remote';
import Record from '../data/Record';
import * as fetch from 'node-fetch'
import IRequest from './IRequest';
import FetchRequest from './FetchRequest';

jest.mock('./FetchRequest');
const endpointURL = 'http://localhost:8765'

test('Remote Send', async () => {
    //global['fetch'] = fetch;    
    let newItem: Record = {
        id: '123',
        timestamp: Date.now()
    };

    var request = new FetchRequest();
    request["jsonResult"] = newItem;
    let remote = new Remote(endpointURL, request);

    var storedItem = await remote.Send(newItem);
    //console.log('storedItem', storedItem)

    expect(storedItem.id).toEqual(newItem.id);
    // expect(lastRecord).toBeInstanceOf(Item);
});