import {Operate} from './operate';

export class Notification {
    constructor(public id: string,
                public time: number,
                public message: string,
                public operate: Operate,
                public data: any) {
    }
}