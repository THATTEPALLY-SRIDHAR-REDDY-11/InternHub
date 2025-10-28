-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  institution TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Skills are viewable by everyone"
  ON public.skills FOR SELECT
  USING (true);

-- Create user_skills junction table
CREATE TABLE public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "User skills are viewable by everyone"
  ON public.user_skills FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own skills"
  ON public.user_skills FOR ALL
  USING (auth.uid() = user_id);

-- Create projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('completed', 'ongoing', 'recruiting')),
  project_type TEXT NOT NULL CHECK (project_type IN ('academic', 'personal', 'research', 'industry')),
  team_size INTEGER,
  looking_for_members BOOLEAN DEFAULT false,
  github_url TEXT,
  demo_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = owner_id);

-- Create project_skills junction table
CREATE TABLE public.project_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, skill_id)
);

ALTER TABLE public.project_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Project skills are viewable by everyone"
  ON public.project_skills FOR SELECT
  USING (true);

-- Create internships table
CREATE TABLE public.internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company_name TEXT NOT NULL,
  location TEXT NOT NULL,
  posted_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  duration TEXT,
  stipend TEXT,
  application_deadline TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('active', 'closed', 'filled')),
  verified BOOLEAN DEFAULT false,
  remote BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internships are viewable by everyone"
  ON public.internships FOR SELECT
  USING (true);

CREATE POLICY "Users can create internships"
  ON public.internships FOR INSERT
  WITH CHECK (auth.uid() = posted_by);

CREATE POLICY "Users can update their own internships"
  ON public.internships FOR UPDATE
  USING (auth.uid() = posted_by);

CREATE POLICY "Users can delete their own internships"
  ON public.internships FOR DELETE
  USING (auth.uid() = posted_by);

-- Create internship_skills junction table
CREATE TABLE public.internship_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(internship_id, skill_id)
);

ALTER TABLE public.internship_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internship skills are viewable by everyone"
  ON public.internship_skills FOR SELECT
  USING (true);

-- Create project_applications table
CREATE TABLE public.project_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, applicant_id)
);

ALTER TABLE public.project_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applications are viewable by applicant and project owner"
  ON public.project_applications FOR SELECT
  USING (
    auth.uid() = applicant_id OR 
    auth.uid() IN (SELECT owner_id FROM public.projects WHERE id = project_id)
  );

CREATE POLICY "Users can create applications"
  ON public.project_applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Project owners can update application status"
  ON public.project_applications FOR UPDATE
  USING (auth.uid() IN (SELECT owner_id FROM public.projects WHERE id = project_id));

-- Create internship_applications table
CREATE TABLE public.internship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  resume_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(internship_id, applicant_id)
);

ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applications are viewable by applicant and internship poster"
  ON public.internship_applications FOR SELECT
  USING (
    auth.uid() = applicant_id OR 
    auth.uid() IN (SELECT posted_by FROM public.internships WHERE id = internship_id)
  );

CREATE POLICY "Users can create internship applications"
  ON public.internship_applications FOR INSERT
  WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Internship posters can update application status"
  ON public.internship_applications FOR UPDATE
  USING (auth.uid() IN (SELECT posted_by FROM public.internships WHERE id = internship_id));

-- Create project_reviews table
CREATE TABLE public.project_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id, reviewer_id)
);

ALTER TABLE public.project_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON public.project_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews"
  ON public.project_reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own reviews"
  ON public.project_reviews FOR UPDATE
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.project_reviews FOR DELETE
  USING (auth.uid() = reviewer_id);

-- Create internship_reviews table
CREATE TABLE public.internship_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internship_id UUID NOT NULL REFERENCES public.internships(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(internship_id, reviewer_id)
);

ALTER TABLE public.internship_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Internship reviews are viewable by everyone"
  ON public.internship_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create internship reviews"
  ON public.internship_reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update their own internship reviews"
  ON public.internship_reviews FOR UPDATE
  USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete their own internship reviews"
  ON public.internship_reviews FOR DELETE
  USING (auth.uid() = reviewer_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_internships_updated_at BEFORE UPDATE ON public.internships
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_applications_updated_at BEFORE UPDATE ON public.project_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_internship_applications_updated_at BEFORE UPDATE ON public.internship_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_reviews_updated_at BEFORE UPDATE ON public.project_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_internship_reviews_updated_at BEFORE UPDATE ON public.internship_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();