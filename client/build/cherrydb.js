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

    var Sync = (function () {
        function Sync(data, remote) {
            this._data = data;
            this._remote = remote;
        }
        Sync.prototype.Start = function () {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    var lastId = null;
                    var lastRecord = this._data.GetLastRecord();
                    if (lastRecord != null)
                        lastId = lastRecord.id;
                    var remoteData = this._remote.getNewRecordsFrom(lastId);
                    return 1;
                }
                catch (ex) {
                    throw ex;
                }
            });
        };
        return Sync;
    }());

    var Store = (function () {
        function Store() {
            this._data = [];
        }
        Store.prototype.GetLastRecord = function () {
            if (this._data.length === 0)
                return null;
            return this._data[0];
        };
        Store.prototype.GetLastRecordTimeStamp = function () {
            var lastRecord = this.GetLastRecord();
            if (lastRecord == null)
                return 0;
            return lastRecord.timestamp;
        };
        Store.prototype.Upsert = function (record) {
            var index = this._data[record.id];
            if (index) {
                this._data[index] = record;
            }
            else {
                this._data.push(record);
            }
        };
        return Store;
    }());

    var Record = (function () {
        function Record() {
        }
        return Record;
    }());

    //import { Promise } from "es6-promise";
    var Remote = (function () {
        function Remote(endpoint) {
            this._endpoint = endpoint;
        }
        Remote.prototype.getNewRecordsFrom = function (recordId) {
            return fetch("" + this._endpoint)
                .then(function (response) {
                if (response.ok)
                    return response.json();
                return null;
            })
                .then(function (items) { return items.map(function (x) { return new Record(); }); })
                .finanlly(function (x) {
            });
        };
        Remote.prototype.Send = function (record) {
            return __awaiter(this, void 0, Promise, function* () {
                return new Promise(function (r) { return r(record); });
            });
        };
        return Remote;
    }());

    var CheeryDb = (function () {
        function CheeryDb(endpoint) {
            this._data = new Store();
            this._remote = new Remote(endpoint);
            this._sync = new Sync(this._data, this._remote);
        }
        CheeryDb.prototype.Start = function () {
            var syncResult = this._sync.Start();
            return true;
        };
        return CheeryDb;
    }());

    return CheeryDb;

})));
//# sourceMappingURL=cherrydb.js.map
