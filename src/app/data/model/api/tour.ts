import {ResponseResource} from '../extra/response-resource';

export class Tour extends ResponseResource<Tour> {

    id: number = 0;
    name: string = '';
    url: string = '';
    imageUrl: string = '';
    fileContentUrl: string = '';
    description: string = '';
    numberOfDate: number = 0;
    numberOfNight: number = 0;
    createAt: string = '';
    createBy: string = '';

}
