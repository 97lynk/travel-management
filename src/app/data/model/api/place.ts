import {ResponseResource} from '../extra/response-resource';

export class Place extends ResponseResource<Place> {

  constructor(public id: number = 0,
              public name: string = '',
              public url: string = '',
              public imageUrl: string = '',
              public latitude: number = 0,
              public longitude: number = 0,
              public countPlan: number = 0,
              public parent: Place = new Place(),
              public parentId: number = 0) {
    super();
  }
}
