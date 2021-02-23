import {gql, Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';


import {LocationService} from './location.service';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {LocationResponse} from '../model/response';
import {Observable, of, throwError} from 'rxjs';
import {REQUEST_STATE} from '../model/request_state.enum';

const getClosestStops = gql`
  query getThings($latitude: Float, $longitude: Float) {
  closestStops(Lat: $latitude, Lon: $longitude, Limit:10){
    CommonName
    Lat
    Lon
    StopID,
    Predictions{
      Delayed
      Destination
      Direction
      RouteID
      TimeLeft
    }
  }
}
`;

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private apollo: Apollo, private locationService: LocationService) {
  }

  public getClosestStops(): Observable<LocationResponse> {
    return this.locationService.getPosition()
      .pipe(
        switchMap((coords: GeolocationCoordinates) => {
          return this._requestClosestStops(coords);
        }),
        map((requestResult) => {
          return requestResult.result.data.closestStops.map((result: any) => ({
            ...result,
            Distance: this.locationService.calculateDistance(
              result.Lat,
              result.Lon,
              requestResult.coords.latitude,
              requestResult.coords.longitude,
              'M'),
          }));
        }),
        map((result: any): LocationResponse => {
          return {data: result, status: REQUEST_STATE.SUCCESS};
        }),
        startWith({status: REQUEST_STATE.LOADING}),
        catchError((e) => {
          if (typeof e === 'number') {
            return of({data: undefined, status: e});
          }
          return of({status: REQUEST_STATE.UNKNOWN});
        })
      );
  }

  private _requestClosestStops(coords: GeolocationCoordinates): Observable<{ result: any, coords: GeolocationCoordinates }> {
    return this.apollo
      .query({
        query: getClosestStops,
        variables: {latitude: coords.latitude, longitude: coords.longitude},
        fetchPolicy: 'network-only'
      }).pipe(
        map((result: any) => {
          return {result, coords};
        }),
        catchError((e) => {
          if (e.networkError) {
            return throwError(REQUEST_STATE.NETWORK_ISSUE);
          } else {
            return throwError(REQUEST_STATE.UNKNOWN);
          }
        })
      );

  }
}
