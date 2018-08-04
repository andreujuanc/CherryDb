import IRecord from "../data/IRecord";
import Record from "../data/Record";
import IRequest from "./IRequest";
//import { Promise } from "es6-promise";


export default class Remote {

    private _endpoint: string;
    private _request: IRequest;
    private _path: string = '/cherrydb';

    constructor(endpoint: string, request: IRequest) {
        this._endpoint = endpoint;
        this._request = request;
    }

    async getNewRecordsFrom(recordId: string): Promise<Record[]> {
        //console.log('getNewRecordsFrom', recordId)
        var response = await fetch(`${this._endpoint}${this._path}/from/${recordId}`);
        if (!response.ok)
            return [];
        var items = await response.json();
        items.map((x) => Object.assign(new Record(), x));
        return items;
    }

    async Send(record: IRecord): Promise<IRecord> {
        //console.log('posting to ', `${this._endpoint}${this._path}`)
        const data = JSON.stringify(record);
        //console.log('data', data)
        return this._request.fetch(`${this._endpoint}${this._path}`, {
            method: 'POST',
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
            .then(x => Object.assign(new Record(), x))
            .then(x => {
                //console.log(x);
                return x;
            });
    }
}