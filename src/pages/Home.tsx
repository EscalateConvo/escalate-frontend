import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Loader2, LogOut, User, Mail, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Home() {
  const { user, firebaseUser, loading, logout } = useAuth();
  const navigate = useNavigate();


  // Show loading state while auth is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50/50">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!firebaseUser) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Section */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground text-lg">
            Here's your account information
          </p>
        </div>

        {/* User Info Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 sm:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            {/* User Profile Section */}
            <div className="flex items-start gap-4 pb-6 border-b border-border">
              <div className="flex-shrink-0">
                {user?.photoURL ? (
                  <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg ring-2 ring-primary/10">
                    <Avatar className="h-full w-full rounded-full">
                      <AvatarImage src={user.photoURL} className="object-cover" />
                      <AvatarFallback className="rounded-full">{user.name}</AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg ring-2 ring-primary/10">
                    <User className="h-8 w-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-semibold text-foreground mb-1">
                  {user?.name || 'User'}
                </h2>
                <p className="text-muted-foreground text-sm capitalize">
                  {user?.type || 'Member'}
                </p>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Email Address
                  </p>
                  <p className="text-foreground break-all">
                    {user?.email || firebaseUser.email}
                  </p>
                </div>
              </div>

              {user?.name && user.name !== (user?.email || firebaseUser.email) && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                  <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Full Name
                    </p>
                    <p className="text-foreground">
                      {user.name}
                    </p>
                  </div>
                </div>
              )}

              {user?.type && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                  <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Account Type
                    </p>
                    <p className="text-foreground capitalize">
                      {user.type}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full sm:w-auto h-11 border-2 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

