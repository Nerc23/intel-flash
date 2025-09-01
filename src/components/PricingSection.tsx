
import React from 'react';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingSection = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: <Sparkles className="w-6 h-6" />,
      features: [
        'Unlimited flashcard creation',
        'Up to 3 subjects',
        'Basic AI generation',
        'Mobile responsive design',
        'Export to text'
      ],
      limitations: [
        'Limited to 3 subjects',
        'Basic AI models only'
      ],
      buttonText: 'Start Free',
      buttonVariant: 'secondary' as const,
      popular: false
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      description: 'Unlimited learning potential',
      icon: <Crown className="w-6 h-6" />,
      features: [
        'Unlimited flashcard creation',
        'Unlimited subjects',
        'Advanced AI models',
        'Smart spaced repetition',
        'Progress analytics',
        'Export to multiple formats',
        'Priority support',
        'Offline access'
      ],
      limitations: [],
      buttonText: 'Upgrade to Premium',
      buttonVariant: 'hero' as const,
      popular: true
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="text-hero inline">Learning Plan</span>
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Start free and upgrade when you're ready to unlock unlimited potential
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`relative study-card ${plan.popular ? 'border-primary/50 animate-pulse-glow' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="space-y-6">
                {/* Plan Header */}
                <div className="text-center">
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-card-content">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className="p-1 rounded-full bg-accent/10">
                        <Check className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <div className="text-sm font-medium text-warning mb-2">Limitations:</div>
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-warning/60" />
                        <span className="text-xs text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                <Button 
                  className={`w-full ${plan.buttonVariant === 'hero' ? 'btn-hero' : 'btn-secondary'}`}
                  onClick={() => window.location.href = plan.popular ? '/generator' : '/demo'}
                >
                  {plan.popular && <Zap className="w-4 h-4 mr-2" />}
                  {plan.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* IntaSend Integration Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface/50 border border-border">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-muted-foreground">
              Secure payments powered by IntaSend - Perfect for African markets
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
