
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { User, Lock, Bell, Shield, LogOut } from 'lucide-react';
import { authService } from '@/utils/auth';
import PageHeader from '@/components/PageHeader';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [formState, setFormState] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    loginAlerts: true,
    twoFactorAuth: false,
    autoWatermark: true,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormState({
      ...formState,
      [name]: checked,
    });
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user's profile
    toast.success('Profile updated successfully!');
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formState.newPassword !== formState.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formState.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    // In a real app, this would update the user's password
    toast.success('Password updated successfully!');
    setFormState({
      ...formState,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };
  
  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update notification preferences
    toast.success('Notification preferences updated!');
  };
  
  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update security settings
    toast.success('Security settings updated!');
  };
  
  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    // Force refresh to ensure all auth states are updated
    window.dispatchEvent(new Event('storage'));
    navigate('/', { replace: true });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <PageHeader title="Account Settings" />
          <Button 
            variant="ghost" 
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Password</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formState.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your password to secure your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={formState.currentPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formState.newPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formState.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <Button type="submit">Update Password</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how and when we notify you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailNotifications" className="text-base">
                          Email Notifications
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email updates about your account and content
                        </p>
                      </div>
                      <Switch
                        id="emailNotifications"
                        checked={formState.emailNotifications}
                        onCheckedChange={(checked) => 
                          handleSwitchChange('emailNotifications', checked)
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="loginAlerts" className="text-base">
                          Login Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone logs into your account
                        </p>
                      </div>
                      <Switch
                        id="loginAlerts"
                        checked={formState.loginAlerts}
                        onCheckedChange={(checked) => 
                          handleSwitchChange('loginAlerts', checked)
                        }
                      />
                    </div>
                  </div>
                  <Button type="submit">Save Preferences</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and content protection
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSecuritySubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="twoFactorAuth" className="text-base">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Require a code in addition to your password when logging in
                        </p>
                      </div>
                      <Switch
                        id="twoFactorAuth"
                        checked={formState.twoFactorAuth}
                        onCheckedChange={(checked) => 
                          handleSwitchChange('twoFactorAuth', checked)
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoWatermark" className="text-base">
                          Automatic Watermarking
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Apply watermarks to all uploaded content automatically
                        </p>
                      </div>
                      <Switch
                        id="autoWatermark"
                        checked={formState.autoWatermark}
                        onCheckedChange={(checked) => 
                          handleSwitchChange('autoWatermark', checked)
                        }
                      />
                    </div>
                  </div>
                  <Button type="submit">Save Security Settings</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
