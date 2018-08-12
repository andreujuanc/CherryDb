(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.cherrydbcient = factory());
}(this, (function () { 'use strict';

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments)).next());
        });
    }

    class Sync {
        constructor(data, remote) {
            this._data = data;
            this._remote = remote;
        }
        Pull() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const TS = this._data.GetLastRecordTimeStamp();
                    //console.log('Last record', lastRecord)
                    const remoteData = yield this._remote.getNewRecordsFrom(TS);
                    this._data.Upsert(remoteData);
                    if (this.OnSyncCompleted)
                        this.OnSyncCompleted();
                    return 1;
                }
                catch (ex) {
                    throw ex;
                }
            });
        }
        Push() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    let pushData = yield this._data.GetPushData();
                    let pushResult = yield this._remote.Send(pushData);
                    yield this._data.ClearPushData(pushResult);
                }
                catch (ex) {
                    throw ex;
                }
            });
        }
        PollSync() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.Push();
                yield this.Pull();
                setTimeout(() => this.PollSync(), 2000);
            });
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
        getNewRecordsFrom(timestamp) {
            return __awaiter(this, void 0, Promise, function* () {
                let response = yield this._request.fetch(`${this._endpoint}${this._path}/from/${timestamp}`, {});
                if (!response.ok)
                    return [];
                let items = yield response.json();
                if (Array.isArray(items))
                    items.map(mapToRecord);
                return items;
            });
        }
        Send(record) {
            return __awaiter(this, void 0, Promise, function* () {
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
        Upsert(record) {
            return __awaiter(this, void 0, Promise, function* () {
                return yield this._store.Upsert(record);
            });
        }
    }

    return CheeryDb;

})));
//# sourceMappingURL=cherrydb.js.map
