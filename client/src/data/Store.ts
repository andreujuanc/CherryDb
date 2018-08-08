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
        this._push = [];
    }

    GetLastRecord(): IRecord {        
        const filtered = this._data.filter(x => x.timestamp);
        if (filtered.length === 0) return null;
        if (filtered.length === 1) return this._data[0];
        return filtered.reduce((a, b) => a.timestamp && b.timestamp && a.timestamp > b.timestamp ? a : b);
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
        if (record.id == null) {
            record.id = this.uuidv4();
            this._push.push(record);
        }
        const index = this._data.findIndex(x => x.id == record.id);
        if (index >= 0) {
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
        if (!Array.isArray(records)) { records = [records] };

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

    async ClearPushData(records: IRecord | IRecord[]) {
        if (records == null) return;
        if (!Array.isArray(records))
            records = [records];
        for (var i = 0; i < records.length; i++) {
            let index = records.findIndex(x => x.id == records[i].id)
            this._push.slice(index, 1);
        }
    }

    async GetPushData(): Promise<IRecord | IRecord[]> {
        return new Promise<IRecord[]>(x => x(this._push));
    }
}