import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/useAppStore';
import { SplashScreen } from './SplashScreen';

export const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, initialized: authInitialized } = useAuthStore();
  const { fetchData, workProfiles, initialized: appInitialized } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    if (user && !appInitialized) {
      fetchData(user.uid);
    }
  }, [user, appInitialized, fetchData]);

  // Wait for auth to initialize
  if (!authInitialized) {
    return <SplashScreen />;
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, wait for app data to initialize
  if (!appInitialized) {
    return <SplashScreen />;
  }

  // Check for onboarding
  const hasCompletedOnboarding = workProfiles.length > 0;

  if (!hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If already completed onboarding and trying to access it, go to dashboard
  if (hasCompletedOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
