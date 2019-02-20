import IRecord from "./IRecord";

export default interface IStore {

    Initialize(): Promise<any>;

    GetLastRecord(): Promise<IRecord>;
    GetLastRecordTimeStamp(): Promise<number>;
    GetRecordById(id: string): Promise<IRecord>;
    GetAllRecords(): Promise<IRecord[]>;

    Upsert(records: IRecord | IRecord[]): Promise<IRecord[] | IRecord>;
    Count(): number;

    //Delete(records: IRecord | IRecord[]): Promise<void>;
    Delete(predicate: (record: IRecord) => boolean): Promise<void>;

    ClearPushData(records: IRecord[]): void;
    GetPushData(): Promise<IRecord[]>;

    OnPushDataChanged: Function;
}