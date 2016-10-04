//@flow
import { createAction,handleActions } from 'redux-actions';

const FETCH = 'novel/bookshelf/FETCH';

export const fetch = createAction(FETCH, async () => {
  const result = await somePromise;
  return result.someValue;
});
export const actions = {
  fetch,
}

const initialState = {
  novels: [],
}

export default handleActions({
  [FETCH](state,action) {
    return {
      ...initialState, 
      searching: true,
      keywords:action.payload
    };
  }
}, initialState);
