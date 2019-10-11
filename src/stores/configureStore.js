import { createStore, combineReducers } from 'redux';
import userReducers from './reducers/user';
import cartReducers from './reducers/cart';
import userAddressesReducers from './reducers/userAddress';
import orderReducers from './reducers/order';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage
};

const rootReducer = combineReducers({
  user: userReducers,
  carts: cartReducers,
  userAddresses: userAddressesReducers,
  orders: orderReducers
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const configureStore = createStore(persistedReducer);

export const persistor = persistStore(configureStore);