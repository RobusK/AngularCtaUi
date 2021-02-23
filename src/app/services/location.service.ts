import {Injectable} from '@angular/core';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Observable} from 'rxjs';
import {REQUEST_STATE} from '../model/request_state.enum';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private static errorCodes: { [key: number]: REQUEST_STATE } = {
    1: REQUEST_STATE.LOCATION_PERMISSION_DENIED,
    2: REQUEST_STATE.LOCATION_UNAVAILABLE,
    3: REQUEST_STATE.LOCATION_TIMEOUT
  };

  public getPosition(): Observable<GeolocationCoordinates> {
    return fromPromise(new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
          resolve(resp.coords);
        },
        err => {
          reject(LocationService.errorCodes[err.code]);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000
        });
    }));

  }

  public calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit = 'M'): number {
    if ((lat1 === lat2) && (lon1 === lon2)) {
      return 0;
    } else {
      const radlat1 = Math.PI * lat1 / 180;
      const radlat2 = Math.PI * lat2 / 180;
      const theta = lon1 - lon2;
      const radtheta = Math.PI * theta / 180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === 'K') {
        dist = dist * 1.609344;
      }
      if (unit === 'N') {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }
}
