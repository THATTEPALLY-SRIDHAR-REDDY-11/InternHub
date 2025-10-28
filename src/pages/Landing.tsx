import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Rocket, 
  Users, 
  Briefcase, 
  Tag, 
  Sparkles,
  TrendingUp,
  Network,
  BarChart
} from 'lucide-react';
import heroImage from '@/assets/hero-collaboration.jpg';

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-10" />
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Empowering Students Through
                <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent"> Collaboration & Innovation</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with opportunities, showcase your work, and collaborate on real-world projects and internships.
              </p>
              <div className="flex gap-4">
                <Link to="/auth">
                  <Button variant="gradient" size="lg" className="group">
                    Get Started
                    <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button variant="outline" size="lg">
                    Explore Projects
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-[image:var(--gradient-hero)] opacity-20 blur-3xl rounded-full" />
              <img 
                src={heroImage} 
                alt="Students collaborating on projects" 
                className="relative rounded-2xl shadow-[var(--shadow-elegant)] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl font-bold">The Challenge</h2>
            <p className="text-lg text-muted-foreground">
              Many students struggle to find relevant internships, collaborators for projects, 
              and visibility for their completed work. This leads to underutilized skills and 
              missed opportunities for real-world experience.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-muted-foreground">Everything you need to succeed</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:shadow-[var(--shadow-card)] transition-all duration-300">
              <CardContent className="pt-8 space-y-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Rocket className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Project Showcase</h3>
                <p className="text-muted-foreground">
                  Upload and display your completed projects with detailed descriptions and technology tags.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-[var(--shadow-card)] transition-all duration-300">
              <CardContent className="pt-8 space-y-4">
                <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Collaboration Hub</h3>
                <p className="text-muted-foreground">
                  Apply to join ongoing student and faculty projects. Build teamwork skills.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-[var(--shadow-card)] transition-all duration-300">
              <CardContent className="pt-8 space-y-4">
                <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Internship Board</h3>
                <p className="text-muted-foreground">
                  Discover verified internship and research opportunities from trusted sources.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-[var(--shadow-card)] transition-all duration-300">
              <CardContent className="pt-8 space-y-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Tag className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Skill Tags</h3>
                <p className="text-muted-foreground">
                  Tag projects with relevant technologies and skills to help others find them.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-[var(--shadow-card)] transition-all duration-300">
              <CardContent className="pt-8 space-y-4">
                <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold">Smart Matching</h3>
                <p className="text-muted-foreground">
                  Get personalized project recommendations based on your skills and interests.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-[var(--shadow-card)] transition-all duration-300">
              <CardContent className="pt-8 space-y-4">
                <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Reviews & Ratings</h3>
                <p className="text-muted-foreground">
                  Share feedback and rate projects and internships after completion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Benefits</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">For Students</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <TrendingUp className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Boost Your Resume</h4>
                    <p className="text-muted-foreground">Stand out with real project contributions and experience</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Users className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Build Skills</h4>
                    <p className="text-muted-foreground">Develop teamwork and cross-domain collaboration abilities</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Network className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Expand Network</h4>
                    <p className="text-muted-foreground">Connect with peers, faculty, and industry professionals</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">For Institutions</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <BarChart className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Track Engagement</h4>
                    <p className="text-muted-foreground">Monitor student participation in applied work</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Sparkles className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Promote Innovation</h4>
                    <p className="text-muted-foreground">Foster interdepartmental collaboration and creativity</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <TrendingUp className="h-6 w-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Enhance Reputation</h4>
                    <p className="text-muted-foreground">Build academic prestige through student achievements</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-2 bg-[image:var(--gradient-hero)] text-white">
            <CardContent className="py-16 text-center space-y-6">
              <h2 className="text-4xl font-bold">Ready to Start Your Journey?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Join thousands of students collaborating on projects and discovering opportunities
              </p>
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="mt-4">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
