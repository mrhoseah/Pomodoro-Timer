import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/route.tsx';
import Settings from './routes/settings.tsx';
import Analytics from './routes/analytics.tsx';

const router = createBrowserRouter([
  {
  path: "/",
    element: <Root />,
  },
  {
    path:"/settings",
    element:<Settings />
  },
  {
    path:"/analytics",
    element:<Analytics />
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
