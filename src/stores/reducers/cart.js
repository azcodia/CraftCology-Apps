import {
  ADD_CART,
  UPDATE_CART,
  REMOVE_CART,
  REMOVE_ALL_CART,
  TOTAL_QTY_CART
} from "../actions/actionTypes";

const initialState = {
  cart: []
};

const cartReducers = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CART:
      return {
        ...state,
        cart: state.cart.concat(action.payload)
      };
    case UPDATE_CART:
      let cartTemps = [];
      state.cart.map(value => {
        if (value.unique_number == action.payload.unique_number) {
          cartTemps.push(action.payload);
        } else {
          cartTemps.push(value);
        }
      });
      return {
        ...state,
        cart: cartTemps
      };
    case REMOVE_CART:
      return {
        ...state,
        cart: state.cart.filter(value => {
          return value.unique_number !== action.cartId;
        })
      };
    case REMOVE_ALL_CART:
      return {
        ...state,
        cart: []
      };
    default:
      return state;
  }
};

export default cartReducers;