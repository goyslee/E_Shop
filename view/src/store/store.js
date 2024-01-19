//view\src\store\store.js
import { createStore, applyMiddleware, compose } from 'redux';
import {thunk} from 'redux-thunk'; // Corrected import for thunk
import rootReducer from './reducers/rootReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store with persisted reducer
const store = createStore(
  persistedReducer,
  composeEnhancers(applyMiddleware(thunk))
);

// Create persistor
const persistor = persistStore(store);

export { store, persistor };

