import IStore from "../../data/IStore";
import Remote from "../../endpoint/Remote";
import ISync from '../ISync';

export default class SocketsIOSync implements ISync {
    Start(): Promise<void> {
        throw new Error("Method not implemented.");
    }    
    
    Stop(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    OnSyncCompleted: Function;

}