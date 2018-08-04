import IRequest from "../IRequest";
import { promises } from "fs";

export default class FetchRequest implements IRequest {
    public jsonResult: string = '';
    fetch(url: string, request: any): Promise<any> {
        return new Promise<any>(x => x({
            ok: true,
            json: () => this.jsonResult
        }))
    }

}