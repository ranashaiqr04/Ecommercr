import { createBrowserRouter } from "react-router-dom"; // ✅ استخدم react-router-dom وليس react-router
import MainLayout from './layout/MainLayout';
import ErrorPages from "./pages/error/ErrorPages";
import Home from "./pages/home/Home";
import Shop from "./pages/shop/Shop";
import Cart from "./pages/cart/Cart";
import LogIn from "./pages/login/LogIn";
import Register from "./pages/register/Register";

const routes = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPages />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path:'/shop',
        element:<Shop/>
      },
      {
        path:'/cart',
        element:<Cart/>
      },
      {
        path:'/login',
        element:<LogIn/>
      },
      {
        path:'regiter',
        element:<Register/>
      }
    ]
  }
]);

export default routes; // ✅ هذا هو المهم
