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

    async Push(){
        try{
            let pushData = await this._data.GetPushData();
            let pushResult = await this._remote.Send(pushData);
            await this._data.ClearPushData(pushResult);
        }
        catch (ex) {
            throw ex;
        }
    }

    async PollSync() {
        await this.Push();
        await this.Pull();
        setTimeout(()=>this.PollSync(), 2000);
    }
}