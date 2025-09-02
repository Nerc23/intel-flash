import React, { useState } from 'react';
import { Check, Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const PlanSelection = () => {
  const [selectedPlan, setSelectedPlan] = useState<'freemium' | 'premium'>('freemium');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const plans = [
    {
      id: 'freemium' as const,
      name: 'Freemium',
      price: 'Free',
      icon: <Sparkles className="w-6 h-6 text-accent" />,
      badge: 'Perfect to Start',
      features: [
        '5 AI-generated flashcards per day',
        'Basic study modes',
        'Personal study tracking',
        'Mobile responsive design'
      ],
      className: 'border-accent/20 bg-accent/5'
    },
    {
      id: 'premium' as const,
      name: 'Premium',
      price: '$9.99/month',
      icon: <Crown className="w-6 h-6 text-warning" />,
      badge: 'Most Popular',
      features: [
        'Unlimited AI flashcard generation',
        'Advanced study modes & analytics',
        'Custom categories & tags',
        'Export & sharing features',
        'Priority support',
        'Ad-free experience'
      ],
      className: 'border-warning/20 bg-warning/5 ring-2 ring-warning/30'
    }
  ];

  const handleSelectPlan = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to select a plan.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan_type: selectedPlan })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Plan selected!",
        description: `You've successfully selected the ${selectedPlan} plan.`,
      });

      // Redirect to appropriate page based on plan
      if (selectedPlan === 'premium') {
        window.location.href = '/upgrade';
      } else {
        window.location.href = '/generator';
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update your plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Select the perfect plan to start your AI-powered learning journey
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={`cursor-pointer transition-all duration-300 ${plan.className} ${
              selectedPlan === plan.id ? 'scale-105' : 'hover:scale-102'
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                {plan.icon}
                <CardTitle className="text-xl">{plan.name}</CardTitle>
              </div>
              <Badge variant="secondary" className="mb-2">
                {plan.badge}
              </Badge>
              <CardDescription className="text-2xl font-bold text-foreground">
                {plan.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {selectedPlan === plan.id && (
                <div className="mt-4 p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm font-medium text-primary text-center">
                    Selected Plan
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          onClick={handleSelectPlan}
          disabled={loading}
          className="btn-hero px-12"
        >
          {loading ? 'Setting up...' : `Continue with ${selectedPlan === 'freemium' ? 'Free' : 'Premium'} Plan`}
        </Button>
        
        <p className="mt-4 text-sm text-muted-foreground">
          You can change your plan anytime in your account settings
        </p>
      </div>
    </div>
  );
};

export default PlanSelection;