export default interface ISync{
    Start() : Promise<void>;
    Stop(): Promise<void>;
    OnSyncCompleted: Function;
}