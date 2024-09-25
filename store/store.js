import { configureStore } from "@reduxjs/toolkit";
import profileReducer from "./slices/profileSlice";
import buyersReducer from "./slices/buyersSlice";
import sellersReducer from "./slices/sellerSlice";
import managersReducer from "./slices/managersSlice";
import clientsReducer from "./slices/clientsSlice";
export const store = configureStore({
  reducer: {
    profileData: profileReducer,
    buyers: buyersReducer,
    sellers: sellersReducer,
    managers: managersReducer,
    clients: clientsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
