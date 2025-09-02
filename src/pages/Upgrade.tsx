import React, { useState } from 'react';
import { ArrowLeft, Crown, Check, Zap, Shield, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Upgrade = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: ''
  });

  const plans = [
    {
      id: 'monthly' as const,
      name: 'Premium Monthly',
      price: 'R50',
      period: 'per month',
      yearlyPrice: 'R600/year',
      savings: null,
      badge: 'Flexible',
      features: [
        'Unlimited flashcard generation',
        'Unlimited subjects',
        'Advanced AI models',
        'Smart spaced repetition',
        'Progress analytics',
        'Export to multiple formats',
        'Priority support',
        'Offline access',
        'Custom categories & tags',
        'Advanced testing modes'
      ]
    },
    {
      id: 'yearly' as const,
      name: 'Premium Yearly',
      price: 'R550',
      period: 'per year',
      yearlyPrice: 'R45.83/month',
      savings: 'Save R50',
      badge: 'Best Value',
      features: [
        'Everything in Monthly',
        '2 months free (R100 value)',
        'Priority customer support',
        'Early access to new features',
        'Advanced export options',
        'Bulk flashcard operations',
        'Team collaboration (coming soon)',
        'API access (coming soon)'
      ]
    }
  ];

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upgrade your plan.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentData.firstName || !paymentData.lastName || !paymentData.phone) {
      toast({
        title: "Required information missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // IntaSend payment integration would go here
      // For now, we'll simulate the payment process
      
      // In a real implementation, you would:
      // 1. Create an IntaSend payment request
      // 2. Redirect user to IntaSend payment page
      // 3. Handle payment callback/webhook
      // 4. Update user's plan in database
      
      toast({
        title: "Payment Integration Coming Soon",
        description: `IntaSend payment for ${selectedPlan === 'monthly' ? 'R50/month' : 'R550/year'} will be available soon. Your account will be upgraded manually.`,
      });
      
      // For demo purposes, redirect to generator
      setTimeout(() => {
        navigate('/generator');
      }, 2000);
      
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "There was an issue processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-6 border-b border-border">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Upgrade to Premium</h1>
            <p className="text-muted-foreground">Unlock unlimited learning potential</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Choose Your Plan</h2>
              <div className="space-y-4">
                {plans.map((plan) => (
                  <Card 
                    key={plan.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedPlan === plan.id 
                        ? 'ring-2 ring-primary border-primary/50' 
                        : 'hover:border-primary/30'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Crown className="w-5 h-5 text-warning" />
                          <div>
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <CardDescription>{plan.yearlyPrice}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{plan.price}</div>
                          <div className="text-sm text-muted-foreground">{plan.period}</div>
                          {plan.savings && (
                            <Badge className="mt-1 bg-accent text-accent-foreground">
                              {plan.savings}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {plan.features.slice(0, 4).map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-accent" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {plan.features.length > 4 && (
                          <div className="text-sm text-muted-foreground">
                            +{plan.features.length - 4} more features...
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Premium Benefits */}
            <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-warning" />
                  Premium Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">∞</div>
                    <div className="text-sm text-muted-foreground">Unlimited Subjects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">∞</div>
                    <div className="text-sm text-muted-foreground">Unlimited Flashcards</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">24/7</div>
                    <div className="text-sm text-muted-foreground">Priority Support</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">🚀</div>
                    <div className="text-sm text-muted-foreground">Advanced AI</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  Payment Information
                </CardTitle>
                <CardDescription>
                  Secure payment powered by IntaSend - Perfect for African markets
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={paymentData.firstName}
                      onChange={(e) => setPaymentData({ ...paymentData, firstName: e.target.value })}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={paymentData.lastName}
                      onChange={(e) => setPaymentData({ ...paymentData, lastName: e.target.value })}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={paymentData.email}
                    onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                    placeholder="john@example.com"
                    disabled
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={paymentData.phone}
                    onChange={(e) => setPaymentData({ ...paymentData, phone: e.target.value })}
                    placeholder="+27 82 123 4567"
                  />
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium">{selectedPlanData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-bold text-lg">{selectedPlanData?.price}</span>
                  </div>
                  {selectedPlan === 'yearly' && (
                    <div className="flex justify-between text-sm text-accent">
                      <span>You save:</span>
                      <span className="font-medium">R50 per year</span>
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full btn-hero"
                  onClick={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Pay {selectedPlanData?.price} with IntaSend
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  <p>✓ Secure payment processing by IntaSend</p>
                  <p>✓ Support for South African payment methods</p>
                  <p>✓ Cancel anytime, no long-term commitment</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;