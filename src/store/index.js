import { createStore, applyMiddleware } from 'redux'
import { rootReducer } from './rootReducer'
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';

export var store;

export function configureStore() {
  store = createStore(
    rootReducer,
    composeWithDevTools(
      applyMiddleware(
        thunk,
        reduxImmutableStateInvariant()
      )
    )
  );
  return store;
}