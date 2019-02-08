import IRecord from "../IRecord";
import IStore from "../IStore";
import StoreBase from "./StoreBase";

export default class MemoryStore extends StoreBase implements IStore {

    private mainDataFilter = (item: IRecord) => item.deleted != true;

    Initialize(): Promise<any> {
        return;
    }

    private _data: IRecord[];
    private _push: IRecord[];

    constructor() {
        super();
        this._data = [];
        this._push = [];
    }

    async GetLastRecord(): Promise<IRecord> {
        const filtered = this._data.filter(x => x.timestamp);
        if (filtered.length === 0) return null;
        if (filtered.length === 1) return this._data[0];
        return filtered.reduce((a, b) => a.timestamp && b.timestamp && a.timestamp > b.timestamp ? a : b);
    }
    async GetLastRecordTimeStamp(): Promise<number> {
        const lastRecord = await this.GetLastRecord();
        if (lastRecord == null)
            return 0;
        return Promise.resolve(lastRecord.timestamp);
    }

    GetRecordById(id: string): Promise<IRecord> {
        if (id == null) return null; //TODO: throw?
        return Promise.resolve(this._data.slice().find(x => x.id == id));
    }

    private upsert(record: IRecord): IRecord {
        if (record.id == null) {
            record.id = this.uuidv4();
            this._push.push(record);
        }
        // else if(record.timestamp){
        //     this._push.push(record);
        // }
        
        const index = this._data.findIndex(x => x.id == record.id);
        if (index >= 0) {
            this._data[index] = record;
        }
        else {
            this._data.push(record);
        }
        return record;
    }

    private delete(record: IRecord): IRecord {
        if (!record) {
            throw new Error('Must pass a valid record');
        }
        const dbRecordIndex = this._data.findIndex(x => x.id == record.id);
        const dbRecord  = this._data[dbRecordIndex];
        dbRecord.deleted = true; //marked as deleted
        this._push.push(dbRecord);
        return dbRecord;
    }

    Upsert(records: IRecord | IRecord[]): Promise<IRecord[] | IRecord> {
        if (records == null) return null; //TODO: throw?
        const isArray = Array.isArray(records);//DAMN TS COMPILER.
        if (!Array.isArray(records)) { records = [records] };

        for (let i = 0; i < records.length; i++) {
            records[i] = this.upsert(records[i]);
        }
        if (isArray)
            return Promise.resolve(records);
        else
            return Promise.resolve(records[0]);
    }

    Count(): number {
        return this._data.filter(this.mainDataFilter).length;
    }

    // async Delete(records: IRecord | IRecord[]): Promise<void>{
    //     throw new Error('Not implemented');
    // }

    async Delete(predicate: (record: IRecord) => boolean): Promise<void> {
        return Promise.resolve(
            this._data.filter(predicate)
                .forEach(this.delete.bind(this))
        );
    }

    async GetAllRecords(): Promise<IRecord[]> {
        return Promise.resolve(this._data.slice().filter(this.mainDataFilter));
    }

    async ClearPushData(records: IRecord[]) {
        if (records == null) return;
        for (var i = 0; i < records.length; i++) {
            let index = this._push.findIndex(x => x.id == records[i].id)
            this._push.splice(index, 1);
        }
    }

    async GetPushData(): Promise<IRecord[]> {        
        return new Promise<IRecord[]>(x => x(this._push.slice()));
    }
}