import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/apiService';
import { toast } from 'sonner';
import { Loader2, User, Building2 } from 'lucide-react';
import { queryClient } from '@/lib/apiService';
import { QUERY_KEYS } from '@/constants';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState<'USER' | 'ORGANIZATION' | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelect = (role: 'USER' | 'ORGANIZATION') => {
    setSelectedRole(role);
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setLoading(true);
    try {
      if (selectedRole === 'ORGANIZATION') {
        await apiClient.post('/api/auth/upgrade-to-org', {
          orgType: 'COMPANY',
          orgDescription: 'Company Admin'
        });
      }
      
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER.GET_USER] });
      localStorage.removeItem('needsRoleSelection');
      toast.success('Role selected successfully!');
      
      setTimeout(() => {
        navigate('/home');
      }, 500);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Failed to set role';
      toast.error(errorMessage);
      console.error('Error setting role:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-50/50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white rounded-2xl shadow-xl border border-green-100 p-8 sm:p-10 space-y-8 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Choose Your Role
            </h1>
            <p className="text-sm text-muted-foreground">
              Select how you want to use Escalate
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <button
              onClick={() => handleRoleSelect('USER')}
              disabled={loading}
              className={`
                group relative p-8 rounded-xl border-2 transition-all duration-200
                ${selectedRole === 'USER'
                  ? 'border-primary bg-primary/5 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-primary/50 hover:shadow-md hover:scale-102'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`
                  p-4 rounded-full transition-colors
                  ${selectedRole === 'USER' ? 'bg-primary/10' : 'bg-gray-100 group-hover:bg-primary/5'}
                `}>
                  <User className={`h-12 w-12 ${selectedRole === 'USER' ? 'text-primary' : 'text-gray-600'}`} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Test Taker</h3>
                  <p className="text-sm text-muted-foreground">
                    Practice customer service scenarios and improve your skills
                  </p>
                </div>
                {selectedRole === 'USER' && (
                  <div className="absolute top-4 right-4">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('ORGANIZATION')}
              disabled={loading}
              className={`
                group relative p-8 rounded-xl border-2 transition-all duration-200
                ${selectedRole === 'ORGANIZATION'
                  ? 'border-primary bg-primary/5 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-primary/50 hover:shadow-md hover:scale-102'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className={`
                  p-4 rounded-full transition-colors
                  ${selectedRole === 'ORGANIZATION' ? 'bg-primary/10' : 'bg-gray-100 group-hover:bg-primary/5'}
                `}>
                  <Building2 className={`h-12 w-12 ${selectedRole === 'ORGANIZATION' ? 'text-primary' : 'text-gray-600'}`} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Company Admin</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and manage training modules for your team
                  </p>
                </div>
                {selectedRole === 'ORGANIZATION' && (
                  <div className="absolute top-4 right-4">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>
          </div>

          <div className="pt-6">
            <Button
              onClick={handleSubmit}
              disabled={!selectedRole || loading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up your account...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
