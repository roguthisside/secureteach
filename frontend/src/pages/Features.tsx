
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  CheckCircle, 
  Video, 
  Fingerprint, 
  Lock, 
  Database, 
  Users, 
  Activity, 
  BookOpen,
  Globe,
  Coffee,
  Sparkles,
  Code,
  FileText,
  CheckCheck,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Features = () => {
  const [activeTab, setActiveTab] = useState('security');

  const featureTabs = [
    { id: 'security', label: 'Security', icon: <Shield className="h-5 w-5" /> },
    { id: 'content', label: 'Content', icon: <Video className="h-5 w-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity className="h-5 w-5" /> },
  ];

  const features = {
    security: [
      {
        title: 'Digital Watermarking',
        description: 'Invisible watermarks embedded in every frame to prevent unauthorized sharing and identify the source of leaks.',
        icon: <Fingerprint className="h-10 w-10 text-primary" />
      },
      {
        title: 'Access Control',
        description: 'Fine-grained permissions to control who can view your educational content with time-based access options.',
        icon: <Lock className="h-10 w-10 text-primary" />
      },
      {
        title: 'Data Encryption',
        description: 'End-to-end encryption for all your uploaded content and user data with military-grade protection.',
        icon: <Database className="h-10 w-10 text-primary" />
      },
    ],
    content: [
      {
        title: 'HD Video Quality',
        description: 'Deliver your educational content in high definition without compromising security or streaming performance.',
        icon: <Video className="h-10 w-10 text-primary" />
      },
      {
        title: 'Multiple Formats',
        description: 'Support for various video formats including MP4, AVI, MOV, and more to accommodate all your content needs.',
        icon: <FileText className="h-10 w-10 text-primary" />
      },
      {
        title: 'Bulk Upload',
        description: 'Upload multiple videos at once to save time and streamline your workflow with automatic processing.',
        icon: <Database className="h-10 w-10 text-primary" />
      },
    ],
    analytics: [
      {
        title: 'Viewer Insights',
        description: 'Track who watched your videos, when, and for how long to improve engagement and identify learning patterns.',
        icon: <Users className="h-10 w-10 text-primary" />
      },
      {
        title: 'Engagement Metrics',
        description: 'Detailed analytics on viewer engagement to optimize your content and understand how students interact with materials.',
        icon: <Activity className="h-10 w-10 text-primary" />
      },
      {
        title: 'Security Reports',
        description: 'Regular reports on potential security issues and unauthorized access attempts to keep your content safe.',
        icon: <Shield className="h-10 w-10 text-primary" />
      },
    ]
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-secondary/5 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Secure Features for <span className="text-primary">Educational Content</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Discover how SecureTeach protects your valuable educational content while providing 
              an exceptional experience for your students.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Feature Tabs */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to protect and share your educational content securely.
              </p>
            </div>
            
            {/* Tabs Navigation */}
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {featureTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  className="flex items-center gap-2"
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  {tab.label}
                </Button>
              ))}
            </div>
            
            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {activeTab && features[activeTab as keyof typeof features].map((feature, idx) => (
                <Card key={idx} className="border border-border hover:border-primary/50 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-foreground/80">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* Use Cases Section - New */}
        <section className="py-16 bg-secondary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Perfect For</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                SecureTeach is designed for a variety of educational content creators
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="text-center hover:shadow-md transition-all">
                <CardHeader>
                  <BookOpen className="h-10 w-10 text-primary mx-auto mb-2" />
                  <CardTitle>Course Creators</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/80">
                    Protect premium courses from unauthorized sharing and piracy
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-md transition-all">
                <CardHeader>
                  <Globe className="h-10 w-10 text-primary mx-auto mb-2" />
                  <CardTitle>Online Schools</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/80">
                    Manage content access for enrolled students across multiple courses
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-md transition-all">
                <CardHeader>
                  <Coffee className="h-10 w-10 text-primary mx-auto mb-2" />
                  <CardTitle>Consultants</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/80">
                    Share exclusive training videos only with paying clients
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="text-center hover:shadow-md transition-all">
                <CardHeader>
                  <Code className="h-10 w-10 text-primary mx-auto mb-2" />
                  <CardTitle>Tech Educators</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/80">
                    Secure coding tutorials and technical instruction materials
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose SecureTeach?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The most comprehensive solution for protecting your educational content.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                "Military-grade encryption for all your content",
                "Custom watermarking technology",
                "Detailed viewer analytics",
                "Role-based access control",
                "Content streaming optimization",
                "24/7 technical support",
                "Regular security updates",
                "Compliance with educational standards"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button size="lg" asChild className="gap-2">
                <Link to="/register">
                  Start Your Free Trial
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Compare Plans - New */}
        <section className="py-16 bg-secondary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Compare Security Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See how our protection features compare to standard video hosting
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 bg-secondary/20 rounded-tl-lg">Features</th>
                    <th className="p-4 bg-secondary/20">Standard Platforms</th>
                    <th className="p-4 bg-primary/10 text-primary rounded-tr-lg">SecureTeach</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-left p-4 border-b border-border">Screenshot Prevention</td>
                    <td className="p-4 border-b border-border text-center text-red-500">No</td>
                    <td className="p-4 border-b border-border text-center text-green-500">
                      <CheckCheck className="h-5 w-5 inline" />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left p-4 border-b border-border">Screen Recording Block</td>
                    <td className="p-4 border-b border-border text-center text-red-500">No</td>
                    <td className="p-4 border-b border-border text-center text-green-500">
                      <CheckCheck className="h-5 w-5 inline" />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left p-4 border-b border-border">Dynamic Watermarking</td>
                    <td className="p-4 border-b border-border text-center text-red-500">No</td>
                    <td className="p-4 border-b border-border text-center text-green-500">
                      <CheckCheck className="h-5 w-5 inline" />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left p-4 border-b border-border">Download Protection</td>
                    <td className="p-4 border-b border-border text-center text-yellow-500">Limited</td>
                    <td className="p-4 border-b border-border text-center text-green-500">
                      <CheckCheck className="h-5 w-5 inline" />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left p-4 border-b border-border">Content Encryption</td>
                    <td className="p-4 border-b border-border text-center text-yellow-500">Basic</td>
                    <td className="p-4 border-b border-border text-center text-green-500">
                      <CheckCheck className="h-5 w-5 inline" />
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left p-4">Piracy Detection</td>
                    <td className="p-4 text-center text-red-500">No</td>
                    <td className="p-4 text-center text-green-500">
                      <CheckCheck className="h-5 w-5 inline" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="text-center mt-10">
              <Button variant="outline" size="lg" asChild>
                <Link to="/pricing">See Pricing Plans</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Features;
