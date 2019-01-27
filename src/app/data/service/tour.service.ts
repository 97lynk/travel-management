import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Plan} from '../model/api/plan';
import {environment} from '../../../environments/environment';
import {Tour} from '../model/api/tour';


@Injectable({
  providedIn: 'root'
})
export class TourService {


  PLAN_API_URL = `${environment.apiHost}/api/v1/plans`;

  TOUR_API_URL = `${environment.apiHost}/api/v1/tours`;

  constructor(private http: HttpClient) {
  }

  getTours = (page: number = 0, size: number = 10): Observable<Tour> =>
      this.http.get<Tour>(`${this.TOUR_API_URL}`, {
        params: {
          page: `${page}`,
          size: `${size}`
        }
      });

  getPlanById = (id: number | string, expand: string[] = []): Observable<Plan> =>
      this.http.get<Plan>(`${this.PLAN_API_URL}/${id}`, {params: {_expand: expand.join(',')}});

  getPlans = (page: number = 0, size: number = 10, expand: string[] = []): Observable<Plan> =>
      this.http.get<Plan>(`${this.PLAN_API_URL}`, {
        params: {
          _expand: expand.join(','),
          page: `${page}`,
          size: `${size}`
        }
      });


  getPlansByPlaceId = (id: number | string): Observable<Plan> =>
      this.http.get<Plan>(this.PLAN_API_URL, {params: {placeId: `${id}`, _expand: 'tour'}});

  followLink = <T>(link: string): Observable<T> => this.http.get<T>(link);

  loadContentPostOfTour = (url: string): Observable<string> =>
      this.http.get(`${environment.apiHost}/data/contents/${url}`, {responseType: 'text'});

  updatePlanById = (id: number | string, plan: Plan) => this.http.put<Plan>(`${this.PLAN_API_URL}/${id}`, plan);

  addNewPlan = (plan: Plan) => this.http.post<Plan>(this.PLAN_API_URL, plan);

  deletePlanById = (id: number) => this.http.delete<Plan>(`${this.PLAN_API_URL}/${id}`);

}
