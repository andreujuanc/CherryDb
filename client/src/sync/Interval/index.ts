import IStore from "../../data/IStore";
import Remote from "../../endpoint/Remote";
import ISync from '../ISync';
import SyncBase from '../SyncBase';

export default class IntervalSync extends SyncBase  {
    
    async Start() {
        this._started = true;
        await this.PollSync();
    }

    async Stop() {
        this._started = false;
        await this.PollSync();
    }

    async PollSync() {
        if (this._started === true) {
            await this.Push();
            await this.Pull();
            setTimeout(() => this.PollSync(), 2000);
        }
    }
}