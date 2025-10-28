import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, Eye, FileText, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    full_name: '', email: '', phone: '', location: '',
    linkedin: '', github: '', portfolio: '', summary: '',
  });

  const [education, setEducation] = useState([{
    institution: '', degree: '', field: '', start_date: '', end_date: '', grade: ''
  }]);

  const [experience, setExperience] = useState([{
    company: '', position: '', location: '', start_date: '', end_date: '', description: '', current: false
  }]);

  const [projects, setProjects] = useState([{
    title: '', description: '', technologies: [], url: '', start_date: '', end_date: ''
  }]);

  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const [certifications, setCertifications] = useState([{
    name: '', issuer: '', date: '', url: ''
  }]);

  const loadResume = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Loading resume for user:', user?.id);
      const response = await fetch(`http://localhost:4000/resumes/${user?.id}`);
      console.log('Load response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded resume data:', data);
        setPersonalInfo(data.personal_info || personalInfo);
        setEducation(data.education?.length ? data.education : education);
        setExperience(data.experience?.length ? data.experience : experience);
        setProjects(data.projects?.length ? data.projects : projects);
        setSkills(data.skills || []);
        setCertifications(data.certifications?.length ? data.certifications : certifications);
      } else if (response.status === 404) {
        console.log('No existing resume found - starting fresh');
      } else {
        const errorData = await response.json();
        console.error('Failed to load resume:', errorData);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to load resume - Network error:', errorMessage);
      console.error('Full error:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) loadResume();
  }, [user?.id, loadResume]);

  const saveResume = async () => {
    if (!user?.id) {
      toast({ title: 'Error', description: 'Please login to save your resume', variant: 'destructive' });
      return;
    }

    // Validate required fields
    if (!personalInfo.full_name || !personalInfo.email) {
      toast({ 
        title: 'Missing Information', 
        description: 'Please fill in your Full Name and Email in the Personal tab', 
        variant: 'destructive' 
      });
      return;
    }

    setSaving(true);
    try {
      console.log('Saving resume for user:', user.id);
      const payload = {
        user_id: user.id, 
        personal_info: personalInfo, 
        education,
        experience, 
        projects, 
        skills, 
        certifications,
      };
      console.log('Resume payload:', payload);

      const response = await fetch('http://localhost:4000/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save');
      }

      toast({ title: 'Success', description: 'Resume saved successfully! ✓' });
    } catch (error) {
      console.error('Save error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save resume. Check console for details.';
      toast({ 
        title: 'Error', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (previewMode) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Resume Preview</h1>
          <Button onClick={() => setPreviewMode(false)}><FileText className="mr-2 h-4 w-4" />Edit</Button>
        </div>
        <Card className="p-8">
          <div className="text-center mb-6 border-b pb-6">
            <h1 className="text-3xl font-bold mb-2">{personalInfo.full_name}</h1>
            <div className="flex justify-center gap-2 text-sm text-muted-foreground flex-wrap">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <><span>•</span><span>{personalInfo.phone}</span></>}
              {personalInfo.location && <><span>•</span><span>{personalInfo.location}</span></>}
            </div>
            {personalInfo.summary && <p className="mt-4 text-sm text-left">{personalInfo.summary}</p>}
          </div>
          {skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => <Badge key={i} variant="secondary">{skill}</Badge>)}
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      {/* Debug Panel */}
      {!user && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ <strong>Not Logged In:</strong> You need to login to save your resume. 
            <a href="/auth" className="ml-2 underline font-semibold">Login here</a>
          </p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Resume Builder</h1>
          {user && <p className="text-sm text-muted-foreground mt-1">Logged in as {user.email}</p>}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setPreviewMode(true)} variant="outline"><Eye className="mr-2 h-4 w-4" />Preview</Button>
          <Button onClick={saveResume} disabled={saving || !user}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : <><Save className="mr-2 h-4 w-4" />Save</>}
          </Button>
        </div>
      </div>
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="certifications">Certificates</TabsTrigger>
        </TabsList>
        <TabsContent value="personal">
          <Card><CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
                  <Input placeholder="John Doe" value={personalInfo.full_name}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, full_name: e.target.value })} 
                    required />
                </div>
                <div>
                  <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
                  <Input placeholder="john@example.com" type="email" value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} 
                    required />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <Input placeholder="+1 234 567 8900" value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input placeholder="New York, NY" value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Professional Summary</label>
                <Textarea placeholder="Brief overview of your professional background and goals..." value={personalInfo.summary}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })} rows={4} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="skills">
          <Card><CardHeader><CardTitle>Skills</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Add skill" value={newSkill} onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), newSkill.trim() && setSkills([...skills, newSkill.trim()]), setNewSkill(''))} />
                <Button onClick={() => { if (newSkill.trim()) { setSkills([...skills, newSkill.trim()]); setNewSkill(''); } }}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <Badge key={i} variant="secondary" className="cursor-pointer"
                    onClick={() => setSkills(skills.filter((_, idx) => idx !== i))}>
                    {skill} <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResumeBuilder;
