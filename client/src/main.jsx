import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { inject } from '@vercel/analytics';
import { Analytics } from '@vercel/analytics/react';
import { ClerkLoaded, ClerkLoading, ClerkProvider } from '@clerk/clerk-react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SSOCallback from './pages/SSOCallback.jsx'
import QuizDashboard from './pages/QuizDashboard'
import NotFound from './pages/NotFound'
import QuizPage from './pages/QuizPage.jsx'
import Results from './pages/Results.jsx'
import { Loader2 } from 'lucide-react'

// Initialize Vercel Analytics 
inject();

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/sso-callback", element: <SSOCallback /> },
  { path: "/quiz-dashboard", element: <QuizDashboard /> },
  { path: "/quiz/:topic", element: <QuizPage /> },
  { path: "/quiz-results", element: <Results /> },
  { path: "*", element: <NotFound /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ClerkLoading>
        <main className="h-dvh w-full flex items-center justify-center flex-col">
          <h1 className="text-[1.5vw] skeleton-text">
            Initializing the Application
          </h1>
          <p className="text-[1vw] skeleton-text pb-5 pt-1">Please wait...</p>
          <Loader2 className="animate-spin" />
        </main>
      </ClerkLoading>

      <ClerkLoaded>
        <RouterProvider router={router} />
      </ClerkLoaded>
    </ClerkProvider>
    {/* Vercel Analytics Component */}
    <Analytics />
  </React.StrictMode>
);
