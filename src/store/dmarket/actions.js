/**
* Redux Actions
*/
import { 
  LOAD_AUTH_SUCCESS,
  LOAD_AUTH_LOGOUT,
  LOAD_PRODUCTS
} from './types'

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

export function loadProducts(productListings) {
  return { 
    type: LOAD_PRODUCTS,
    productListings
  }
}