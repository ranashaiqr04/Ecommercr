import { createBrowserRouter } from "react-router-dom"; // ✅ استخدم react-router-dom وليس react-router
import MainLayout from "./layout/MainLayout";
import ErrorPages from "./pages/error/ErrorPages";
import Home from "./pages/home/Home";
import Shop from "./pages/shop/Shop";
import Cart from "./pages/cart/Cart";
import LogIn from "./pages/login/LogIn";
import Register from "./pages/register/Register";
import Reset from "./pages/reset/Rest";
import VerifyCode from "./pages/verify code/VerifyCode";
import Product from "./pages/product/Product";
import Checkout from "./pages/checkout/Checkout";
import Profile from "./pages/profile/Profile";
import Orders from "./pages/profile/Orders";
import Info from "./pages/profile/Info";
import ChangePassword from "./pages/profile/ChangePassword";
import Category from "./pages/category/Category";
import CategoryProducts from "./pages/categoryP/CategoryProducts";
const routes = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPages />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product/:id",
        element: <Product />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/profile",
        element: <Profile />,
        children: [
          { index: true, element: <Info /> }, // /profile
          { path: "info", element: <Info /> }, // /profile/info
          { path: "change-password", element: <ChangePassword /> }, // /profile/change-password
          { path: "orders", element: <Orders /> }, // /profile/orders
        ],
      },

      {
        path: "/login",
        element: <LogIn />,
      },
      {
        path: "regiter",
        element: <Register />,
      },
      {
        path: "resetPassword",
        element: <Reset />,
      },

      {
        path: "/verify-code",
        element: <VerifyCode />,
      },{
        path:"/category",
        element:<Category/>
      },
         { path: "category/:id", element: <CategoryProducts /> }
    ],
  },
]);

export default routes;
