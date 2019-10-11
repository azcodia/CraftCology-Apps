import {
  SET_LIST_ORDER,
  UPDATE_ORDER,
  UNSET_LIST_ORDER,
  SELECT_ORDER
} from "../actions/actionTypes";

const initialState = {
  orders: [],
  orderSelected: null
};

const orderReducers = (state = initialState, action) => {
  let orderSelected = initialState.orderSelected;
  switch (action.type) {
    case SET_LIST_ORDER:
      return {
        ...state,
        orders: action.payload,
        orderSelected: initialState.orderSelected
      };
    case SELECT_ORDER:
      let selectOrder = [];
      state.orders.map(value => {
        if (value.code_order == action.payload.code_order) {
          selectOrder.push(action.payload);
          orderSelected = value;
        } else {
          selectOrder.push(value);
        }
      });
      return {
        ...state,
        orders: selectOrder,
        orderSelected: orderSelected
      };
    case UPDATE_ORDER:
      updateOrder = [];
      state.orders.map(value => {
        if (value.code_order == action.payload.code_order) {
          updateOrder.push(action.payload);
          orderSelected = action.payload;
        } else {
          updateOrder.push(value);
        }
      });
      return {
        ...state,
        orders: updateOrder,
        orderSelected: orderSelected
      };
    case UNSET_LIST_ORDER:
      return {
        ...state,
        orders: initialState.orders,
        orderSelected: initialState.orderSelected
      };
    default:
      return state;
  }
};

export default orderReducers;