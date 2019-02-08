/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var Sync = /** @class */ (function () {
    function Sync(data, remote) {
        this._data = data;
        this._remote = remote;
    }
    Sync.prototype.Pull = function () {
        return __awaiter(this, void 0, void 0, function () {
            var TS, remoteData, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this._data.GetLastRecordTimeStamp()];
                    case 1:
                        TS = _a.sent();
                        return [4 /*yield*/, this._remote.getNewRecordsFrom(TS)];
                    case 2:
                        remoteData = _a.sent();
                        this._data.Upsert(remoteData);
                        if (this.OnSyncCompleted)
                            this.OnSyncCompleted();
                        return [2 /*return*/, 1];
                    case 3:
                        ex_1 = _a.sent();
                        throw ex_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Sync.prototype.Push = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pushData, pushResult, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this._data.GetPushData()];
                    case 1:
                        pushData = _a.sent();
                        if (!(pushData.length > 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._remote.Send(pushData)];
                    case 2:
                        pushResult = _a.sent();
                        if (!Array.isArray(pushResult))
                            pushResult = [pushResult];
                        return [4 /*yield*/, this._data.ClearPushData(pushResult)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        ex_2 = _a.sent();
                        throw ex_2;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Sync.prototype.PollSync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.Push()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.Pull()];
                    case 2:
                        _a.sent();
                        setTimeout(function () { return _this.PollSync(); }, 2000);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Sync;
}());

var Record = /** @class */ (function () {
    function Record() {
    }
    return Record;
}());

//import { Promise } from "es6-promise";
var mapToRecord = function (item) { return Object.assign(new Record(), item); };
var Remote = /** @class */ (function () {
    function Remote(endpoint, request) {
        this._path = '/cherrydb';
        this._endpoint = endpoint;
        this._request = request;
    }
    Remote.prototype.getNewRecordsFrom = function (timestamp) {
        return __awaiter(this, void 0, void 0, function () {
            var response, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._request.fetch("" + this._endpoint + this._path + "/from/" + timestamp, {
                        // mode:'no-cors'
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        items = _a.sent();
                        if (Array.isArray(items))
                            items.map(mapToRecord);
                        return [2 /*return*/, items];
                }
            });
        });
    };
    Remote.prototype.Send = function (record) {
        return __awaiter(this, void 0, void 0, function () {
            var data, isArray;
            return __generator(this, function (_a) {
                //console.log('posting to ', `${this._endpoint}${this._path}`)
                if (record == null)
                    return [2 /*return*/, Promise.resolve([])];
                data = JSON.stringify(record);
                isArray = Array.isArray(record);
                if (Array.isArray(record) && record.length == 0)
                    return [2 /*return*/, Promise.resolve([])];
                //console.log('data', data)
                /**
                 * Must do something like this to make it sexier!
                 * https://youtu.be/fRgFVNhSJEc?t=55m43s
                 */
                return [2 /*return*/, this._request.fetch("" + this._endpoint + this._path, {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: data
                    })
                        .then(function (response) {
                        //console.log('response', response.ok)
                        if (response.ok)
                            return response.json();
                        return [];
                    })
                        .then(function (x) { return isArray ? x.map(mapToRecord) : mapToRecord(x); })
                        .then(function (x) {
                        //console.log(x);
                        return x;
                    })];
            });
        });
    };
    return Remote;
}());

var FetchRequest = /** @class */ (function () {
    function FetchRequest() {
    }
    FetchRequest.prototype.fetch = function (url, request) {
        return fetch.apply(window, arguments);
    };
    return FetchRequest;
}());

var StoreBase = /** @class */ (function () {
    function StoreBase() {
    }
    StoreBase.prototype.uuidv4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    return StoreBase;
}());

//import localforage from "localforage";
var IndexDbStore = /** @class */ (function (_super) {
    __extends(IndexDbStore, _super);
    function IndexDbStore(dbName) {
        var _this = _super.call(this) || this;
        _this._objectStoreName = 'cherrydb';
        _this._dbName = dbName;
        return _this;
    }
    IndexDbStore.prototype.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var request = indexedDB.open(_this._dbName, 1);
                        request.onsuccess = function (event) {
                            _this.db = request.result;
                            resolve(event);
                        };
                        request.onupgradeneeded = function (event) {
                            //@ts-ignore
                            var db = event.target.result;
                            var objectStore = db.createObjectStore(_this._objectStoreName, { keyPath: "id" });
                            objectStore.createIndex('id', 'id');
                            // for (var i in customerData) {
                            //     objectStore.add(customerData[i]);
                            // }
                        };
                        request.onerror = function (event) { return reject(event); };
                    })];
            });
        });
    };
    IndexDbStore.prototype.GetAllRecords = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var store = _this.db.transaction([_this._objectStoreName])
                            .objectStore(_this._objectStoreName);
                        var myIndex = store.index('id');
                        var getAllKeysRequest = myIndex.getAll();
                        getAllKeysRequest.onsuccess = function () {
                            resolve(getAllKeysRequest.result);
                        };
                    })];
            });
        });
    };
    IndexDbStore.prototype.GetLastRecord = function () {
        throw new Error('GetLastRecord not implemented');
    };
    IndexDbStore.prototype.GetLastRecordTimeStamp = function () {
        throw new Error('GetLastRecordTimeStamp not implemented');
    };
    IndexDbStore.prototype.GetRecordById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var store = _this.db.transaction([_this._objectStoreName])
                            .objectStore(_this._objectStoreName);
                        var request = store.getKey(id);
                        request.onsuccess = function (result) { return resolve(request.result); };
                        request.onerror = function (error) { return reject(error); };
                    })];
            });
        });
    };
    IndexDbStore.prototype.upsert = function (record) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var storedRecord, store, request;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (record.id == null) {
                                        record.id = this.uuidv4();
                                        //this._push.push(record);
                                    }
                                    return [4 /*yield*/, this.GetRecordById(record.id)];
                                case 1:
                                    storedRecord = _a.sent();
                                    store = this.db.transaction([this._objectStoreName], 'readwrite')
                                        .objectStore(this._objectStoreName);
                                    request = store
                                        .add(record);
                                    request.onerror = function (error) { return reject(error); };
                                    request.onsuccess = function (event) { return resolve(record); };
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    IndexDbStore.prototype.Upsert = function (records) {
        return __awaiter(this, void 0, void 0, function () {
            var isArray, i, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (records == null)
                            return [2 /*return*/, null]; //TODO: throw?
                        isArray = Array.isArray(records);
                        if (!Array.isArray(records)) {
                            records = [records];
                        }
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < records.length)) return [3 /*break*/, 4];
                        _a = records;
                        _b = i;
                        return [4 /*yield*/, this.upsert(records[i])];
                    case 2:
                        _a[_b] = _c.sent();
                        _c.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (isArray)
                            return [2 /*return*/, records];
                        else
                            return [2 /*return*/, records[0]];
                        return [2 /*return*/];
                }
            });
        });
    };
    IndexDbStore.prototype.Count = function () {
        throw new Error('Count not implemented');
    };
    IndexDbStore.prototype.ClearPushData = function (records) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('ClearPushData not implemented');
            });
        });
    };
    IndexDbStore.prototype.GetPushData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('GetPushData not implemented');
            });
        });
    };
    return IndexDbStore;
}(StoreBase));

