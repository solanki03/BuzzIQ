import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SSOCallback from './pages/SSOCallback.jsx'; 
import QuizDashboard from './pages/QuizDashboard';
import NotFound from './pages/NotFound';
import QuizPage from './pages/QuizPage.jsx';
import Results from './pages/Results.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/sso-callback", element: <SSOCallback /> },
  { path: "/quiz-dashboard", element: <QuizDashboard /> },
  { path: "/quiz-page", element: <QuizPage /> },
  { path: "/quiz-results", element: <Results /> },
  { path: "*", element: <NotFound /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
);
