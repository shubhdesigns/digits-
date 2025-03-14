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
  'Introduction to Cybersecurity',
  'Learn the fundamentals of cybersecurity and protect yourself online',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
  'Beginner',
  '2 hours',
  '{
    "modules": [
      {
        "id": "module1",
        "title": "Understanding Cybersecurity Basics",
        "content": "# Understanding Cybersecurity Basics\n\nIn this module, you will learn the fundamental concepts of cybersecurity...",
        "quiz": [
          {
            "question": "What is the primary goal of cybersecurity?",
            "options": [
              "To make computers faster",
              "To protect systems and data from threats",
              "To create better software",
              "To improve internet speed"
            ],
            "correctAnswer": 1
          }
        ]
      }
    ]
  }'::jsonb
); 