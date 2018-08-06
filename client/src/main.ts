import Sync from "./sync/index";
import Store from "./data/Store";
import Remote from "./endpoint/Remote";
import FetchRequest from "./endpoint/FetchRequest";

export default class CheeryDb {
    private _sync: Sync;
    private _data: Store;
    private _remote: Remote;
    private _fetchRequest: FetchRequest;
    private _started: boolean = false;
    constructor(endpoint: string) {
        if (endpoint == null) throw new Error('First argument "endpoint" is mandatory');
        if (typeof endpoint != 'string') throw new Error('First argument "endpoint" must be a valid url');
        if (endpoint.length < 3) throw new Error('First argument "endpoint" must be a valid url');

        this._data = new Store();
        this._fetchRequest = new FetchRequest();
        this._remote = new Remote(endpoint, this._fetchRequest);
        this._sync = new Sync(this._data, this._remote);
    }

    Start() {
        if (this._started) return;
        this._started = true;
        var syncResult = this._sync.Sync();
        return true;
    }
}