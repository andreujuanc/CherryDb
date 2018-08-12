class Sync {
    constructor(data, remote) {
        this._data = data;
        this._remote = remote;
    }
    async Pull() {
        try {
            const TS = this._data.GetLastRecordTimeStamp();
            //console.log('Last record', lastRecord)
            const remoteData = await this._remote.getNewRecordsFrom(TS);
            this._data.Upsert(remoteData);
            if (this.OnSyncCompleted)
                this.OnSyncCompleted();
            return 1;
        }
        catch (ex) {
            throw ex;
        }
    }
    async Push() {
        try {
            let pushData = await this._data.GetPushData();
            let pushResult = await this._remote.Send(pushData);
            await this._data.ClearPushData(pushResult);
        }
        catch (ex) {
            throw ex;
        }
    }
    async PollSync() {
        await this.Push();
        await this.Pull();
        setTimeout(() => this.PollSync(), 2000);
    }
}

class Record {
}

//import { Promise } from "es6-promise";
const mapToRecord = (item) => Object.assign(new Record(), item);
class Remote {
    constructor(endpoint, request) {
        this._path = '/cherrydb';
        this._endpoint = endpoint;
        this._request = request;
    }
    async getNewRecordsFrom(timestamp) {
        let response = await this._request.fetch(`${this._endpoint}${this._path}/from/${timestamp}`, {
        // mode:'no-cors'
        });
        if (!response.ok)
            return [];
        let items = await response.json();
        if (Array.isArray(items))
            items.map(mapToRecord);
        return items;
    }
    async Send(record) {
        //console.log('posting to ', `${this._endpoint}${this._path}`)
        if (record == null)
            return Promise.resolve([]);
        const data = JSON.stringify(record);
        var isArray = Array.isArray(record);
        if (Array.isArray(record) && record.length == 0)
            return Promise.resolve([]);
        //console.log('data', data)
        /**
         * Must do something like this to make it sexier!
         * https://youtu.be/fRgFVNhSJEc?t=55m43s
         */
        return this._request.fetch(`${this._endpoint}${this._path}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: data
        })
            .then((response) => {
            //console.log('response', response.ok)
            if (response.ok)
                return response.json();
            return [];
        })
            .then(x => isArray ? x.map(mapToRecord) : mapToRecord(x))
            .then(x => {
            //console.log(x);
            return x;
        });
    }
}

class FetchRequest {
    fetch(url, request) {
        console.log('REAL SHIT');
        return fetch.apply(window, arguments);
    }
}

class CheeryDb {
    constructor(endpoint, store) {
        this._started = false;
        this._onChangeCallbacks = [];
        if (endpoint == null)
            throw new Error('First argument "endpoint" is mandatory');
        if (typeof endpoint != 'string')
            throw new Error('First argument "endpoint" must be a valid url');
        if (endpoint.length < 3)
            throw new Error('First argument "endpoint" must be a valid url');
        this._store = store;
        this._fetchRequest = new FetchRequest();
        this._remote = new Remote(endpoint, this._fetchRequest);
        this._sync = new Sync(this._store, this._remote);
    }
    Start(onchangeCallback) {
        if (this._started)
            return;
        this._started = true;
        this._sync.OnSyncCompleted = onchangeCallback;
        var syncResult = this._sync.PollSync();
        return true;
    }
    getStore() {
        return this._store;
    }
    async Upsert(record) {
        return await this._store.Upsert(record);
    }
}

export default CheeryDb;
//# sourceMappingURL=cherrydb.js.map
