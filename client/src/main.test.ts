
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
import CherryDb from './main';

test('Main', async () => {
   
    expect(()=>new CherryDb(null)).toThrow();
    expect(()=>new CherryDb(undefined)).toThrow();
    expect(()=>new CherryDb('')).toThrow();

});