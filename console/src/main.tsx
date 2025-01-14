import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import './i18n/index'
import Layout from './components/layout/Layout';
import { App } from './view/App';
import { Login } from './view/Login';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route element={<Layout />}>
        <Route path='/app' element={<App />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
