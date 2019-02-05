import {Link} from './link';
import {Page} from './page';

export class ResponseResource<T> {

  constructor(public links: Link[] = [],
              public content: T[] = [], // for response data with array
              public page: Page = new Page()) {
  }
}