import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Brain, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AuthForm from '@/components/AuthForm';
import PlanSelection from '@/components/PlanSelection';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const [step, setStep] = useState<'auth' | 'plan'>('auth');
  const { user, loading } = useAuth();

  // Redirect authenticated users to generator
  useEffect(() => {
    if (user && !loading) {
      // Check if user has completed plan selection by checking if they have a profile
      // If they don't, show plan selection, otherwise redirect to generator
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-8 h-8 text-primary animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to generator
  if (user && step === 'auth') {
    return <Navigate to="/generator" replace />;
  }

  const handleAuthSuccess = () => {
    setStep('plan');
  };

  return (
    <div className="min-h-screen bg-background px-4">
      {/* Header */}
      <header className="container mx-auto py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-bold">AI Study Buddy</h1>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12">
        <div className="max-w-6xl mx-auto">
          {step === 'auth' && (
            <div className="flex flex-col items-center">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2">Join AI Study Buddy</h2>
                <p className="text-muted-foreground max-w-md">
                  Create your account to start generating AI-powered flashcards and boost your learning
                </p>
              </div>
              
              <AuthForm onSuccess={handleAuthSuccess} />
            </div>
          )}
          
          {step === 'plan' && (
            <div className="flex flex-col items-center">
              <PlanSelection />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Auth;