import {
  SET_USER,
  UNSET_USER
} from "../actions/actionTypes";

const initialState = {
  user: {
    id: null,
    customer_number: '',
    firstname: '',
    lastname: '',
    type_customer: '',
    company: '',
    email: '',
    phone: '',
    dob: '',
    gender: null,
    register_time: '',
    activation_code: '',
    is_active: '',
    social: null,
    is_password: null,
    uid: null,
    created_at: '',
    updated_at: '',
    token: '',
  },
  isLoggedIn: false
};

const userReducers = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true
      };
    case UNSET_USER:
      return {
        ...state,
        user: initialState.user,
        isLoggedIn: initialState.isLoggedIn
      };
    default:
      return state;
  }
};

export default userReducers;