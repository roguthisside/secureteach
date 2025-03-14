
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Video, Clock, Eye, Calendar, Shield, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('activity');
  
  // This would come from your authentication system in a real app
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Educator',
    memberSince: 'January 2023',
    plan: 'Professional',
    avatar: '',
    initials: 'JD',
  };
  
  const recentActivity = [
    { action: 'Uploaded video', target: 'Introduction to Calculus', date: '2 hours ago', icon: <Upload className="h-4 w-4" /> },
    { action: 'Updated security', target: 'Advanced Physics', date: 'Yesterday', icon: <Shield className="h-4 w-4" /> },
    { action: 'Configured access', target: 'Chemistry Basics', date: '3 days ago', icon: <Eye className="h-4 w-4" /> },
    { action: 'Created video', target: 'Organic Chemistry', date: '1 week ago', icon: <Video className="h-4 w-4" /> },
  ];
  
  const stats = [
    { label: 'Total Videos', value: 24, icon: <Video className="h-5 w-5 text-primary" /> },
    { label: 'Content Hours', value: '32h', icon: <Clock className="h-5 w-5 text-primary" /> },
    { label: 'Total Views', value: 1249, icon: <Eye className="h-5 w-5 text-primary" /> },
    { label: 'Member Since', value: 'Jan 2023', icon: <Calendar className="h-5 w-5 text-primary" /> },
  ];
  
  return (
    <div className="min-h-screen bg-background pb-10">
      <Navbar />
      
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-10">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <Badge variant="secondary">{user.role}</Badge>
                <Badge className="bg-primary">{user.plan} Plan</Badge>
              </div>
              <p className="text-muted-foreground mt-1">{user.email}</p>
              <p className="text-sm text-muted-foreground">Member since {user.memberSince}</p>
              
              <div className="flex gap-3 mt-4">
                <Button size="sm" asChild>
                  <Link to="/settings">Edit Profile</Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <Link to="/upload">Upload New</Link>
                </Button>
              </div>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="mx-auto mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="activity" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="content">My Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent actions and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {recentActivity.map((item, index) => (
                      <li key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="font-medium">{item.action}: </span>
                              <span className="text-primary">{item.target}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{item.date}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  
                  <Button className="w-full mt-6" variant="outline">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>My Content</CardTitle>
                  <CardDescription>
                    All your uploaded educational content
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { 
                        title: 'Introduction to Calculus', 
                        views: 325, 
                        duration: '45:12', 
                        date: '2023-05-15',
                        thumbnail: '/placeholder.svg'
                      },
                      { 
                        title: 'Advanced Physics', 
                        views: 218, 
                        duration: '32:45', 
                        date: '2023-04-20',
                        thumbnail: '/placeholder.svg'
                      },
                      { 
                        title: 'Chemistry Basics', 
                        views: 456, 
                        duration: '28:30', 
                        date: '2023-03-10',
                        thumbnail: '/placeholder.svg' 
                      },
                    ].map((content, idx) => (
                      <div key={idx} className="flex gap-4 border-b py-4">
                        <div className="relative aspect-video w-40 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={content.thumbnail} 
                            alt={content.title} 
                            className="object-cover w-full h-full" 
                          />
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                            {content.duration}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{content.title}</h3>
                          <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" /> {content.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> {content.date}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" asChild>
                              <Link to={`/configure/${idx}`}>Edit</Link>
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10">
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-center mt-6 mb-4">
                    <Button asChild>
                      <Link to="/library">View All Content</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
