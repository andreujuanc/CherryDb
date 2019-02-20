import IStore from "../../data/IStore";
import Remote from "../../endpoint/Remote";
import ISync from '../ISync';
import SyncBase from '../SyncBase';

let io  = require('socket.io-client')


export default class SocketsIOSync extends SyncBase {
    private _socket: any;
    
    Initialize() {
        this._store.OnPushDataChanged = this.OnPushDataChanged.bind(this);
    }

    async OnPushDataChanged() {
        await this.Push();
    }

    Start(): Promise<void> {
        this._started = true;
        this._socket = io();
        
        this._socket.on('datachanged',  (data: any) => {
             this.Pull();
        });

        return Promise.resolve();
    }

    Stop(): Promise<void> {
        this._started = false;
        this._socket.close();
        return Promise.resolve();
    }
}