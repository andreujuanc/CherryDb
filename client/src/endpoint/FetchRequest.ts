import IRequest from "./IRequest";

export default class FetchRequest implements IRequest{
    fetch(url:string, request:any): Promise<any> {
        return fetch.apply(window, arguments); 
    }
}