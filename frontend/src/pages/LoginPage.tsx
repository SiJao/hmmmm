import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/assets/generated/pesantren-logo-transparent.dim_200x200.png" 
            alt="Logo Pesantren" 
            className="w-32 h-32 mx-auto mb-4 drop-shadow-lg"
          />
          <h1 className="text-3xl font-bold text-emerald-900 mb-2">
            Sistem Absensi Online
          </h1>
          <p className="text-emerald-700">
            Pesantren Daarul 'Uluum Lido
          </p>
        </div>

        <Card className="shadow-xl border-emerald-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Selamat Datang</CardTitle>
            <CardDescription className="text-center">
              Silakan masuk untuk melanjutkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Masuk
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Sistem ini menggunakan Internet Identity untuk keamanan maksimal
            </p>
          </CardContent>
        </Card>

        <footer className="text-center mt-8 text-sm text-emerald-700">
          <p>© 2025. Dibuat dengan ❤️ menggunakan <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-emerald-900">caffeine.ai</a></p>
        </footer>
      </div>
    </div>
  );
}
