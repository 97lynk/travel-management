export class Item {

  constructor(public id: string | number = 0,
              public planId: number = 0,
              public noTicketAdult: number = 0,
              public noTicketChild: number = 0,
              public updateTime: number = 0) {
  }
}