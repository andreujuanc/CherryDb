import IStore from "../IStore";
import StoreBase from "./StoreBase";
import IRecord from "../IRecord";
import { resolve } from "url";

export default class IndexDbStore extends StoreBase implements IStore {

    private db: IDBDatabase;
    private objectStore = 'cherrydb';
    constructor(dbName: string) {
        super();
        let openRequest = window.indexedDB.open(dbName, 1);
        openRequest.onsuccess = () => {
            this.db = openRequest.result as IDBDatabase;
        };
    }

    async GetAllRecords(): Promise<IRecord[]> {
        return new Promise<IRecord[]>((resolve, reject) => {
            var tranaction = this.db.transaction(this.objectStore);
            var store = tranaction.objectStore(this.objectStore);
            var request = store.get('');
            request.onsuccess = () => {
                resolve(request.result);
            }
        })
    }

    GetLastRecord(): IRecord {    
        throw new Error('not implemented');    
    }
    GetLastRecordTimeStamp(): number {
        throw new Error('not implemented');
    }

    GetRecordById(id: string): IRecord {
        throw new Error('not implemented');
    }

    private upsert(record: IRecord): IRecord {
        // if (record.id == null) {
        //     record.id = this.uuidv4();
        //     this._push.push(record);
        // }
        // const index = this._data.findIndex(x => x.id == record.id);
        // if (index >= 0) {
        //     this._data[index] = record;
        // }
        // else {
        //     this._data.push(record);
        // }
        // return record;
        throw new Error('not implemented');
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
        throw new Error('not implemented');
    }

    async ClearPushData(records: IRecord | IRecord[]) {
        throw new Error('not implemented');
    }

    async GetPushData(): Promise<IRecord | IRecord[]> {
        throw new Error('not implemented');
    }
}