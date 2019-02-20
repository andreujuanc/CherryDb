import IStore from '../data/IStore';
import Remote from '../endpoint/Remote';

export default interface ISync{
    Start() : Promise<void>;
    Stop(): Promise<void>;
    Initialize(): void;

    setStore(store: IStore): void;
    setRemote(remote: Remote) : void;

    OnSyncCompleted: Function;
}