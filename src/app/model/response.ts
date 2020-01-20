import {REQUEST_STATE} from './request_state.enum';

export interface LocationResponse {
  status: REQUEST_STATE;
  data?: any;
}
