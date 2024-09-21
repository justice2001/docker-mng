import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import Login from './views/Login';
import Compose from './views/Compose';
import Home from './views/Home';
import Images from './views/Images';
import Backups from './views/Backups';
import AppStore from './views/AppStore';
import ComposeDetail from './views/ComposeDetail.tsx';
import Settings from './views/Settings.tsx';
import DataManagement from './views/DataManagement.tsx';

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
        path: '/compose/:endpoint/:name/data',
        element: <DataManagement />,
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
        path: '/settings/:tab',
        element: <Settings />,
      },
      {
        path: '/settings',
        element: <Settings />,
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
