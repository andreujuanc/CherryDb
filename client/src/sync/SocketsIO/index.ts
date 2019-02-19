import IStore from "../../data/IStore";
import Remote from "../../endpoint/Remote";
import ISync from '../ISync';

export default class SocketsIOSync implements ISync {

    //TODO: Considering having a base class for this
    private _data: IStore;
    private _remote: Remote;
    private _started: Boolean;

    public OnSyncCompleted: Function;

    constructor(data: IStore, remote: Remote) {
        this._data = data;
        this._remote = remote;
    }

    Start(): Promise<void> {
        return null;
    }    
    
    Stop(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}