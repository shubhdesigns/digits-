-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    level TEXT NOT NULL,
    duration TEXT NOT NULL,
    total_modules INTEGER NOT NULL DEFAULT 1,
    thumbnail_url TEXT,
    is_workshop BOOLEAN DEFAULT false,
    next_session_date TIMESTAMP WITH TIME ZONE,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create modules table
CREATE TABLE IF NOT EXISTS modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    quiz JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
    user_id UUID NOT NULL,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    completed_modules INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    quiz_scores JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, course_id)
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY,
    completed_courses INTEGER DEFAULT 0,
    total_hours INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample course data
INSERT INTO courses (title, description, level, duration, total_modules, is_workshop, next_session_date, location) VALUES
(
    'Creating Your Email Account',
    'Learn how to set up and use your first email account. Perfect for beginners who want to stay connected with family and friends digitally.',
    'Beginner',
    '2 hours',
    3,
    true,
    CURRENT_TIMESTAMP + INTERVAL '7 days',
    'Community Center - Room 101'
);

-- Get the course ID
DO $$
DECLARE
    email_course_id UUID;
BEGIN
    SELECT id INTO email_course_id FROM courses WHERE title = 'Creating Your Email Account' LIMIT 1;

    -- Insert modules for the email course
    INSERT INTO modules (course_id, title, order_index, content, quiz) VALUES
    (
        email_course_id,
        'Understanding Email Basics',
        1,
        E'# What is Email?\n\nEmail (Electronic Mail) is like sending a digital letter. It''s a fast and free way to:\n- Send messages to friends and family\n- Receive important information\n- Keep records of your communications\n\n## Why Use Email?\n\n1. **Stay Connected**: Keep in touch with family and friends\n2. **Save Money**: Free alternative to traditional mail\n3. **Quick Delivery**: Messages arrive instantly\n4. **Environmentally Friendly**: No paper waste\n\n## Common Email Terms\n\n- **Inbox**: Where you receive messages\n- **Compose**: Write a new email\n- **Send**: Deliver your message\n- **Reply**: Respond to an email\n- **Attachment**: Files you can send with your email',
        '{
            "questions": [
                {
                    "question": "What is email primarily used for?",
                    "options": [
                        "Sending digital messages",
                        "Making phone calls",
                        "Watching videos",
                        "Playing games"
                    ],
                    "correct_answer": 0
                },
                {
                    "question": "Where do you find received messages?",
                    "options": [
                        "In the Sent folder",
                        "In the Inbox",
                        "In the Trash",
                        "In the Drafts"
                    ],
                    "correct_answer": 1
                }
            ]
        }'
    ),
    (
        email_course_id,
        'Setting Up Your Account',
        2,
        E'# Creating Your Gmail Account\n\n## Step-by-Step Guide\n\n1. **Go to Gmail**\n   - Open your web browser\n   - Type "gmail.com" in the address bar\n   - Click "Create Account"\n\n2. **Enter Your Information**\n   - Your name\n   - Choose a username (your email address)\n   - Create a strong password\n   - Add your phone number (recommended)\n\n3. **Tips for Choosing a Username**\n   - Use your real name if possible\n   - Keep it professional\n   - Avoid numbers unless necessary\n   - Make it easy to remember\n\n4. **Password Safety**\n   - Use at least 8 characters\n   - Include letters and numbers\n   - Add special characters (!@#$)\n   - Don''t share it with anyone',
        '{
            "questions": [
                {
                    "question": "What should a good email password include?",
                    "options": [
                        "Only letters",
                        "Only numbers",
                        "Letters, numbers, and special characters",
                        "Your birth date"
                    ],
                    "correct_answer": 2
                },
                {
                    "question": "What is recommended when creating a Gmail account?",
                    "options": [
                        "Using random words as username",
                        "Adding your phone number",
                        "Using only numbers in password",
                        "Sharing password with friends"
                    ],
                    "correct_answer": 1
                }
            ]
        }'
    ),
    (
        email_course_id,
        'Sending Your First Email',
        3,
        E'# Sending Your First Email\n\n## Steps to Send an Email\n\n1. **Open Gmail**\n   - Sign in to your account\n   - Click "Compose" (big plus button)\n\n2. **Write Your Email**\n   - To: Enter recipient''s email address\n   - Subject: Write a brief description\n   - Message: Type your content\n\n3. **Review and Send**\n   - Check for spelling errors\n   - Verify the email address\n   - Click "Send"\n\n## Email Etiquette\n\n- Be polite and professional\n- Use clear subject lines\n- Keep messages concise\n- Proofread before sending\n\n## Practice Exercise\n\nTry sending an email to yourself:\n1. Use your own email address\n2. Subject: "My First Email"\n3. Write a simple message\n4. Click Send',
        '{
            "questions": [
                {
                    "question": "What should you do before sending an email?",
                    "options": [
                        "Delete the subject line",
                        "Add many attachments",
                        "Proofread the message",
                        "Use all capital letters"
                    ],
                    "correct_answer": 2
                },
                {
                    "question": "Which button do you click to write a new email?",
                    "options": [
                        "Send",
                        "Compose",
                        "Reply",
                        "Delete"
                    ],
                    "correct_answer": 1
                }
            ]
        }'
    );
END $$;

-- Enable row level security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON courses
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON modules
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated user progress management" ON user_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated user stats management" ON user_stats
    FOR ALL USING (auth.uid() = user_id); 