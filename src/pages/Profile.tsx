import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If no user, gently guide to auth
    if (!user) {
      // Do not hard-redirect; let the UI show a message with a link
    }
  }, [user]);

  interface UserMetadata {
    full_name?: string;
  }
  
  const metadata = user?.user_metadata as UserMetadata;
  const fullName = metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const email = user?.email || '—';
  const userId = user?.id || '—';
  const createdAt = user?.created_at ? new Date(user.created_at).toLocaleString() : '—';

  return (
    <div className="container mx-auto px-4 py-8">
      {!user ? (
        <Card className="max-w-xl mx-auto border-2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>You are not signed in.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Sign in to view your profile details.</p>
            <div className="flex gap-3">
              <Link to="/auth">
                <Button variant="gradient">Go to Sign In</Button>
              </Link>
              <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1 border-2">
            <CardHeader className="items-center text-center">
              <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center text-2xl font-semibold">
                {fullName?.charAt(0)?.toUpperCase()}
              </div>
              <CardTitle className="mt-3">{fullName}</CardTitle>
              <CardDescription>{email}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center justify-between">
                <span>User ID</span>
                <span className="font-mono text-foreground truncate max-w-[12rem]" title={userId}>{userId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Created</span>
                <span className="text-foreground">{createdAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge variant="outline">Authenticated</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 border-2">
            <CardHeader>
              <CardTitle>Session</CardTitle>
              <CardDescription>Basic session information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Session ID</span>
                <span className="font-mono text-foreground truncate max-w-[16rem]" title={session?.access_token || '—'}>
                  {session?.access_token ? session.access_token.slice(0, 12) + '…' : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Expires At</span>
                <span className="text-foreground">
                  {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Provider</span>
                <span className="text-foreground">{user?.app_metadata?.provider || 'email'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}