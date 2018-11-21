/**
* Blog Reducer
*/
import initialState from '../initialState'
import { LOAD_AUTH_SUCCESS } from './types'

export default function blogReducer(state = initialState.dmarket, action) {
  switch (action.type) {
    case LOAD_AUTH_SUCCESS:
      return {
        ...state,
        isAuth: true
      } 
    default:
      return state
  }
}