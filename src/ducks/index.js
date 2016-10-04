//@flow
import { combineReducers } from 'redux';

export let bookshelf = require('./bookshelf');


export const reducers = combineReducers({
  bookshelf:bookshelf.default,
});