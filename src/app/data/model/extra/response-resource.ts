import {Link} from './link';
import {Page} from './page';

export class ResponseResource<T> {

    links: Link[];
    content: T[]; // for response data with array
    page: Page;

}