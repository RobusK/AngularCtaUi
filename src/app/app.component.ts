import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NEVER, Observable} from 'rxjs';
import {REQUEST_STATE} from './model/request_state.enum';
import {LocationResponse} from './model/response';
import {BackendService} from './services/backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  public info$: Observable<LocationResponse> = NEVER;
  public readonly REQUEST_STATE = REQUEST_STATE;
  public displayedColumns = ['RouteID', 'Destination', 'TimeLeft'];

  constructor(private backendService: BackendService) {
  }

  public ngOnInit(): void {
    this.refreshData();
  }

  public refreshData(): void {
    this.info$ = this.backendService.getClosestStops();
  }
}
