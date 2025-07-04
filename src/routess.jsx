import { createBrowserRouter } from "react-router-dom"; // ✅ استخدم react-router-dom وليس react-router
import MainLayout from './layout/MainLayout';
import ErrorPages from "./pages/error/ErrorPages";
import Home from "./pages/home/Home";
import Shop from "./pages/shop/Shop";
import Cart from "./pages/cart/Cart";
import LogIn from "./pages/login/LogIn";
import Register from "./pages/register/Register";
import Reset from "./pages/reset/Rest";
import VerifyCode from "./pages/verify code/VerifyCode";
import Product from "./pages/product/Product";






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
        path :'/product/:id',
        element:<Product/>

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
      },
      {
          path:'resetPassword',
      element:<Reset/>
      },
            
      {
       path: '/verify-code',
       element: <VerifyCode />
      }
      
    ]
  }
]);

export default routes; 