import IStore from "../IStore";
import StoreBase from "./StoreBase";
import IRecord from "../IRecord";
import { resolve } from 'url';
//import localforage from "localforage";


export default class IndexDbStore extends StoreBase implements IStore {

    private db: IDBDatabase;
    private _dbName: string;
    private _objectStoreName = 'cherrydb';
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

            request.onupgradeneeded = (event) => {
                //@ts-ignore
                let db: IDBDatabase = event.target.result;
                let objectStore = db.createObjectStore(this._objectStoreName, { keyPath: "id" });
                objectStore.createIndex('id', 'id');
                // for (var i in customerData) {
                //     objectStore.add(customerData[i]);
                // }
            }
            request.onerror = (event) => reject(event);
        });
    }

    async GetAllRecords(): Promise<IRecord[]> {
        return new Promise<IRecord[]>((resolve, reject) => {
            let store = this.db.transaction([this._objectStoreName])
                .objectStore(this._objectStoreName);
            var myIndex = store.index('id');
            var getAllKeysRequest = myIndex.getAll();
            getAllKeysRequest.onsuccess = function () {
                resolve(getAllKeysRequest.result);
            };
        });
    }

    GetLastRecord(): Promise<IRecord> {
        throw new Error('GetLastRecord not implemented');
    }
    GetLastRecordTimeStamp(): Promise<number> {
        throw new Error('GetLastRecordTimeStamp not implemented');
    }

    async GetRecordById(id: string): Promise<IRecord> {
        return new Promise<IRecord>((resolve, reject) => {
            let store = this.db.transaction([this._objectStoreName])
                .objectStore(this._objectStoreName);
            let request = store.getKey(id);
            request.onsuccess = (event) => { resolve((typeof request.result ==='string' ? JSON.parse(request.result as string)  : request.result) as IRecord) };
            request.onerror = (error) => reject(error);
        });
    }


    private async upsert(record: IRecord): Promise<IRecord> {
        return new Promise<IRecord>(async (resolve, reject) => {
            if (record.id == null) {
                record.id = this.uuidv4();
                //this._push.push(record);
            }

            let storedRecord = await this.GetRecordById(record.id)

            let store = this.db.transaction([this._objectStoreName], 'readwrite')
                .objectStore(this._objectStoreName);
            // const index = this._data.findIndex(x => x.id == record.id);
            // if (index >= 0) {
            //     this._data[index] = record;
            // }
            // else {
            //     this._data.push(record);
            // }
            // return record;
            //this.db.createObjectStore(this._dbName)


            var request = store
                .add(record);

            request.onerror = (error) => reject(error);
            request.onsuccess = (event) => resolve(record);
        });
    }

    async Upsert(records: IRecord | IRecord[]): Promise<IRecord[] | IRecord> {
        if (records == null) return null; //TODO: throw?
        const isArray = Array.isArray(records);//DAMN TS COMPILER.
        if (!Array.isArray(records)) { records = [records] };

        //TODO: parallel?
        for (let i = 0; i < records.length; i++) {
            records[i] = await this.upsert(records[i]);
        }
        if (isArray)
            return records;
        else
            return records[0];
    }

    Count(): number {
        throw new Error('Count not implemented');
    }

    async ClearPushData(records: IRecord[]) {
        throw new Error('ClearPushData not implemented');
    }

    async GetPushData(): Promise<IRecord[]> {
        throw new Error('GetPushData not implemented');
    }

    Delete(predicate: (record: IRecord) => boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
}