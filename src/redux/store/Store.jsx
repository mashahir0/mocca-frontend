import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default is localStorage
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slice/UserSlice";
import cartReducer from "../slice/CartSlice";

const userPersistConfig = {
  key: "root",
  storage,
};
const cartConfig = {
  key: "cart",
  storage,
};

const userPersistedReducer = persistReducer(userPersistConfig, userReducer);
const cartPersistedReducer = persistReducer(cartConfig, cartReducer);

const store = configureStore({
  reducer: {
    user: userPersistedReducer,
    // cart : cartPersistedReducer
  },
});

const persistor = persistStore(store);

export { store, persistor };
