import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function CreateProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [skills, setSkills] = useState('');
  const [applyUrl, setApplyUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
      const ownerName = user?.user_metadata?.fullName || user?.user_metadata?.full_name || user?.email || 'Anonymous';
      const payload = {
        title: title.trim(),
        description: description.trim(),
        image_url: imageUrl.trim() || null,
        github_url: githubUrl.trim() || null,
        demo_url: demoUrl.trim() || null,
        apply_url: applyUrl.trim() || null,
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        status: 'active',
        owner_name: ownerName,
      };

      const res = await fetch(`${apiBaseUrl}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      toast({ title: 'Project created', description: 'Your project has been published.' });
      navigate('/projects');
    } catch (err) {
      console.error('Create project error', err);
      const errorMessage = err instanceof Error ? err.message : 'Try again later';
      toast({ title: 'Failed to create project', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto border-2">
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
          <CardDescription>Share your completed work or start a collaboration</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">Image URL</label>
                <Input id="image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <label htmlFor="apply" className="text-sm font-medium">Apply URL (optional)</label>
                <Input id="apply" value={applyUrl} onChange={(e) => setApplyUrl(e.target.value)} placeholder="https://forms..." />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="github" className="text-sm font-medium">GitHub URL</label>
                <Input id="github" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
              </div>
              <div className="space-y-2">
                <label htmlFor="demo" className="text-sm font-medium">Demo URL</label>
                <Input id="demo" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://demo..." />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="skills" className="text-sm font-medium">Skill Tags (comma-separated)</label>
              <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, Node.js" />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button type="submit" disabled={loading} variant="gradient">{loading ? 'Publishing...' : 'Publish Project'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}