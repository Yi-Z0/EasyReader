//@flow
import { createAction,handleActions } from 'redux-actions';

const FETCH = 'novel/bookshelf/FETCH';

export const fetch = createAction(FETCH, () => {
  let realm = realmFactory();
  return realm.objects('Novel');
});

const initialState = {
  novels: [],
}

export default handleActions({
  [FETCH](state,action) {
    return {
      novels:action.payload
    };
  }
}, initialState);
