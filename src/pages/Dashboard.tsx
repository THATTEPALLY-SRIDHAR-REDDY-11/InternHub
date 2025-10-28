import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, FolderKanban, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Project {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed' | 'draft';
}

interface Application {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  projects?: {
    title: string;
  };
  internships?: {
    title: string;
    company_name: string;
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
      
      // Fetch projects from backend
      const projectsResponse = await fetch(`${apiBaseUrl}/projects`);
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData || []);
      }

      // For now, we'll show empty applications since backend doesn't have user-specific data yet
      setApplications([]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Manage your projects, applications, and profile</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="border-2 hover:shadow-[var(--shadow-card)] transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Your Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-[var(--shadow-card)] transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{applications.length}</div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-[var(--shadow-card)] transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {applications.filter((app) => app.status === 'accepted').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Link to="/projects/create">
          <Card className="border-2 hover:border-primary transition-all cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Create Project</h3>
              <p className="text-sm text-muted-foreground">Share your work or start a new collaboration</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/internships/create">
          <Card className="border-2 hover:border-secondary transition-all cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Briefcase className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-semibold mb-2">Post Internship</h3>
              <p className="text-sm text-muted-foreground">Share internship opportunities</p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/profile">
          <Card className="border-2 hover:border-accent transition-all cursor-pointer h-full">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Star className="h-8 w-8 text-accent" />
              </div>
              <h3 className="font-semibold mb-2">Edit Profile</h3>
              <p className="text-sm text-muted-foreground">Update your skills and information</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          {projects.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FolderKanban className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground mb-4">Start by creating your first project</p>
                <Link to="/projects/create">
                  <Button variant="gradient">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <Link key={project.id} to={`/projects/${project.id}`}>
                  <Card className="border-2 hover:shadow-[var(--shadow-card)] transition-all h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                          <CardDescription className="mt-2 line-clamp-2">
                            {project.description}
                          </CardDescription>
                        </div>
                        <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-4">Browse projects and internships to get started</p>
                <div className="flex gap-4 justify-center">
                  <Link to="/projects">
                    <Button>Browse Projects</Button>
                  </Link>
                  <Link to="/internships">
                    <Button variant="secondary">Browse Internships</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id} className="border-2">
                  <CardContent className="py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">
                          {'projects' in app ? app.projects?.title : app.internships?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {'projects' in app ? 'Project' : `Internship at ${app.internships?.company_name}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Applied {new Date(app.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          app.status === 'accepted'
                            ? 'default'
                            : app.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
