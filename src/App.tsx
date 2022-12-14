import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from './layouts/Layout';
import {
  Checkout,
  Home,
  Product,
  Products,
  Profile,
  ProfileInformation,
  ProfileMain,
  ProfileOrderHistory,
  SignIn,
} from './pages';
import { appRoutes } from './routes';

const router = createBrowserRouter([
  {
    element: <Layout withoutFooter />,
    children: [
      {
        path: appRoutes.home,
        element: <Home />,
      },
      {
        path: appRoutes.login,
        element: <SignIn />,
      },
      {
        path: appRoutes.productDetail,
        element: <Product />,
      },
      {
        path: appRoutes.checkout,
        element: <Checkout />,
      },
      {
        path: appRoutes.profile,
        element: <Profile />,
        children: [
          {
            path: '',
            element: <ProfileMain />,
          },
          {
            path: appRoutes.profileInformation,
            element: <ProfileInformation />,
          },
          {
            path: appRoutes.profileOrderHistory,
            element: <ProfileOrderHistory />,
          },
        ],
      },
      {},
    ],
  },
  {
    element: <Layout />,
    children: [
      {
        path: appRoutes.collections,
        element: <Products />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
