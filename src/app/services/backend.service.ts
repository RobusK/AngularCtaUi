import {Injectable} from '@angular/core';
import gql from 'graphql-tag';
import {Apollo} from 'apollo-angular';
import {LocationService} from './location.service';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {LocationResponse} from '../model/response';
import {combineLatest, Observable, of, throwError} from 'rxjs';
import {REQUEST_STATE} from '../model/request_state.enum';

const getClosestStops = gql`
  query getThings($latitude: Float, $longitude: Float) {
  closestStops(Lat: $latitude, Lon: $longitude, Limit:5){
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
        switchMap((coords: Coordinates) => {
          return combineLatest([
            this._requestClosestStops(coords),
            of(coords)
          ]);
        }),
        map(([result, coords]: [any, Coordinates]) => [result.data.closestStops, coords]),
        map(([results, coords]: [any, Coordinates]) => {
          return results.map((result) => {
            result.Distance = this.locationService.calculateDistance(result.Lat, result.Lon, coords.latitude, coords.longitude, 'M');
            return result;
          });
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

  private _requestClosestStops(coords: Coordinates) {
    return this.apollo
      .query({
        query: getClosestStops,
        variables: {latitude: coords.latitude, longitude: coords.longitude},
        fetchPolicy: 'network-only'
      }).pipe(
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
