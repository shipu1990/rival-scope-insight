import { MainLayout } from '@/components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Compare = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page where the compare form is
    navigate('/');
  }, [navigate]);

  return (
    <MainLayout title="Compare" subtitle="Redirecting...">
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </MainLayout>
  );
};

export default Compare;
