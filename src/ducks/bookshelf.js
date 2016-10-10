//@flow
import { createAction,handleActions } from 'redux-actions';

const FETCH = 'novel/bookshelf/FETCH';

export const fetch = createAction(FETCH, () => {
  let realm = realmFactory();
  let novels = realm.objects('Novel');
  return {
    starNovels:novels.filtered('star=true').sorted('starAt',true),
    unstarNovels:novels.filtered('star=false'),
  };
});

const initialState = {
  starNovels: [],
  unstarNovels: [],
}

export default handleActions({
  [FETCH](state,action) {
    return action.payload;
  }
}, initialState);
