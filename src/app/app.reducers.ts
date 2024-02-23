import { ActionReducerMap } from '@ngrx/store';

// * Interfaces.
import { IState } from '@core/interfaces/state.interface';

// * Reducers.
import { ecommerceReducer } from './modules/ecommerce/state/ecommerce.reducers';

export const ROOT_REDUCERS: ActionReducerMap<IState> = {
	// * ECOMMERCE.
	ecommerce: ecommerceReducer
};
