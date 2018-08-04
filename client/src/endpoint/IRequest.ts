export default interface IRequest{
    fetch(url:string, request:any) : Promise<any>;
}