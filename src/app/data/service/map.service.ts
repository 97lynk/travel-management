import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Place} from '../model/api/place';
import {Plan} from '../model/api/plan';
import {Criteria} from '../model/extra/criteria';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  MAP_API_URL = `${environment.apiHost}/api/v1/maps`;

  PLACE_API_URL = `${environment.apiHost}/api/v1/places`;

  constructor(private http: HttpClient) {
  }

  getPlansBySearchPlace = (criterias: Criteria[] = []): Observable<Plan> => {
    const searchStr = criterias.map(c => c.key
        .concat((c.operator == '=') ? ':' : c.operator)
        .concat(c.value)).join(',');
    return this.http.get<Plan>(`${this.MAP_API_URL}/plans`, {params: {search: searchStr}});
  };

  getPlacesHasPlan = (): Observable<Place> => this.http.get<Place>(`${this.MAP_API_URL}/places`);

  getDescriptionPlace = (placeName: string): Observable<any> => {
    placeName = placeName
        .replace('Tp', '')
        .replace('Tt', '').trim();
    return this.http.get(`https://vi.wikipedia.org/w/api.php`,
        {
          params: {
            action: 'query',
            prop: 'extracts',
            exintro: '',
            explaintext: '',
            titles: placeName,
            format: 'json'
          }
        });
  };

  getPlaces = (): Observable<Place> =>  this.http.get<Place>(this.PLACE_API_URL);

  followLink = <T>(link: string): Observable<T> => this.http.get<T>(link);

}
