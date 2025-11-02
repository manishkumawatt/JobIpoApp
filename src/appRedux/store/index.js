import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { configureStore } from '@reduxjs/toolkit'

// Note: this API requires redux@>=3.1.0

const configureStores = () => {
  return configureStore({ reducer: rootReducer, middleware: [thunk] });
}

export default configureStores;
