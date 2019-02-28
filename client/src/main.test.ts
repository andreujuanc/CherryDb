
import CherryDb, { MemoryStore } from './main';
import IntervalSync from './sync/Interval/index';
import Remote from './endpoint/Remote';
import FetchRequest from './endpoint/FetchRequest';

jest.mock('./sync/Interval/index');
jest.mock('./endpoint/Remote');
jest.mock('./endpoint/FetchRequest');

describe('CherryDB', () => {

    it('Main constructor', async () => {
        const store = new MemoryStore();
        expect(() => new CherryDb(null, store)).toThrow();
        expect(() => new CherryDb(undefined, store)).toThrow();
        expect(() => new CherryDb('', store)).toThrow();
    });

    it('Basic usage', async () => {
        const store = new MemoryStore();
        let sync = new IntervalSync();
        sync.Initialize(store, new Remote('http://localhost', new FetchRequest()))
        let db = new CherryDb('http://localhost', store, sync);
        db.Start(null);
        expect(sync.Start).toBeCalled();
    });
})