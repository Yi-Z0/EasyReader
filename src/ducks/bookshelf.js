//@flow
import { createAction,handleActions } from 'redux-actions';

const FETCH = 'novel/bookshelf/FETCH';

export const fetch = createAction(FETCH, () => {
  let realm = realmFactory();
  let novels = realm.objects('Novel');
  realm.write(()=>{
    let inactiveNovels = novels.filtered(`active=false`);
    realm.delete(inactiveNovels); // Deletes all articles
  });
  return {
    starNovels:novels.filtered('star=true and active=true').sorted('starAt',true),
    unstarNovels:novels.filtered('star=false and active=true').sorted('created',true),
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
