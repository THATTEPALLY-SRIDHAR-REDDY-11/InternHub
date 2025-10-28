import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  skills?: string[];
  status: 'active' | 'completed' | 'draft';
  created_at: string;
  creator_name?: string;
}

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [joinMessage, setJoinMessage] = useState('');
  const [joining, setJoining] = useState(false);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/projects`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data || [];
    },
    staleTime: 30000, // Cache for 30 seconds instead of constant refetching
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    const term = searchTerm.toLowerCase();
    return projects.filter((project: Project) =>
      (project.title || '').toLowerCase().includes(term) ||
      (project.description || '').toLowerCase().includes(term)
    );
  }, [projects, searchTerm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Projects</h1>
            <p className="text-muted-foreground">Discover and collaborate on student projects</p>
          </div>
          {user && (
            <Link to="/projects/create">
              <Button variant="gradient">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </Link>
          )}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <h3 className="text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Try a different search term' : 'Be the first to share a project!'}
            </p>
            {user && !searchTerm && (
              <Link to="/projects/create">
                <Button variant="gradient">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card key={project._id || project.id} className="border-2 hover:shadow-[var(--shadow-card)] transition-all h-full">
              {project.image_url && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="line-clamp-2 flex-1">
                    <Link to={`/projects/${project._id || project.id}`}>{project.title}</Link>
                  </CardTitle>
                  <Badge variant={(project.status ?? 'active') === 'completed' ? 'default' : 'secondary'}>
                    {project.status ?? 'active'}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.skills?.slice(0, 3).map((skill: string, idx: number) => (
                    <Badge key={idx} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                  {project.skills?.length > 3 && (
                    <Badge variant="outline">+{project.skills.length - 3}</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    by {project.owner_name || 'Anonymous'}
                  </p>
                  {project.apply_url && (
                    <a href={project.apply_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="secondary">Apply</Button>
                    </a>
                  )}
                  {!project.apply_url && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setOpenProjectId(project._id || project.id)}
                    >
                      Request to Join
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Request to Join Dialog */}
      <Dialog open={!!openProjectId} onOpenChange={(o) => { if (!o) { setOpenProjectId(null); setJoinMessage(''); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request to Join</DialogTitle>
            <DialogDescription>Tell the project owner why you’d be a great fit.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Textarea
              placeholder="Write a short message, include your skills and availability..."
              value={joinMessage}
              onChange={(e) => setJoinMessage(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setOpenProjectId(null); setJoinMessage(''); }}>Cancel</Button>
              <Button
                onClick={async () => {
                  if (!openProjectId) return;
                  if (!joinMessage.trim()) {
                    toast({ title: 'Message required', description: 'Please write a short message.' });
                    return;
                  }
                  try {
                    setJoining(true);
                    const applicantName = user?.user_metadata?.fullName || user?.user_metadata?.full_name || user?.email || 'Anonymous';
                    const applicantEmail = user?.email || null;
                    const res = await fetch(`${apiBaseUrl}/projects/${openProjectId}/applications`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ message: joinMessage.trim(), applicant_name: applicantName, applicant_email: applicantEmail }),
                    });
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    toast({ title: 'Request sent', description: 'Your collaboration request has been submitted.' });
                    setOpenProjectId(null);
                    setJoinMessage('');
                  } catch (err) {
                    console.error('Join request error', err);
                    const errorMessage = err instanceof Error ? err.message : 'Try again later';
                    toast({ title: 'Failed to send request', description: errorMessage, variant: 'destructive' });
                  } finally {
                    setJoining(false);
                  }
                }}
                disabled={joining}
                variant="gradient"
              >
                {joining ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
