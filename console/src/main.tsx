import { createRoot } from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from "react-router";
import './index.css'
import './i18n/index'
import Layout from './components/layout/Layout';
import { Login } from './view/Login';
import { NotFound } from './view/NotFound';
import { Stacks } from './view/Stacks';
import { Toaster } from './components/ui/toaster';
import { Stack } from './view/Stack';
import { DataExplorer } from './view/DataExplorer';
import { Settings } from './view/settings/Settings';
import { NodeSetting } from './view/settings/NodeSetting';
import { BasicSetting } from './view/settings/BasicSetting';

const routers = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/stack",
        element: <Stacks />
      },
      {
        path: "/stack/:node/:stack",
        element: <Stack />
      },
      {
        path: "/stack/:node/:stack/data",
        element: <DataExplorer />
      },
      {
        path: "/settings",
        element: <Settings />,
        children: [
          {
            path: "/settings",
            element: <Navigate to="/settings/basic" />
          },
          {
            path: "/settings/node",
            element: <NodeSetting />
          },
          {
            path: "/settings/basic",
            element: <BasicSetting />
          }
        ]
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
])

createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={routers} />
    <Toaster />
  </>
)