var MemoryStore = /** @class */ (function (_super) {
    __extends(MemoryStore, _super);
    function MemoryStore() {
        var _this = _super.call(this) || this;
        _this.mainDataFilter = function (item) { return item.deleted != true; };
        _this._data = [];
        _this._push = [];
        return _this;
    }
    MemoryStore.prototype.Initialize = function () {
        return;
    };
    MemoryStore.prototype.GetLastRecord = function () {
        return __awaiter(this, void 0, void 0, function () {
            var filtered;
            return __generator(this, function (_a) {
                filtered = this._data.filter(function (x) { return x.timestamp; });
                if (filtered.length === 0)
                    return [2 /*return*/, null];
                if (filtered.length === 1)
                    return [2 /*return*/, this._data[0]];
                return [2 /*return*/, filtered.reduce(function (a, b) { return a.timestamp && b.timestamp && a.timestamp > b.timestamp ? a : b; })];
            });
        });
    };
    MemoryStore.prototype.GetLastRecordTimeStamp = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lastRecord;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.GetLastRecord()];
                    case 1:
                        lastRecord = _a.sent();
                        if (lastRecord == null)
                            return [2 /*return*/, 0];
                        return [2 /*return*/, Promise.resolve(lastRecord.timestamp)];
                }
            });
        });
    };
    MemoryStore.prototype.GetRecordById = function (id) {
        if (id == null)
            return null; //TODO: throw?
        return Promise.resolve(this._data.slice().find(function (x) { return x.id == id; }));
    };
    MemoryStore.prototype.upsert = function (record) {
        if (record.id == null) {
            record.id = this.uuidv4();
            this._push.push(record);
        }
        // else if(record.timestamp){
        //     this._push.push(record);
        // }
        var index = this._data.findIndex(function (x) { return x.id == record.id; });
        if (index >= 0) {
            this._data[index] = record;
        }
        else {
            this._data.push(record);
        }
        return record;
    };
    MemoryStore.prototype.delete = function (record) {
        if (!record) {
            throw new Error('Must pass a valid record');
        }
        var dbRecordIndex = this._data.findIndex(function (x) { return x.id == record.id; });
        var dbRecord = this._data[dbRecordIndex];
        dbRecord.deleted = true; //marked as deleted
        this._push.push(dbRecord);
        return dbRecord;
    };
    MemoryStore.prototype.Upsert = function (records) {
        if (records == null)
            return null; //TODO: throw?
        var isArray = Array.isArray(records); //DAMN TS COMPILER.
        if (!Array.isArray(records)) {
            records = [records];
        }
        for (var i = 0; i < records.length; i++) {
            records[i] = this.upsert(records[i]);
        }
        if (isArray)
            return Promise.resolve(records);
        else
            return Promise.resolve(records[0]);
    };
    MemoryStore.prototype.Count = function () {
        return this._data.filter(this.mainDataFilter).length;
    };
    // async Delete(records: IRecord | IRecord[]): Promise<void>{
    //     throw new Error('Not implemented');
    // }
    MemoryStore.prototype.Delete = function (predicate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve(this._data.filter(predicate)
                        .forEach(this.delete.bind(this)))];
            });
        });
    };
    MemoryStore.prototype.GetAllRecords = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve(this._data.slice().filter(this.mainDataFilter))];
            });
        });
    };
    MemoryStore.prototype.ClearPushData = function (records) {
        return __awaiter(this, void 0, void 0, function () {
            var i, index;
            return __generator(this, function (_a) {
                if (records == null)
                    return [2 /*return*/];
                for (i = 0; i < records.length; i++) {
                    index = this._push.findIndex(function (x) { return x.id == records[i].id; });
                    this._push.splice(index, 1);
                }
                return [2 /*return*/];
            });
        });
    };
    MemoryStore.prototype.GetPushData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (x) { return x(_this._push.slice()); })];
            });
        });
    };
    return MemoryStore;
}(StoreBase));

