//@flow
import {applyMiddleware, createStore,compose} from 'redux';
import promiseMiddleware from 'redux-promise';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';

import {reducers} from './ducks';

const store = createStore(reducers,
  {},
  applyMiddleware(
    promiseMiddleware,
    thunk,
    // createLogger()
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