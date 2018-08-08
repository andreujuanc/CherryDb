import IRecord from "./IRecord";

export default interface IStore {
    
    GetLastRecord(): IRecord ;
    GetLastRecordTimeStamp(): number;
    GetRecordById(id: string): IRecord;
    GetAllRecords(): Promise<IRecord[]>;
    
    Upsert(records: IRecord | IRecord[]): IRecord[] | IRecord;
    Count(): number;
    
    ClearPushData(records: IRecord | IRecord[]);
    GetPushData(): Promise<IRecord | IRecord[]>;
}