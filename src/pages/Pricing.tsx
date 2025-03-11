
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Star, Package, DollarSign } from 'lucide-react';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  
  const plans = [
    {
      name: 'Basic',
      description: 'For individual educators and small courses',
      monthlyPrice: 19,
      yearlyPrice: 190,
      features: [
        '50 hours of video storage',
        'Basic watermarking',
        'HD streaming',
        'Basic analytics',
        '2 concurrent viewers per video',
        'Email support',
      ],
      icon: <Package className="h-8 w-8" />,
      popular: false,
    },
    {
      name: 'Professional',
      description: 'For professional educators and growing institutions',
      monthlyPrice: 49,
      yearlyPrice: 490,
      features: [
        '200 hours of video storage',
        'Advanced watermarking',
        '4K streaming',
        'Detailed analytics',
        '10 concurrent viewers per video',
        'Priority email & chat support',
        'Custom branding',
      ],
      icon: <Shield className="h-8 w-8" />,
      popular: true,
    },
    {
      name: 'Enterprise',
      description: 'For educational institutions and large organizations',
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Unlimited video storage',
        'Military-grade watermarking',
        '8K streaming',
        'Advanced analytics with exports',
        'Unlimited concurrent viewers',
        '24/7 dedicated support',
        'Custom branding & integration',
        'SSO Authentication',
        'Custom domain',
      ],
      icon: <Star className="h-8 w-8" />,
      popular: false,
    }
  ];
  
  const getSavings = (monthly: number, yearly: number) => {
    return Math.round(100 - (yearly / (monthly * 12)) * 100);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-secondary/5 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent <span className="text-primary">Pricing</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Choose the perfect plan for your educational content protection needs.
              No hidden fees, no surprises.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <Button
                variant={billingCycle === 'monthly' ? 'default' : 'outline'}
                onClick={() => setBillingCycle('monthly')}
                className="relative"
              >
                Monthly
              </Button>
              <Button
                variant={billingCycle === 'yearly' ? 'default' : 'outline'}
                onClick={() => setBillingCycle('yearly')}
                className="relative"
              >
                Yearly
                <Badge className="absolute -top-2 -right-2 bg-primary text-[10px]">
                  Save 20%
                </Badge>
              </Button>
            </div>
            
            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card key={index} className={`flex flex-col h-full relative ${
                  plan.popular ? 'border-primary shadow-lg' : 'border-border'
                }`}>
                  {plan.popular && (
                    <Badge className="absolute top-4 right-4 bg-primary">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <div className="flex justify-center mb-4 text-primary">
                      {plan.icon}
                    </div>
                    <CardTitle className="text-center">{plan.name}</CardTitle>
                    <CardDescription className="text-center">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center flex-1">
                    <div className="mb-6">
                      <span className="text-4xl font-bold">
                        ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                      </span>
                      <span className="text-muted-foreground">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                      
                      {billingCycle === 'yearly' && (
                        <div className="text-xs text-primary mt-1">
                          Save {getSavings(plan.monthlyPrice, plan.yearlyPrice)}% with annual billing
                        </div>
                      )}
                    </div>
                    
                    <ul className="space-y-3 text-left">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                      asChild
                    >
                      <Link to="/register">
                        Choose {plan.name}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Have questions about our pricing? Find answers to common questions below.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: "Can I upgrade or downgrade my plan later?",
                  a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be effective immediately with prorated billing."
                },
                {
                  q: "Do you offer a free trial?",
                  a: "Yes, we offer a 14-day free trial on all plans. No credit card required to get started."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit cards, PayPal, and for enterprise customers, we can arrange invoicing."
                },
                {
                  q: "Is there a setup fee?",
                  a: "No, there are no setup fees or hidden charges. The price you see is the price you pay."
                },
                {
                  q: "Do you offer discounts for educational institutions?",
                  a: "Yes, we offer special pricing for schools, universities, and non-profit educational organizations. Contact us for details."
                },
                {
                  q: "What happens to my content if I cancel?",
                  a: "You'll have 30 days to download your content after cancellation before it's permanently removed from our servers."
                },
              ].map((faq, idx) => (
                <Card key={idx} className="border border-border hover:border-primary/50 transition-all p-6">
                  <h3 className="font-bold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12 p-8 border border-primary/20 rounded-lg max-w-3xl mx-auto bg-secondary/5">
              <DollarSign className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Need a custom plan?</h3>
              <p className="text-muted-foreground mb-4">
                Contact our sales team to create a tailored solution for your specific needs.
              </p>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
