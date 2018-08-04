import Store from "../data/Store";
import Remote from "../endpoint/Remote";

export default class Sync {
    private _data: Store;
    private _remote: Remote;
    constructor(data: Store, remote: Remote) {
        this._data = data;
        this._remote = remote;
    }

    async Sync() {
        try {
            let lastId: string = null;
            const lastRecord = this._data.GetLastRecord();
            //console.log('Last record', lastRecord)
            if (lastRecord != null)
                lastId = lastRecord.id;
            const remoteData = await this._remote.getNewRecordsFrom(lastId);
            this._data.Upsert(remoteData);
            return 1;
        }
        catch (ex) {
            throw ex;
        }
    }
}