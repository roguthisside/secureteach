
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Lock, 
  Eye, 
  Download, 
  Tv2, 
  Fingerprint,
  ArrowRight,
  CheckCircle 
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Index = () => {
  // Refs for animated sections
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.2 }
    );
    
    // Observe all reveal elements
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));
    
    // Observe all reveal lists
    const revealLists = document.querySelectorAll('.reveal-list');
    revealLists.forEach((el) => observer.observe(el));
    
    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
      revealLists.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-32 md:pb-24" ref={heroRef}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-accent/70 text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium reveal">
              <Shield className="h-4 w-4" />
              <span>Advanced Security for Educators</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight reveal">
              Secure Your Educational Content with Confidence
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto reveal">
              Protect your valuable educational videos from unauthorized use, screen recording, 
              and downloads with our powerful anti-piracy solution.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 reveal">
              <Button size="lg" asChild>
                <Link to="/register" className="gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="mt-16 max-w-5xl mx-auto reveal">
            <div className="glass-card rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1607968565043-36af90dde238?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80" 
                alt="Secure Video Platform" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-accent/30" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 reveal">
            <h2 className="text-3xl md:text-4xl font-bold">
              Comprehensive Security Features
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to protect your educational content from unauthorized use.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 reveal-list">
            {/* Feature 1 */}
            <div className="glass-card rounded-xl p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-5">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Prevent Screenshots</h3>
              <p className="text-muted-foreground">
                Automatically detect and block screenshot attempts to keep your content secure.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="glass-card rounded-xl p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-5">
                <Tv2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Block Screen Recording</h3>
              <p className="text-muted-foreground">
                Advanced protection against screen recording software to safeguard your videos.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="glass-card rounded-xl p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-5">
                <Download className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Prevent Downloads</h3>
              <p className="text-muted-foreground">
                Disable video downloading capabilities to maintain control over your content.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="glass-card rounded-xl p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-5">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Block Window Sharing</h3>
              <p className="text-muted-foreground">
                Prevent content from being shared through screen sharing applications.
              </p>
            </div>
            
            {/* Feature 5 */}
            <div className="glass-card rounded-xl p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-5">
                <Fingerprint className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dynamic Watermarking</h3>
              <p className="text-muted-foreground">
                Add unique watermarks with student information to discourage unauthorized sharing.
              </p>
            </div>
            
            {/* Feature 6 */}
            <div className="glass-card rounded-xl p-6 transition-all hover:shadow-lg">
              <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-5">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Integration</h3>
              <p className="text-muted-foreground">
                Simple embed codes that work seamlessly with your existing website or platform.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24" ref={stepsRef}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 reveal">
            <h2 className="text-3xl md:text-4xl font-bold">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Protect your educational content in just a few simple steps.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 reveal-list">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5 relative">
                  <Upload className="h-7 w-7" />
                  <div className="absolute top-0 right-0 bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload Content</h3>
                <p className="text-muted-foreground">
                  Upload your educational videos to our secure platform.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5 relative">
                  <Lock className="h-7 w-7" />
                  <div className="absolute top-0 right-0 bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Configure Security</h3>
                <p className="text-muted-foreground">
                  Select the security features and watermark options to protect your content.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5 relative">
                  <Shield className="h-7 w-7" />
                  <div className="absolute top-0 right-0 bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Embed & Secure</h3>
                <p className="text-muted-foreground">
                  Copy the generated embed code to your website and your content is protected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials (placeholder) */}
      <section className="py-16 md:py-24 bg-accent/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 reveal">
            <h2 className="text-3xl md:text-4xl font-bold">
              Trusted by Educators
            </h2>
            <p className="text-lg text-muted-foreground">
              Hear from educators who have secured their content with our platform.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto reveal-list">
            {/* Testimonial 1 */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
                <blockquote className="text-foreground italic mb-6 flex-grow">
                  "SecureTeach has transformed how I share my premium course content. I no longer worry about unauthorized sharing or piracy. The watermarking feature has been a game-changer!"
                </blockquote>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary font-medium">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">Dr. Jane Davis</p>
                    <p className="text-sm text-muted-foreground">Online Math Educator</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                </div>
                <blockquote className="text-foreground italic mb-6 flex-grow">
                  "The setup was incredibly easy, and the customer support has been outstanding. Since implementing SecureTeach's protection, I've seen a significant increase in my paid enrollment rates."
                </blockquote>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <span className="text-primary font-medium">MS</span>
                  </div>
                  <div>
                    <p className="font-medium">Michael Smith</p>
                    <p className="text-sm text-muted-foreground">Digital Skills Instructor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24" ref={ctaRef}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center glass-card rounded-xl p-8 md:p-12 reveal">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Secure Your Educational Content?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of educators who trust SecureTeach to protect their valuable content. 
              Get started today with our easy-to-use platform.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/register">Create Your Account</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">
                  <Shield className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                <span>Free tier available</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
