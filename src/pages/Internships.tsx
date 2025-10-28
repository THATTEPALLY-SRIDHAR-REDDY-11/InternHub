import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, MapPin, Clock, DollarSign, ExternalLink, Globe, Building2, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Internship {
  _id?: string;
  id?: string;
  title: string;
  company_name: string;
  description: string;
  location?: string;
  remote?: boolean;
  duration?: string;
  stipend?: string;
  skills?: string[];
  apply_url?: string;
  verified?: boolean;
  status: 'active' | 'inactive' | 'closed';
}

export default function Internships() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [recs, setRecs] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();



  const fetchRecommendations = useCallback(async () => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
      const params = new URLSearchParams();
      if (skillsInput) params.set('skills', skillsInput);
      if (!skillsInput) {
        setRecs([]);
        return;
      }
      const resp = await fetch(`${apiBaseUrl}/internships/recommend?${params.toString()}`);
      if (!resp.ok) return;
      const data = await resp.json();
      setRecs(Array.isArray(data) ? data.slice(0, 6) : []);
    } catch (err) {
      // silent fail for recs
      setRecs([]);
    }
  }, [skillsInput]);

  // Initial load and when filters change
  useEffect(() => {
    const loadData = async () => {
      console.log('Loading internships data...');
      setLoading(true);
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
        const params = new URLSearchParams();
        if (searchTerm) params.set('q', searchTerm);
        if (skillsInput) params.set('skills', skillsInput);
        if (remoteOnly) params.set('remote', 'true');
        if (locationInput) params.set('location', locationInput);

        console.log('Fetching from:', `${apiBaseUrl}/internships?${params.toString()}`);
        const response = await fetch(`${apiBaseUrl}/internships?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        // Filter for active internships on the frontend since backend returns all
        const activeInternships = data.filter((internship: Internship) => internship.status === 'active');
        console.log('Active internships:', activeInternships);
        setInternships(activeInternships || []);
        setFilteredInternships(activeInternships || []);
      } catch (error) {
        console.error('Error fetching internships:', error);
        setInternships([]);
        setFilteredInternships([]);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };
    
    loadData();
  }, [searchTerm, skillsInput, remoteOnly, locationInput]);

  useEffect(() => {
    if (skillsInput) {
      fetchRecommendations();
    } else {
      setRecs([]);
    }
  }, [skillsInput, fetchRecommendations]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading internships...</p>
        </div>
      </div>
    );
  }

  // Curated opportunities data
  const curatedOpportunities = {
    global: [
      {
        title: 'LinkedIn Internships',
        description: 'Explore internship opportunities at top global companies',
        url: 'https://www.linkedin.com/jobs/internships',
        icon: '💼'
      },
      {
        title: 'Google Careers',
        description: 'Software engineering and product internships',
        url: 'https://careers.google.com/students/',
        icon: '🔍'
      },
      {
        title: 'Amazon Student Programs',
        description: 'Software development, operations, and business internships',
        url: 'https://www.amazon.jobs/en/teams/internships-for-students',
        icon: '📦'
      },
      {
        title: 'Microsoft Internships',
        description: 'Technology and business internships worldwide',
        url: 'https://careers.microsoft.com/students/us/en',
        icon: '🪟'
      },
      {
        title: 'Meta (Facebook) Internships',
        description: 'Engineering, data science, and product internships',
        url: 'https://www.metacareers.com/students/',
        icon: '👍'
      },
      {
        title: 'Apple Student Programs',
        description: 'Hardware, software, and design internships',
        url: 'https://www.apple.com/careers/us/students.html',
        icon: '🍎'
      }
    ],
    india: [
      {
        title: 'Internshala',
        description: 'India\'s #1 internship and training platform',
        url: 'https://internshala.com/',
        icon: '🇮🇳'
      },
      {
        title: 'AICTE Internship Portal',
        description: 'Government-backed internship opportunities',
        url: 'https://internship.aicte-india.org/',
        icon: '🎓'
      },
      {
        title: 'TCS iON',
        description: 'Digital learning and internship platform',
        url: 'https://learning.tcsionhub.in/',
        icon: '💻'
      },
      {
        title: 'Naukri Internships',
        description: 'Internships across various domains',
        url: 'https://www.naukri.com/internship-jobs',
        icon: '💼'
      },
      {
        title: 'LetsIntern',
        description: 'Curated internships and training programs',
        url: 'https://letsintern.com/',
        icon: '🚀'
      },
      {
        title: 'Unstop (formerly Dare2Compete)',
        description: 'Competitions, hackathons, and internships',
        url: 'https://unstop.com/',
        icon: '🏆'
      }
    ],
    research: [
      {
        title: 'MITACS Globalink',
        description: 'Research internships in Canada for international students',
        url: 'https://www.mitacs.ca/en/programs/globalink',
        icon: '🍁'
      },
      {
        title: 'DAAD WISE',
        description: 'Research internships in Germany',
        url: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/wise/',
        icon: '🇩🇪'
      },
      {
        title: 'IIT Summer Research',
        description: 'Research opportunities at IITs across India',
        url: 'https://www.iitb.ac.in/en/education/research-internship',
        icon: '🔬'
      },
      {
        title: 'CERN Summer Student Programme',
        description: 'Physics and engineering research at CERN',
        url: 'https://careers.cern/summer',
        icon: '⚛️'
      },
      {
        title: 'IISC Research Internships',
        description: 'Research programs at Indian Institute of Science',
        url: 'https://www.iisc.ac.in/admissions/summer-research-fellowship-programme/',
        icon: '🧪'
      },
      {
        title: 'NASA Internships',
        description: 'Space science and aerospace research',
        url: 'https://intern.nasa.gov/',
        icon: '🚀'
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Internships</h1>
            <p className="text-muted-foreground">Discover verified internship opportunities</p>
          </div>
          {user && (
            <Link to="/internships/create">
              <Button variant="secondary">
                <Plus className="mr-2 h-4 w-4" />
                Post Internship
              </Button>
            </Link>
          )}
        </div>

        {/* Curated Opportunities Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Featured Opportunities 🌟</h2>
          <Tabs defaultValue="global" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="global" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Global 🌍</span>
              </TabsTrigger>
              <TabsTrigger value="india" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <span>India 🇮🇳</span>
              </TabsTrigger>
              <TabsTrigger value="research" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>Research 🧠</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="global" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {curatedOpportunities.global.map((opp, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="text-4xl">{opp.icon}</div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{opp.title}</CardTitle>
                          <CardDescription className="text-sm line-clamp-2">
                            {opp.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <a href={opp.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="default" size="sm" className="w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="india" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {curatedOpportunities.india.map((opp, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="text-4xl">{opp.icon}</div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{opp.title}</CardTitle>
                          <CardDescription className="text-sm line-clamp-2">
                            {opp.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <a href={opp.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="default" size="sm" className="w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="research" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {curatedOpportunities.research.map((opp, idx) => (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="text-4xl">{opp.icon}</div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{opp.title}</CardTitle>
                          <CardDescription className="text-sm line-clamp-2">
                            {opp.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <a href={opp.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="default" size="sm" className="w-full">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Search and Filter Section */}
        <h2 className="text-2xl font-bold mb-4 mt-12">Browse Posted Internships</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Input
            placeholder="Skills (comma-separated)"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
          />
          <Input
            placeholder="Location"
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox checked={remoteOnly} onCheckedChange={(v) => setRemoteOnly(Boolean(v))} />
            Remote only
          </label>
        </div>
      </div>

      {recs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Recommended for you</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recs.map((internship, idx) => (
              <Card key={`rec-${(internship._id || internship.id || internship.apply_url || 'row') + '-' + idx}`} className="border hover:shadow-[var(--shadow-card)] transition-all">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{internship.title}</CardTitle>
                  <CardDescription className="font-semibold text-foreground">{internship.company_name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(internship.skills || []).slice(0, 3).map((skill: string, idx: number) => (
                      <Badge key={idx} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                  {internship.apply_url && (
                    <div className="pt-3 flex justify-end">
                      <a href={internship.apply_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="secondary">Apply</Button>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {filteredInternships.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <h3 className="text-xl font-semibold mb-2">No internships found</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Try a different search term' : 'Be the first to post an internship!'}
            </p>
            {user && !searchTerm && (
              <Link to="/internships/create">
                <Button variant="secondary">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Internship
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredInternships.map((internship, idx) => (
            <Card key={(internship._id || internship.id || internship.apply_url || 'row') + '-' + idx} className="border-2 hover:shadow-[var(--shadow-card)] transition-all h-full">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="line-clamp-2 flex-1">
                    <Link to={`/internships/${internship._id || internship.id}`}>{internship.title}</Link>
                  </CardTitle>
                  {internship.verified && (
                    <Badge variant="default" className="bg-green-500">
                      Verified
                    </Badge>
                  )}
                </div>
                <CardDescription className="font-semibold text-foreground">
                  {internship.company_name}
                </CardDescription>
                <CardDescription className="line-clamp-2 mt-2">
                  {internship.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(internship.location || internship.remote) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {internship.location && <span>{internship.location}</span>}
                    {internship.remote && (
                      <Badge variant="outline" className="ml-auto">
                        Remote
                      </Badge>
                    )}
                  </div>
                )}
                {internship.duration && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{internship.duration}</span>
                  </div>
                )}
                {internship.stipend && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>{internship.stipend}</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {internship.skills?.slice(0, 3).map((skill: string, idx: number) => (
                    <Badge key={idx} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                  {internship.skills?.length > 3 && (
                    <Badge variant="outline">+{internship.skills.length - 3}</Badge>
                  )}
                </div>
                {internship.apply_url && (
                  <div className="pt-2 flex justify-end">
                    <a href={internship.apply_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" variant="secondary">Apply</Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
