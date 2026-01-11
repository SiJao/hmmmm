import { ReactNode } from 'react';
import { UserProfile, Role } from '../backend';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface DashboardLayoutProps {
  children: ReactNode;
  profile: UserProfile;
  title: string;
}

export default function DashboardLayout({ children, profile, title }: DashboardLayoutProps) {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case Role.admin:
        return 'Admin';
      case Role.ustadz:
        return 'Ustadz';
      case Role.santri:
        return 'Santri';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <header className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/assets/generated/pesantren-logo-transparent.dim_200x200.png" 
                alt="Logo" 
                className="h-12 w-12"
              />
              <div>
                <h1 className="text-xl font-bold text-emerald-900">
                  Pesantren Daarul 'Uluum Lido
                </h1>
                <p className="text-sm text-emerald-600">{title}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-emerald-600 text-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-foreground">{profile.name}</p>
                  <p className="text-xs text-muted-foreground">{getRoleLabel(profile.role)}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-emerald-200 hover:bg-emerald-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-emerald-100 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-emerald-700">
          <p>© 2025. Dibuat dengan ❤️ menggunakan <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-900">caffeine.ai</a></p>
        </div>
      </footer>
    </div>
  );
}
