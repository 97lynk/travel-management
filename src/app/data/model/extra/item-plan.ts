import {Plan} from '../api/plan';
import {Item} from './item';

export class ItemPlan {
    constructor(public item: Item,
                public plan: Plan) {
    }
}