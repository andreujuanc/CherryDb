import Store from "../data/Store";
import Remote from "../endpoint/Remote";
import { EventEmitter } from "events";

export default class Sync {
    private _data: Store;
    private _remote: Remote;
    public OnSyncCompleted: Function;

    constructor(data: Store, remote: Remote) {
        this._data = data;
        this._remote = remote;
    }

    async Pull() {
        try {
            const TS = this._data.GetLastRecordTimeStamp();
            //console.log('Last record', lastRecord)
            const remoteData = await this._remote.getNewRecordsFrom(TS);
            this._data.Upsert(remoteData);
            if (this.OnSyncCompleted) this.OnSyncCompleted();

            return 1;
        }
        catch (ex) {
            throw ex;
        }
    }

    async PollSync() {

        await this.Pull();
        setTimeout(()=>this.PollSync(), 10000);
    }
}