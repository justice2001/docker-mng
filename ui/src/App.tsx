import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Login from './views/Login';
import Compose from './views/Compose';
import Home from './views/Home';
import Images from './views/Images';
import Backups from './views/Backups';
import AppStore from './views/AppStore';
import { SettingOutlined } from '@ant-design/icons';
import ComposeDetail from './views/ComposeDetail.tsx';

const routeConfig = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/compose',
        element: <Compose />,
      },
      {
        path: '/compose/:endpoint/:name',
        element: <ComposeDetail />,
      },
      {
        path: '/images',
        element: <Images />,
      },
      {
        path: '/backups',
        element: <Backups />,
      },
      {
        path: '/store',
        element: <AppStore />,
      },
      {
        path: '/settings',
        element: <SettingOutlined />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={routeConfig} />
    </>
  );
}

export default App;
