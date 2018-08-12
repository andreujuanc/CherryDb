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
                        _a.trys.push([0, 2, , 3]);
                        TS = this._data.GetLastRecordTimeStamp();
                        return [4 /*yield*/, this._remote.getNewRecordsFrom(TS)];
                    case 1:
                        remoteData = _a.sent();
                        this._data.Upsert(remoteData);
                        if (this.OnSyncCompleted)
                            this.OnSyncCompleted();
                        return [2 /*return*/, 1];
                    case 2:
                        ex_1 = _a.sent();
                        throw ex_1;
                    case 3: return [2 /*return*/];
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
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this._data.GetPushData()];
                    case 1:
                        pushData = _a.sent();
                        return [4 /*yield*/, this._remote.Send(pushData)];
                    case 2:
                        pushResult = _a.sent();
                        return [4 /*yield*/, this._data.ClearPushData(pushResult)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        ex_2 = _a.sent();
                        throw ex_2;
                    case 5: return [2 /*return*/];
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
        console.log('REAL SHIT');
        return fetch.apply(window, arguments);
    };
    return FetchRequest;
}());

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
    return CheeryDb;
}());

export default CheeryDb;
//# sourceMappingURL=cherrydb.js.map
