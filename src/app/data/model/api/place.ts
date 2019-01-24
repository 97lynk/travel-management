import {ResponseResource} from '../extra/response-resource';

export class Place extends ResponseResource<Place> {

    id: number;
    name: string;
    url: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
    countPlan: number;
    parent: Place;
    parentId?: number;

}
