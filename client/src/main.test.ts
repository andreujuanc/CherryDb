
// import IRecord from '../data/IRecord';
// import Remote from '../endpoint/Remote';
// import Record from '../data/Record';
// //import * as fetch from 'node-fetch'
// import IRequest from '../endpoint/IRequest';
// import FetchRequest from '../endpoint/FetchRequest';
// import Store from '../data/Store';
// import Sync from '.';

// jest.mock('../endpoint/FetchRequest');
// const endpointURL = 'http://localhost:8765';
import CherryDb, { MemoryStore } from './main';

//import MemoryStore from './data/stores/MemoryStore';

test('Main constructor', async () => {
    const store = new MemoryStore();
    expect(()=>new CherryDb(null, store)).toThrow();
    expect(()=>new CherryDb(undefined, store)).toThrow();
    expect(()=>new CherryDb('', store)).toThrow();

});