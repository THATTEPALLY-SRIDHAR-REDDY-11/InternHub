import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { User, LogOut, LayoutDashboard, Briefcase, FolderKanban, FileText } from 'lucide-react';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[image:var(--gradient-hero)]">
            <FolderKanban className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">InternHub</span>
        </Link>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link to="/projects" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Projects
              </Link>
              <Link to="/internships" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Internships
              </Link>
              <Link to="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to="/resume" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Resume
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/resume')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Resume Builder
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/projects" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Projects
              </Link>
              <Link to="/internships" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Internships
              </Link>
              <Link to="/auth">
                <Button variant="gradient" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
