import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useAppStore } from '../store/useAppStore';

export const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, initialized } = useAuthStore();
  const { fetchData, workProfiles, loading } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      fetchData(user.uid);
    }
  }, [user, fetchData]);

  if (!initialized) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check for onboarding
  if (!loading && workProfiles.length === 0 && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If already completed onboarding and trying to access it, go to dashboard
  if (!loading && workProfiles.length > 0 && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
