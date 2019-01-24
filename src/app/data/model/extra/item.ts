export class Item {

    constructor(public id: string | number,
                public planId: number,
                public noTicketAdult: number,
                public noTicketChild: number,
                public updateTime: number) {
    }
}