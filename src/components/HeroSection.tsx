
import React, { useEffect, useState } from 'react';
import { Brain, Sparkles, BookOpen, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import UserNav from './UserNav';

const HeroSection = () => {
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        setUserProfile(data);
      }
    };

    if (user && !loading) {
      fetchUserProfile();
    }
  }, [user, loading]);

  return (
    <section className="relative min-h-screen flex flex-col px-4 overflow-hidden">
      {/* Navigation Bar */}
      <nav className="relative z-20 flex items-center justify-between py-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xl font-bold">AI Study Buddy</span>
        </div>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <UserNav 
              userPlan={userProfile?.plan_type} 
              userName={userProfile?.display_name} 
            />
          ) : (
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="btn-secondary flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          )}
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 animate-float" 
             style={{ animationDelay: '0s' }} />
        <div className="absolute top-3/4 right-1/4 w-48 h-48 rounded-full bg-secondary/5 animate-float" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-accent/5 animate-float" 
             style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center animate-slide-up">
        {/* Main Hero Content */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent animate-pulse" />
            <span className="text-accent font-semibold">AI-Powered</span>
          </div>
        </div>

        <h1 className="text-hero mb-6">
          Study Buddy
        </h1>
        
        <p className="text-subtitle mb-8 max-w-2xl mx-auto">
          Transform your study notes into interactive flashcards instantly with AI. 
          Study smarter, learn faster, and ace your exams.
        </p>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          {[
            {
              icon: <Brain className="w-6 h-6" />,
              title: "AI Generation",
              desc: "Smart flashcards from your notes"
            },
            {
              icon: <BookOpen className="w-6 h-6" />,
              title: "Subject Organization",
              desc: "Keep your studies organized"
            },
            {
              icon: <Sparkles className="w-6 h-6" />,
              title: "Interactive Learning",
              desc: "Engaging flip-card experience"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="study-card text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="text-card-title mb-2">{feature.title}</h3>
              <p className="text-card-content">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            className="btn-hero"
            onClick={() => window.location.href = user ? '/generator' : '/auth'}
          >
            {user ? 'Continue Creating Flashcards' : 'Start Creating Flashcards'}
          </button>
          {user && (
            <button 
              className="btn-outline"
              onClick={() => window.location.href = '/test-knowledge'}
            >
              Test Your Knowledge
            </button>
          )}
          <button 
            className="btn-secondary"
            onClick={() => window.location.href = '/demo'}
          >
            View Demo
          </button>
        </div>

        {/* Freemium Badge */}
        <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-accent">Free to start • Premium features available</span>
        </div>
      </div>
      </div>
    </section>
  );
};

export default HeroSection;
