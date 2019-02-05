import {Operate} from './operate';

export class Notification {

  constructor(public id: string = '',
              public time: number = Date.now(),
              public message: string = '',
              public operate: Operate = null,
              public data: any = null) {
  }
}