var CheeryDb = /** @class */ (function () {
    function CheeryDb(endpoint, store) {
        this._started = false;
        this._onChangeCallbacks = [];
        if (endpoint == null)
            throw new Error('First argument "endpoint" is mandatory');
        if (typeof endpoint != 'string')
            throw new Error('First argument "endpoint" must be a valid url');
        if (endpoint.length < 3)
            throw new Error('First argument "endpoint" must be a valid url');
        if (store == null)
            throw new Error('You must provide a valid store');
        this._store = store;
        this._fetchRequest = new FetchRequest();
        this._remote = new Remote(endpoint, this._fetchRequest);
        this._sync = new Sync(this._store, this._remote);
    }
    CheeryDb.prototype.Start = function (onchangeCallback) {
        if (this._started)
            return;
        this._started = true;
        this._sync.OnSyncCompleted = onchangeCallback;
        var syncResult = this._sync.PollSync();
        return true;
    };
    CheeryDb.prototype.getStore = function () {
        return this._store;
    };
    CheeryDb.prototype.Upsert = function (record) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._store.Upsert(record)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    CheeryDb.prototype.Delete = function (predicate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._store.Delete(predicate)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return CheeryDb;
}());

export default CheeryDb;
export { IndexDbStore, MemoryStore };
//# sourceMappingURL=cherrydb.js.map
