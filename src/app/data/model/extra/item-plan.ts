import {Plan} from '../api/plan';
import {Item} from './item';

export class ItemPlan {

  constructor(public item: Item = new Item(),
              public plan: Plan = new Plan()) {
  }
}