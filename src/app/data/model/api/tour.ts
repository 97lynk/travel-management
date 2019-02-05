import {ResponseResource} from '../extra/response-resource';

export class Tour extends ResponseResource<Tour> {

  constructor(public id: number = 0,
              public name: string = '',
              public url: string = '',
              public imageUrl: string = '',
              public fileContentUrl: string = '',
              public description: string = '',
              public numberOfDate: number = 0,
              public numberOfNight: number = 0,
              public createAt: string = '',
              public createBy: string = '') {
    super();
  }

}
