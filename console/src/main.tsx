import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from "react-router";
import './index.css'
import './i18n/index'
import Layout from './components/layout/Layout';
import { App } from './view/App';
import { Login } from './view/Login';
import { NotFound } from './view/NotFound';

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
        path: "/apps",
        element: <App />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
])

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={routers} />
)
