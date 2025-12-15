import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Loader2, LogOut, User, Mail, Shield, Brain, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Home() {
  const { user, firebaseUser, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <div className="p-4 rounded-full bg-slate-100">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">EscalateConvo</span>
            </div>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome Section */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-600">Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's your account overview
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-background rounded-2xl shadow-sm border border-border p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              {/* Profile Header */}
              <div className="flex items-start gap-4 pb-6 border-b border-border">
                <div className="flex-shrink-0">
                  {user?.photoURL ? (
                    <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-slate-200 shadow-md">
                      <Avatar className="h-full w-full rounded-full">
                        <AvatarImage src={user.photoURL} className="object-cover" />
                        <AvatarFallback className="rounded-full bg-slate-100 text-slate-600">
                          {user.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-md">
                      {user?.name?.charAt(0) || <User className="h-8 w-8" />}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-semibold text-foreground mb-1">
                    {user?.name || 'User'}
                  </h2>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    <Shield className="h-3 w-3" />
                    {user?.type || 'Member'}
                  </div>
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-4 pt-6">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Email Address
                    </p>
                    <p className="text-foreground break-all font-medium">
                      {user?.email || firebaseUser.email}
                    </p>
                  </div>
                </div>

                {user?.name && user.name !== (user?.email || firebaseUser.email) && (
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="p-2 rounded-lg bg-slate-200">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Full Name
                      </p>
                      <p className="text-foreground font-medium">
                        {user.name}
                      </p>
                    </div>
                  </div>
                )}

                {user?.type && (
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-200">
                    <div className="p-2 rounded-lg bg-amber-100">
                      <Shield className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Account Type
                      </p>
                      <p className="text-foreground capitalize font-medium">
                        {user.type}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="lg:col-span-1">
            <div className="bg-background rounded-2xl shadow-sm border border-border p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button className="w-full justify-start h-11 bg-primary hover:bg-primary/90" disabled>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Create New Scenario
                  <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded-full">Soon</span>
                </Button>
                
                <Button variant="outline" className="w-full justify-start h-11" disabled>
                  <User className="mr-2 h-4 w-4" />
                  View Candidates
                  <span className="ml-auto text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">Soon</span>
                </Button>
                
                <Button variant="outline" className="w-full justify-start h-11" disabled>
                  <Brain className="mr-2 h-4 w-4" />
                  AI Settings
                  <span className="ml-auto text-xs bg-slate-100 px-2 py-0.5 rounded-full text-slate-500">Soon</span>
                </Button>
              </div>

              <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-amber-100">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-800">Coming Soon</p>
                    <p className="text-xs text-amber-600 mt-1">
                      New features are being developed. Stay tuned!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
