/**
* Blog Actions
*/
import { 
  LOAD_AUTH_SUCCESS,
  LOAD_AUTH_LOGOUT 
} from './types'

console.log("LOAD_AUTH_LOGOUT: ", LOAD_AUTH_LOGOUT);

export function loadAuthSuccess(account) {
  return { 
    type: LOAD_AUTH_SUCCESS,
    account
  }
}

export function loadLogOutSuccess() {
  return { 
    type: LOAD_AUTH_LOGOUT
  }
}