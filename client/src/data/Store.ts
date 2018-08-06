import IRecord from "./IRecord";

export default class Store {
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private _data: IRecord[];
    private _push: IRecord[];
    
    constructor() {
        this._data = [];
    }

    GetLastRecord(): IRecord {
        if (this._data.length === 0) return null;
        return this._data[0];
    }
    GetLastRecordTimeStamp(): number {
        const lastRecord = this.GetLastRecord();
        if (lastRecord == null)
            return 0;
        return lastRecord.timestamp;
    }

    GetRecordById(id: string): IRecord {
        if (id == null) return null; //TODO: throw?
        return this._data.find(x => x.id == id);
    }

    private upsert(record: IRecord): IRecord {
        if (record.id == null)
            record.id = this.uuidv4();
        const index = this._data[record.id];
        if (index) {
            this._data[index] = record;
        }
        else {
            this._data.push(record);
        }
        return record;
    }

    Upsert(records: IRecord | IRecord[]): IRecord[] | IRecord {
        if (records == null) return null; //TODO: throw?
        const isArray = Array.isArray(records);//DAMN TS COMPILER.
        if (!Array.isArray(records)) { records = [ records] };

        for (let i = 0; i < records.length; i++) {
            records[i] = this.upsert(records[i]);
        }
        if (isArray)
            return records;
        else
            return records[0];
    }

    Count(): number {
        return this._data.length;
    }
    
    GetAllRecords(): IRecord[] {
        return this._data;
    }
}