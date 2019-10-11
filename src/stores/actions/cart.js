import {
  ADD_CART, 
  UPDATE_CART,
  REMOVE_CART,
  REMOVE_ALL_CART
} from './actionTypes';

export const addCart = (cart) => {
  return {
    type: ADD_CART,
    payload: cart
  };
};

export const updateCart = (cart) => {
  return {
    type: UPDATE_CART,
    payload: cart
  };
};

export const removeCart = (cartId) => {
  return {
    type: REMOVE_CART,
    cartId: cartId
  };
};

export const removeAllCart = () => {
  return {
    type: REMOVE_ALL_CART
  };
};