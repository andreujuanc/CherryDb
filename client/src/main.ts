import Sync from "./sync/Interval/index";
import IStore from "./data/IStore";
import Remote from "./endpoint/Remote";
import FetchRequest from "./endpoint/FetchRequest";
import IRecord from "./data/IRecord";

export * from "./data/stores/index";

export default class CheeryDb {
    private _sync: Sync;
    private _store: IStore;
    private _remote: Remote;
    private _fetchRequest: FetchRequest;
    private _started: boolean = false;
    private _onChangeCallbacks : Function[] = [];

    constructor(endpoint: string, store: IStore) {
        if (endpoint == null) throw new Error('First argument "endpoint" is mandatory');
        if (typeof endpoint != 'string') throw new Error('First argument "endpoint" must be a valid url');
        if (endpoint.length < 3) throw new Error('First argument "endpoint" must be a valid url');

        if(store == null) throw new Error('You must provide a valid store');

        this._store = store;
        this._fetchRequest = new FetchRequest();
        this._remote = new Remote(endpoint, this._fetchRequest);
        this._sync = new Sync(this._store, this._remote);
    }

    Start(onchangeCallback: Function) {
        if (this._started) return;
        this._started = true;
        this._sync.OnSyncCompleted  =  onchangeCallback;

        var syncResult = this._sync.PollSync();
        return true;
    }

    getStore() {
        return this._store;
    }

    async Upsert(record: IRecord|IRecord[]) : Promise<IRecord | IRecord[]> {
        return await this._store.Upsert(record);
    }

    async Delete(predicate: (record: IRecord) => boolean) : Promise<void> {
        await this._store.Delete(predicate);
    }
}