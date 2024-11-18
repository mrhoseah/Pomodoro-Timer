import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/route';
import Settings from './routes/Settings';
import Analytics from './routes/analytics';
import { Provider } from 'react-redux';
import store from '@/app/store';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/settings',
    element: <Settings />,
  },
  {
    path: '/analytics',
    element: <Analytics />,
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
);
