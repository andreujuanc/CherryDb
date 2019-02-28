import IStore from '../data/IStore';
import Remote from '../endpoint/Remote';

export default interface ISync{
    Start() : Promise<void>;
    Stop(): Promise<void>;
    Initialize(store: IStore, remote: Remote): void;

    OnSyncCompleted: Function;
}