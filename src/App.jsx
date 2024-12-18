import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserRoutes from "./routes/UserRoutes";
import adminRoutes from "./routes/AdminRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store/Store";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SearchProvider } from "../utils/SearchContext";
const queryClient = new QueryClient();
function App() {
  const routes = [...UserRoutes, ...adminRoutes];
  const router = createBrowserRouter(routes);
  return (
    <>
      <SearchProvider>
        <GoogleOAuthProvider clientId="219704044238-4d6bubph17v3upukj1l8j8fm2huk1tv1.apps.googleusercontent.com">
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
              </QueryClientProvider>
            </PersistGate>
          </Provider>
        </GoogleOAuthProvider>
      </SearchProvider>
    </>
  );
}

export default App;
