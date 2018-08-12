import IStore from "../IStore";
import StoreBase from "./StoreBase";
import IRecord from "../IRecord";
//import localforage from "localforage";


export default class IndexDbStore extends StoreBase implements IStore {

    private db: IDBDatabase;
    private _dbName: string;
    private objectStore = 'cherrydb';
    constructor(dbName: string) {
        super();
        this._dbName = dbName;
    }

    async Initialize(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            
            let request = indexedDB.open(this._dbName, 1);
            request.onsuccess = (event) => {
                this.db = request.result;
                resolve(event)
            };
            request.onerror = (event) => reject(event);
        });
    }

    async GetAllRecords(): Promise<IRecord[]> {
        return new Promise<IRecord[]>((resolve, reject) => {
            var tx = this.db.transaction(this._dbName);
            var store = this.db.createObjectStore(this._dbName);
            //var store = tx.objectStore('store');
            var myIndex = store.index('index');
            
            //Can someone tell me how to fix this?
            //Thought it was part of the webworkers types
            
            var getAllKeysRequest = myIndex.getAllKeys();
            getAllKeysRequest.onsuccess = function () {
                resolve(getAllKeysRequest.result);
            };
        });
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