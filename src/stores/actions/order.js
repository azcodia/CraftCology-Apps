import {
  SET_LIST_ORDER, 
  UPDATE_ORDER,
  UNSET_LIST_ORDER,
  SELECT_ORDER
} from './actionTypes';

export const setListOrder = (orders) => {
  return {
    type: SET_LIST_ORDER,
    payload: orders
  };
};

export const selectOrder = (order) => {
  return {
    type: SELECT_ORDER,
    payload: order
  };
};

export const updateOrder = (order) => {
  return {
    type: UPDATE_ORDER,
    payload: order
  };
};

export const unsetListOrder = () => {
  return {
    type: UNSET_LIST_ORDER
  };
};