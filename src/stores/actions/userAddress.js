import {
  SET_LIST_USER_ADDRESSES
} from './actionTypes';

export const setListUserAddress = (userAddresses) => {
  return {
    type: SET_LIST_USER_ADDRESSES,
    payload: userAddresses
  };
};