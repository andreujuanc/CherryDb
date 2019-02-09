import IRecord from "../data/IRecord";
import Record from "../data/Record";
import IRequest from "./IRequest";
//import { Promise } from "es6-promise";

const mapToRecord = (item: any) => Object.assign(new Record(), item);

export default class Remote {

    private _endpoint: string;
    private _request: IRequest;

    constructor(endpoint: string, request: IRequest) {
        this._endpoint = endpoint;
        this._request = request;
    }

    async getNewRecordsFrom(timestamp: number): Promise<Record[]> {
        let response = await this._request.fetch(`${this._endpoint}?from=${timestamp}`, {
           // mode:'no-cors'
        });
        if (!response.ok)
            return [];
        let items = await response.json();
        if (Array.isArray(items))
            items.map(mapToRecord);
        return items;
    }

    async Send(record: IRecord | IRecord[]): Promise<IRecord | IRecord[]> {
        //console.log('posting to ', `${this._endpoint}${this._path}`)
        if(record == null) return Promise.resolve([]);
        const data = JSON.stringify(record);
        var isArray = Array.isArray(record);
        if(Array.isArray(record) && record.length == 0 ) return Promise.resolve([]);

        //console.log('data', data)
        /**
         * Must do something like this to make it sexier!
         * https://youtu.be/fRgFVNhSJEc?t=55m43s
         */
        return this._request.fetch(`${this._endpoint}`, {
            method: 'POST',
            mode:'cors',
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