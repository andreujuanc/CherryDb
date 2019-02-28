import IStore from "../data/IStore";
import Remote from "../endpoint/Remote";
import ISync from './ISync';

export default abstract class SyncBase implements ISync {

    protected _store: IStore;
    protected _remote: Remote;
    protected _started: Boolean;

    abstract Start(): Promise<void>;
    abstract Stop(): Promise<void>;

    OnSyncCompleted: Function;

    Initialize(store: IStore, remote: Remote) {
        this._store = store;
        this._remote = remote;
        this._store.OnPushDataChanged = this.OnPushDataChanged.bind(this);
    }

    async OnPushDataChanged() {
        await this.Push();
    }

    public async Pull() {
        try {
            const TS = await this._store.GetLastRecordTimeStamp();
            //console.log('Last record', lastRecord)
            const remoteData = await this._remote.getNewRecordsFrom(TS);
            this._store.Upsert(remoteData);
            if (this.OnSyncCompleted) this.OnSyncCompleted();

            return 1;
        }
        catch (ex) {
            throw ex;
        }
    }

    public async Push() {
        try {
            let pushData = await this._store.GetPushData();
            if (pushData.length > 0) {
                let pushResult = await this._remote.Send(pushData);
                if (!Array.isArray(pushResult))
                    pushResult = [pushResult]
                await this._store.ClearPushData(pushResult);
            }
        }
        catch (ex) {
            throw ex;
        }
    }

   
}