import {
  SET_LIST_USER_ADDRESSES,
  UNSET_LIST_USER_ADDRESSES
} from "../actions/actionTypes";

const initialState = {
  addresses: []
};

const userAddressesReducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIST_USER_ADDRESSES:
      return {
        ...state,
        addresses: action.payload
      };
    case UNSET_LIST_USER_ADDRESSES:
      return {
        ...state,
        addresses: initialState.addresses
      };
    default:
      return state;
  }
};

export default userAddressesReducers;