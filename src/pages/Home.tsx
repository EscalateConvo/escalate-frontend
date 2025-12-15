import { useAuth } from '@/context/AuthContext';
import { Loader2, Calendar, Building2, Clock, Mail, User as UserIcon, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Sidebar from '@/components/ui/Sidebar';

export default function Home() {
  const { user, loading } = useAuth();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/50">
      <Sidebar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        {user?.type === 'ORGANIZATION' ? <OrganizationHome user={user} /> : <TestTakerHome user={user} />}
      </main>
    </div>
  );
}

function TestTakerHome({ user }: { user: User | null }) {
  const pendingTests = [
    {
      id: 1,
      companyName: 'TechCorp Inc.',
      organizationName: 'TechCorp',
      assignedDate: '2025-12-10',
      dueDate: '2025-12-20',
      testType: 'Customer Service Simulation',
    },
    {
      id: 2,
      companyName: 'StartupX',
      organizationName: 'StartupX Solutions',
      assignedDate: '2025-12-12',
      dueDate: '2025-12-22',
      testType: 'Technical Support Scenario',
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground text-lg">
          You have {pendingTests.length} pending test{pendingTests.length !== 1 ? 's' : ''} to complete
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 sm:p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="flex items-start gap-4 pb-6 border-b border-border">
          <div className="flex-shrink-0">
            {user?.photoURL ? (
              <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg ring-2 ring-primary/10">
                <Avatar className="h-full w-full rounded-full">
                  <AvatarImage src={user.photoURL} className="object-cover" />
                  <AvatarFallback className="rounded-full">{user.name?.[0]}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg ring-2 ring-primary/10">
                <UserIcon className="h-8 w-8" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              {user?.name || 'User'}
            </h2>
            <p className="text-muted-foreground text-sm">Test Taker</p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
            <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Email Address
              </p>
              <p className="text-foreground break-all">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
            <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Account Type
              </p>
              <p className="text-foreground capitalize">
                {user?.type === 'USER' ? 'Test Taker' : user?.type}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
          Pending Tests
        </h2>
        
        {pendingTests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-green-100 p-12 text-center">
            <p className="text-muted-foreground text-lg">
              No pending tests at the moment
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              New assignments will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-xl shadow-lg border border-green-100 p-6 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {test.testType}
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">
                          <span className="font-medium">Organization:</span> {test.organizationName}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">
                          <span className="font-medium">Assigned:</span> {new Date(test.assignedDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">
                          <span className="font-medium">Due:</span> {new Date(test.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <button className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95">
                      Start Test
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrganizationHome({ user }: { user: User | null }) {
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Company Admin Dashboard
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-6 sm:p-8 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <div className="flex items-start gap-4 pb-6 border-b border-border">
          <div className="flex-shrink-0">
            {user?.photoURL ? (
              <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg ring-2 ring-primary/10">
                <Avatar className="h-full w-full rounded-full">
                  <AvatarImage src={user.photoURL} className="object-cover" />
                  <AvatarFallback className="rounded-full">{user.name?.[0]}</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-green-600 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg ring-2 ring-primary/10">
                {user?.name?.[0] || 'O'}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-semibold text-foreground mb-1">
              {user?.name || 'Organization'}
            </h2>
            <p className="text-muted-foreground text-sm">Company Admin</p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
            <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Email Address
              </p>
              <p className="text-foreground break-all">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
            <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Account Type
              </p>
              <p className="text-foreground">
                Company Administrator
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-6 text-foreground">Quick Actions</h3>
          <ul className="space-y-4">
            <li>
              <a 
                href="/assign-test" 
                className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors group"
              >
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                <span className="font-medium">Assign a new test</span>
              </a>
            </li>
            <li>
              <a 
                href="/manage-tests" 
                className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors group"
              >
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                <span className="font-medium">View assigned tests</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-green-100 p-8">
          <h3 className="text-xl font-semibold mb-6 text-foreground">Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Tests Assigned</span>
              <span className="text-2xl font-bold text-primary">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Completed</span>
              <span className="text-2xl font-bold text-green-600">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Pending</span>
              <span className="text-2xl font-bold text-amber-600">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
