import ErrorFallback from "../components/common/ErrorFallback";
import AdminAddProductPage from "../pages/admin/AdminAddProductPage";
import AdminDashPage from "../pages/admin/AdminDashPage";
import AdminEditProductPage from "../pages/admin/AdminEditProductPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminProductListPage from "../pages/admin/AdminProductListPage";
import AdminUserListPage from "../pages/admin/AdminUserListPage";
import CategoryManagmentPage from "../pages/admin/CategoryManagmentPage";
import CuponPage from "../pages/admin/CouponPage";
import ListOrderPage from "../pages/admin/ListOrderPage";
import ReqAdminAuth from "../redux/protect/ReqAdminAuth";
import ReqAdminLoginAuth from "../redux/protect/ReqAdminLoginAuth";

const adminRoutes = [
  {
    path: "/admin/login",
    element: (
      <ReqAdminLoginAuth>
        <AdminLoginPage />
      </ReqAdminLoginAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/admin/dashboard",
    element: (
      <ReqAdminAuth>
        <AdminDashPage />
      </ReqAdminAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/admin/userlist",
    element: (
      <ReqAdminAuth>
        <AdminUserListPage />
      </ReqAdminAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/admin/productlist",
    element: (
      <ReqAdminAuth>
        <AdminProductListPage />
      </ReqAdminAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/admin/addproduct",
    element: (
      <ReqAdminAuth>
        <AdminAddProductPage />
      </ReqAdminAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/admin/edit-product/:id",
    element: (
      <ReqAdminAuth>
        <AdminEditProductPage />
      </ReqAdminAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/admin/category",
    element: (
      <ReqAdminAuth>
        <CategoryManagmentPage />
      </ReqAdminAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/admin/orders",
    element: (
      <ReqAdminAuth>
        <ListOrderPage />
      </ReqAdminAuth>
    ),
    errorElement: <ErrorFallback />
  },
  {
    path: "/admin/coupon",
    element: (
      <ReqAdminAuth>
        <CuponPage />
      </ReqAdminAuth>
    ),
    errorElement: <ErrorFallback />
  },
];

export default adminRoutes;
