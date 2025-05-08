import UserRegPage from "../pages/user/UserRegPage";
import UserLoginPage from "../pages/user/UserLoginPage";
import ForgotPage from "../pages/user/ForgotPage";
import HomePage from "../pages/user/HomePage";
import { Navigate } from "react-router-dom";
import ProductsPage from "../pages/user/ProductsPage";
import ProductInfo from "../pages/user/ProductInfoPage";
import CartPage from "../pages/user/CartPage";
import WishListPage from "../pages/user/WishListPage";
import RequireAuth from "../redux/protect/RequireAuth";
import RequireAuthLogin from "../redux/protect/RequireAuthLogin";
import ProfilePage from "../pages/user/ProfilePage";
import UpdateProfile from "../components/user/UpdateProfile";
import UpdateProfilePage from "../pages/user/UpdateProfilePage";
import ChangePassPage from "../pages/user/ChangePassPage";
import AddressIfoPage from "../pages/user/AddressIfoPage";
import AddAddressPage from "../pages/user/AddAddressPage";
import OrderListPage from "../pages/user/OrderListPage";
import EditAddressPage from "../pages/user/EditAddressPage";
import OrderDetailViewPage from "../pages/user/OrderDetailViewPage";
import PlaceOrderPage from "../pages/user/PlaceOrderPage";
import OrderSuccessPage from "../pages/user/OrderSuccessPage";
import CartPlaceOrderPage from "../pages/user/CartPlaceOrderPage";
import WalletPage from "../pages/user/WalletPage";
import AboutUsPage from "../pages/user/AboutUsPage";
import ErrorFallback from "../components/common/ErrorFallback";

const UserRoutes = [
  {
    path: "/",
    element: <Navigate to="/home" />,
    errorElement: <ErrorFallback />
  },
  {
    path: "/login",
    element: (
      <RequireAuthLogin>
        <UserLoginPage />
      </RequireAuthLogin>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/register",
    element: (
      <RequireAuthLogin>
        <UserRegPage />
      </RequireAuthLogin>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/forgotpass",
    element: <ForgotPage />,
    errorElement: <ErrorFallback />
  },
  {
    path: "/home",
    element: <HomePage />,
    errorElement: <ErrorFallback />
  },
  {
    path: "/products",
    element: <ProductsPage />,
    errorElement: <ErrorFallback />
  },
  {
    path: "/productinfo/:id",
    element: <ProductInfo />,
    errorElement: <ErrorFallback />
  },
  {
    path: "/cart",
    element: (
      <RequireAuth>
        <CartPage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/wishlist",
    element: (
      <RequireAuth>
        <WishListPage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/profile",
    element: (
      <RequireAuth>
        <ProfilePage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/edit-profile",
    element: (
      <RequireAuth>
        <UpdateProfilePage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/change-password",
    element: (
      <RequireAuth>
        <ChangePassPage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/address-managment",
    element: (
      <RequireAuth>
        <AddressIfoPage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/add-address",
    element: (
      <RequireAuth>
        <AddAddressPage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/edit-address",
    element: (
      <RequireAuth>
        <EditAddressPage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/orders-list",
    element: (
      <RequireAuth>
        <OrderListPage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/order-detail-view/:id",
    element: (
      <RequireAuth>
        <OrderDetailViewPage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/place-order/:id/:size/:quantity",
    element: (
      <RequireAuth>
        <PlaceOrderPage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/order-confirmation",
    element: (
      <RequireAuth>
        <OrderSuccessPage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/place-order-cart",
    element: (
      <RequireAuth>
        <CartPlaceOrderPage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/wallet",
    element: (
      <RequireAuth>
        <WalletPage />
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/about-us",
    element: (
      <RequireAuth>
        <AboutUsPage/>
      </RequireAuth>
    ),
    errorElement: <ErrorFallback />
  },
];

export default UserRoutes;
