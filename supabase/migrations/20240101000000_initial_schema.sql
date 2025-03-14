-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- Create courses table with enhanced structure
CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    level TEXT NOT NULL,
    duration TEXT NOT NULL,
    modules INTEGER NOT NULL,
    thumbnail_url TEXT,
    is_workshop BOOLEAN DEFAULT false,
    next_session_date TEXT,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create modules table for course content
CREATE TABLE IF NOT EXISTS modules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    quiz JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_progress table with enhanced tracking
CREATE TABLE IF NOT EXISTS user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    completed_modules JSONB DEFAULT '[]'::jsonb NOT NULL,
    quiz_scores JSONB DEFAULT '{}'::jsonb NOT NULL,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create user_stats table for overall progress
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY,
    completed_courses INTEGER DEFAULT 0,
    total_hours INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert courses and workshops
INSERT INTO courses (title, description, level, duration, modules, is_workshop, next_session_date, location) VALUES
(
    'Email Essentials',
    'Master the basics of email communication. Learn how to create an email account, compose and send emails, manage your inbox, and stay safe from email scams.',
    'Beginner',
    '3 hours',
    3,
    false,
    NULL,
    NULL
),
(
    'Internet Safety Fundamentals',
    'Learn essential online safety practices including password security, recognizing scams, protecting personal information, and safe browsing habits.',
    'Beginner',
    '4 hours',
    4,
    false,
    NULL,
    NULL
),
(
    'Smartphone Basics Workshop',
    'Hands-on workshop covering smartphone basics, including making calls, sending messages, using essential apps, and managing settings.',
    'Beginner',
    '2 hours',
    1,
    true,
    '2024-03-15 10:00 AM',
    'DIGITS Learning Center - Room A'
),
(
    'Online Banking Safety',
    'Learn to safely manage your finances online, including secure login practices, transaction monitoring, and fraud prevention.',
    'Intermediate',
    '3 hours',
    3,
    false,
    NULL,
    NULL
),
(
    'Digital Communication Tools',
    'Explore modern communication tools like video calls, messaging apps, and social media to stay connected with family and friends.',
    'Beginner',
    '4 hours',
    3,
    false,
    NULL,
    NULL
),
(
    'Tech Support Workshop',
    'Monthly workshop providing personalized assistance with your devices and common technical issues.',
    'All Levels',
    '3 hours',
    1,
    true,
    'First Saturday of every month',
    'DIGITS Learning Center - Main Hall'
),
(
    'Online Shopping Safety',
    'Learn to shop online safely, identify legitimate websites, protect payment information, and understand consumer rights.',
    'Beginner',
    '2 hours',
    2,
    false,
    NULL,
    NULL
),
(
    'Digital Health Services',
    'Navigate online health resources, telemedicine platforms, and health apps safely and effectively.',
    'Intermediate',
    '3 hours',
    3,
    false,
    NULL,
    NULL
);

-- Insert sample module content
INSERT INTO modules (course_id, title, order_index, content, quiz) VALUES
(
    (SELECT id FROM courses WHERE title = 'Email Essentials'),
    'Creating Your Email Account',
    1,
    '# Creating Your Email Account

## What is Email?

Email (Electronic Mail) is like sending a digital letter. It''s a fast and free way to:
- Send messages to friends and family
- Receive important information
- Keep records of your communications

## Setting Up Your Email

### Step 1: Choose an Email Provider
- Gmail (from Google)
- Outlook (from Microsoft)
- Yahoo Mail

We recommend Gmail because it''s:
- Free
- Easy to use
- Comes with lots of storage
- Works well with other services

### Step 2: Create Your Account

1. Go to gmail.com
2. Click "Create Account"
3. Fill in your information:
   - Name
   - Username (your email address)
   - Password (make it strong!)
   - Birthday
   - Phone number (optional but recommended)

### Step 3: Security Setup

1. Set up recovery options:
   - Add a phone number
   - Add a backup email
   - Set security questions

These help you get back into your account if you forget your password.

### Tips for Choosing a Good Email Address

- Use your name or a variation of it
- Keep it professional
- Avoid numbers unless necessary
- Make it easy to remember and spell

Remember: Take your time setting this up. It''s better to do it right than to rush!',
    '{
        "questions": [
            {
                "id": 1,
                "question": "What is a recommended email provider for beginners?",
                "options": [
                    "Gmail",
                    "CompuServe",
                    "AOL",
                    "MySpace"
                ],
                "correctAnswer": 0
            },
            {
                "id": 2,
                "question": "What should you set up to help recover your account if you forget your password?",
                "options": [
                    "Your favorite color",
                    "Your high school name",
                    "A recovery phone number",
                    "Your zodiac sign"
                ],
                "correctAnswer": 2
            }
        ]
    }'::jsonb
);

-- Create RLS policies
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Allow public read access to courses
CREATE POLICY "Allow public read access to courses"
    ON courses FOR SELECT
    TO public
    USING (true);

-- Allow public read access to modules
CREATE POLICY "Allow public read access to modules"
    ON modules FOR SELECT
    TO public
    USING (true);

-- Allow authenticated users to manage their own progress
CREATE POLICY "Allow users to manage their own progress"
    ON user_progress FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to manage their own stats
CREATE POLICY "Allow users to manage their own stats"
    ON user_stats FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id); 