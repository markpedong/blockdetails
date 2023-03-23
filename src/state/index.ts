import { state } from './$$global/state';
import * as reducer from './$$global/reducer';
import { run } from 'concent';

run();

export default {
	state,
	reducer,
};
