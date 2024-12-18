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
  },
  {
    path: "/admin/dashboard",
    element: (
      <ReqAdminAuth>
        <AdminDashPage />
      </ReqAdminAuth>
    ),
  },
  {
    path: "/admin/userlist",
    element: (
      <ReqAdminAuth>
        {" "}
        <AdminUserListPage />
      </ReqAdminAuth>
    ),
  },
  {
    path: "/admin/productlist",
    element: (
      <ReqAdminAuth>
        <AdminProductListPage />
      </ReqAdminAuth>
    ),
  },
  {
    path: "/admin/addproduct",
    element: (
      <ReqAdminAuth>
        <AdminAddProductPage />
      </ReqAdminAuth>
    ),
  },
  {
    path: "/admin/edit-product/:id",
    element: (
      <ReqAdminAuth>
        <AdminEditProductPage />
      </ReqAdminAuth>
    ),
  },
  {
    path: "/admin/category",
    element: (
      <ReqAdminAuth>
        <CategoryManagmentPage />
      </ReqAdminAuth>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <ReqAdminAuth>
        <ListOrderPage />
      </ReqAdminAuth>
    ),
  },
  {
    path: "/admin/coupon",
    element: (
      <ReqAdminAuth>
        <CuponPage />
      </ReqAdminAuth>
    ),
  },
];

export default adminRoutes;
