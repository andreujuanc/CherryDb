import IStore from "../data/IStore";
import Remote from "../endpoint/Remote";
import ISync from './ISync';

import * as io  from 'socket.io-client';


export default abstract class SyncBase implements ISync {

    abstract Start(): Promise<void>;
    abstract Stop(): Promise<void>;
    abstract Initialize(): void;

    OnSyncCompleted: Function;

    protected _store: IStore;
    protected _remote: Remote;
    protected _started: Boolean;
    
    setStore(store: IStore){
        this._store = store;
    }

    setRemote(remote: Remote){
        this._remote = remote;
    }

    protected async Pull() {
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

    protected async Push() {
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