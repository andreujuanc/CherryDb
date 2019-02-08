import IStore from "../data/IStore";
import Remote from "../endpoint/Remote";

export default class Sync {
    private _data: IStore;
    private _remote: Remote;
    public OnSyncCompleted: Function;

    constructor(data: IStore, remote: Remote) {
        this._data = data;
        this._remote = remote;
    }

    async Pull() {
        try {
            const TS = await this._data.GetLastRecordTimeStamp();
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

    async Push() {
        try {
            let pushData = await this._data.GetPushData();
            if (pushData.length > 0) {
                let pushResult = await this._remote.Send(pushData);
                if (!Array.isArray(pushResult))
                    pushResult = [pushResult]
                await this._data.ClearPushData(pushResult);
            }
        }
        catch (ex) {
            throw ex;
        }
    }

    async PollSync() {
        await this.Push();
        await this.Pull();
        setTimeout(() => this.PollSync(), 2000);
    }
}