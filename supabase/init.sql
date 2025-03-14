-- Drop existing tables and triggers if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.progress;
drop table if exists public.enrollments;
drop table if exists public.courses;
drop table if exists public.profiles;

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create courses table
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  image_url text,
  level text,
  duration text,
  content jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create enrollments table
create table if not exists public.enrollments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  status text default 'enrolled',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

-- Create progress table
create table if not exists public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  module_id text not null,
  completed boolean default false,
  quiz_score integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.progress enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

create policy "Courses are viewable by everyone"
  on public.courses for select
  using ( true );

create policy "Enrolled users can view their enrollments"
  on public.enrollments for select
  using ( auth.uid() = user_id );

create policy "Users can enroll themselves"
  on public.enrollments for insert
  with check ( auth.uid() = user_id );

create policy "Users can view their own progress"
  on public.progress for select
  using ( auth.uid() = user_id );

create policy "Users can update their own progress"
  on public.progress for insert
  with check ( auth.uid() = user_id );

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert sample course data
insert into public.courses (title, description, image_url, level, duration, content) values
(
  'Digital Safety Basics',
  'Essential digital safety skills for everyone - learn how to protect yourself online',
  '/courses/digital-safety.svg',
  'Beginner',
  '2 hours',
  '{
    "modules": [
      {
        "id": "module1",
        "title": "Understanding Online Safety",
        "content": "# Understanding Online Safety\n\nIn this module, you will learn the fundamental concepts of staying safe online, including:\n\n- Creating strong passwords\n- Recognizing phishing attempts\n- Safe browsing practices\n- Protecting personal information\n\nWe will guide you through each concept with clear examples and practical tips.",
        "quiz": [
          {
            "question": "What makes a password strong?",
            "options": [
              "Using your birthday",
              "Using a combination of letters, numbers, and symbols",
              "Using your pet''s name",
              "Using sequential numbers"
            ],
            "correctAnswer": 1
          }
        ]
      }
    ]
  }'::jsonb
),
(
  'Smartphone Security',
  'Learn to use your smartphone securely and protect your privacy',
  '/courses/smartphone-security.svg',
  'Beginner',
  '1.5 hours',
  '{
    "modules": [
      {
        "id": "module1",
        "title": "Smartphone Privacy Settings",
        "content": "# Securing Your Smartphone\n\nLearn how to:\n\n- Set up a secure lock screen\n- Manage app permissions\n- Back up your data safely\n- Use two-factor authentication\n\nThis module focuses on practical, step-by-step instructions.",
        "quiz": [
          {
            "question": "Why is two-factor authentication important?",
            "options": [
              "It makes your phone faster",
              "It adds an extra layer of security",
              "It saves battery life",
              "It improves signal strength"
            ],
            "correctAnswer": 1
          }
        ]
      }
    ]
  }'::jsonb
),
(
  'Email Safety & Scam Prevention',
  'Identify and avoid email scams and protect your inbox',
  '/courses/email-safety.svg',
  'Beginner',
  '2 hours',
  '{
    "modules": [
      {
        "id": "module1",
        "title": "Recognizing Email Scams",
        "content": "# Email Safety Essentials\n\nIn this comprehensive guide, you''ll learn:\n\n- How to identify suspicious emails\n- Common scam tactics to watch out for\n- Safe email practices\n- What to do if you suspect a scam\n\nProtect yourself and your loved ones from email-based threats.",
        "quiz": [
          {
            "question": "What is a common sign of a phishing email?",
            "options": [
              "The sender has a professional email address",
              "The email creates urgency and asks for immediate action",
              "The email has a company logo",
              "The email was received during business hours"
            ],
            "correctAnswer": 1
          }
        ]
      }
    ]
  }'::jsonb
),
(
  'Social Media Privacy',
  'Navigate social media safely while protecting your privacy',
  '/courses/social-media.svg',
  'Intermediate',
  '2.5 hours',
  '{
    "modules": [
      {
        "id": "module1",
        "title": "Social Media Privacy Settings",
        "content": "# Social Media Safety\n\nMaster the art of safe social media use:\n\n- Configure privacy settings\n- Understand what to share (and not to share)\n- Manage friend requests and connections\n- Protect your personal information\n\nStay connected while staying secure.",
        "quiz": [
          {
            "question": "What information should you avoid sharing on social media?",
            "options": [
              "Your favorite movies",
              "Your current vacation dates and location",
              "Your hobbies",
              "Your favorite books"
            ],
            "correctAnswer": 1
          }
        ]
      }
    ]
  }'::jsonb
); 