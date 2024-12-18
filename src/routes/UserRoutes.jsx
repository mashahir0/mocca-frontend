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

const UserRoutes = [
  {
    path: "/",
    element: <Navigate to="/home" />,
  },
  {
    path: "/login",
    element: (
      <RequireAuthLogin>
        <UserLoginPage />
      </RequireAuthLogin>
    ),
  },
  {
    path: "/register",
    element: (
      <RequireAuthLogin>
        <UserRegPage />
      </RequireAuthLogin>
    ),
  },
  {
    path: "/forgotpass",
    element: <ForgotPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/products",
    element: <ProductsPage />,
  },
  {
    path: "/productinfo/:id",
    element: <ProductInfo />,
  },
  {
    path: "/cart",
    element: (
      <RequireAuth>
        <CartPage />
      </RequireAuth>
    ),
  },
  {
    path: "/wishlist",
    element: (
      <RequireAuth>
        <WishListPage />
      </RequireAuth>
    ),
  },
  {
    path: "/profile",
    element: (
      <RequireAuth>
        <ProfilePage />
      </RequireAuth>
    ),
  },
  {
    path: "/edit-profile",
    element: (
      <RequireAuth>
        <UpdateProfilePage />
      </RequireAuth>
    ),
  },
  {
    path: "/change-password",
    element: (
      <RequireAuth>
        <ChangePassPage />
      </RequireAuth>
    ),
  },
  {
    path: "/address-managment",
    element: (
      <RequireAuth>
        <AddressIfoPage />
      </RequireAuth>
    ),
  },
  {
    path: "/add-address",
    element: (
      <RequireAuth>
        <AddAddressPage />
      </RequireAuth>
    ),
  },
  {
    path: "/edit-address",
    element: (
      <RequireAuth>
        <EditAddressPage />
      </RequireAuth>
    ),
  },
  {
    path: "/orders-list",
    element: (
      <RequireAuth>
        <OrderListPage />
      </RequireAuth>
    ),
  },
  {
    path: "/order-detail-view/:id",
    element: (
      <RequireAuth>
        <OrderDetailViewPage />
      </RequireAuth>
    ),
  },
  {
    path: "/place-order/:id/:size/:quantity",
    element: (
      <RequireAuth>
        <PlaceOrderPage />
      </RequireAuth>
    ),
  },
  {
    path: "/order-confirmation",
    element: (
      <RequireAuth>
        <OrderSuccessPage />
      </RequireAuth>
    ),
  },
  {
    path: "/place-order-cart",
    element: (
      <RequireAuth>
        <CartPlaceOrderPage />
      </RequireAuth>
    ),
  },
  {
    path: "/wallet",
    element: (
      <RequireAuth>
        <WalletPage />
      </RequireAuth>
    ),
  },
  {
    path: "/about-us",
    element: (
      <RequireAuth>
        <AboutUsPage/>
      </RequireAuth>
    ),
  },
];

export default UserRoutes;
