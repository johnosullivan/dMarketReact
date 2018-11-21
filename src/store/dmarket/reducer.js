/**
* Blog Reducer
*/
import initialState from '../initialState'
import { 
  LOAD_AUTH_SUCCESS,
  LOAD_AUTH_LOGOUT 
} from './types'

export default function blogReducer(state = initialState.dmarket, action) {
  switch (action.type) {
    case LOAD_AUTH_SUCCESS:
      return {
        ...state,
        isAuth: true,
        uPortAccount: action.account
      } 
    case LOAD_AUTH_LOGOUT:
      return {
        ...state,
        isAuth: false,
        uPortAccount: {}
      } 
    default:
      return state
  }
}