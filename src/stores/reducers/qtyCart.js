import {
    TOTAL_QTY_CART,
    REMOVE_QTY_CART
} from "../actions/actionTypes";

const initialState = {
    qtyCart: []
  };

  const qtyCartReducer = (state = initialState, action) => {
    console.log("Check Actions QTY :")
    console.log(action)  
    switch (action.type) {
      case TOTAL_QTY_CART:
      return {
          ...state,
          qtyCart: action.payload
      }
      case REMOVE_QTY_CART:
        console.log("Qty Berhasil Di Remove")
      return {
        ...state,
        qtyCart: []
      };
      default:
      return state;
    }
  };

export default qtyCartReducer;