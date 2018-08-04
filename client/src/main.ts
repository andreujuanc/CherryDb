import Sync from "./sync";
import Store from "./data/Store";
import Remote from "./endpoint/Remote";
import FetchRequest from "./endpoint/FetchRequest";

export default class CheeryDb
{
    private _sync: Sync;
    private _data: Store;
    private _remote: Remote;
    private _fetchRequest: FetchRequest;
    
    constructor(endpoint: string)
    {
        this._data = new Store();
        this._fetchRequest = new FetchRequest();
        this._remote = new Remote(endpoint, this._fetchRequest);
        this._sync = new Sync(this._data, this._remote);        
    }

    Start()
    {
        var syncResult = this._sync.Sync();
        return true;
    }
}