//@flow
import {applyMiddleware, createStore,compose} from 'redux';
import promiseMiddleware from 'redux-promise';

import {reducers} from './ducks';
let finalCreateStore;


const store = createStore(reducers,
  {},
  compose(
    promiseMiddleware
  )
);


if (module.hot) {
  // Enable hot module replacement for reducers
  module.hot.accept(() => {
    const nextRootReducer = require('./ducks').reducers;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;