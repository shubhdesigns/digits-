-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create courses table
CREATE TABLE courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    level TEXT NOT NULL,
    duration TEXT NOT NULL,
    modules INTEGER NOT NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create course_enrollments table
CREATE TABLE course_enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    course_id TEXT REFERENCES courses(id) NOT NULL,
    status TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, course_id)
);

-- Create chat_history table
CREATE TABLE chat_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    course_id TEXT REFERENCES courses(id),
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial courses
INSERT INTO courses (id, title, description, level, duration, modules, content) VALUES
(
    'password-security',
    'Password Security Basics',
    'Master the art of creating and managing secure passwords. Learn modern password security practices, understand common threats, and implement robust password management strategies.',
    'Beginner',
    '2 hours',
    4,
    '{
        "modules": [
            {
                "title": "Understanding Password Security",
                "content": "# Password Security Fundamentals\n\nPasswords are your first line of defense in the digital world. Learn how to create and manage strong passwords that protect your online accounts.\n\n## Key Topics\n- Password creation best practices\n- Common password vulnerabilities\n- Password managers and their benefits\n- Two-factor authentication\n\n## Interactive Exercise\nAnalyze these passwords and identify their strengths and weaknesses:\n- password123\n- P@ssw0rd\n- correct-horse-battery-staple\n- MyP@ssw0rd2024!",
                "video_url": "https://example.com/password-security-intro",
                "quiz": {
                    "questions": [
                        {
                            "question": "Which of the following is the most secure password?",
                            "options": [
                                "P@ssw0rd",
                                "correct-horse-battery-staple",
                                "password123",
                                "MyP@ssw0rd2024!"
                            ],
                            "correct": 1,
                            "explanation": "A long passphrase like 'correct-horse-battery-staple' is more secure and easier to remember than complex but shorter passwords."
                        }
                    ]
                }
            }
        ]
    }'::jsonb
),
(
    'online-banking',
    'Online Banking Safety',
    'Master the essentials of secure online banking and financial transactions. Learn to protect your financial information and conduct safe online transactions.',
    'Intermediate',
    '3 hours',
    6,
    '{
        "modules": [
            {
                "title": "Secure Online Banking Basics",
                "content": "# Online Banking Security\n\nLearn how to protect your financial information and conduct safe online banking transactions.\n\n## Key Topics\n- Secure connection indicators\n- Two-factor authentication for banking\n- Mobile banking security\n- Common banking scams\n\n## Best Practices\n1. Use strong, unique passwords\n2. Enable banking alerts\n3. Monitor your accounts regularly\n4. Use official banking apps",
                "video_url": "https://example.com/banking-security-intro",
                "quiz": {
                    "questions": [
                        {
                            "question": "What should you check before logging into your online banking?",
                            "options": [
                                "The weather",
                                "Your social media",
                                "The website's security certificate",
                                "Your email"
                            ],
                            "correct": 2,
                            "explanation": "Always verify the website's security certificate (https://) and ensure you're on your bank's official website before entering login credentials."
                        }
                    ]
                }
            }
        ]
    }'::jsonb
),
(
    'email-security',
    'Email Security',
    'Identify and avoid email scams, phishing attempts, and suspicious links. Learn how to protect your email accounts and communicate securely.',
    'Beginner',
    '2.5 hours',
    5,
    '{
        "modules": [
            {
                "title": "Email Security Fundamentals",
                "content": "# Email Security Basics\n\nLearn how to identify and protect yourself from email-based threats.\n\n## Key Topics\n- Identifying phishing emails\n- Email encryption basics\n- Secure email practices\n- Attachment safety\n\n## Common Red Flags\n1. Urgent action required\n2. Suspicious sender addresses\n3. Grammar and spelling errors\n4. Requests for sensitive information",
                "video_url": "https://example.com/email-security-intro",
                "quiz": {
                    "questions": [
                        {
                            "question": "What is a common sign of a phishing email?",
                            "options": [
                                "Professional formatting",
                                "Urgent action required",
                                "Known sender address",
                                "Clear subject line"
                            ],
                            "correct": 1,
                            "explanation": "Urgency is a common tactic used in phishing emails to pressure users into making hasty decisions without proper verification."
                        }
                    ]
                }
            }
        ]
    }'::jsonb
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone."
    ON profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile."
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Courses are viewable by everyone."
    ON courses FOR SELECT
    USING (true);

CREATE POLICY "Enrolled courses are viewable by enrolled users."
    ON course_enrollments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in courses."
    ON course_enrollments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollment."
    ON course_enrollments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own chat history."
    ON chat_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create chat messages."
    ON chat_history FOR INSERT
    WITH CHECK (auth.uid() = user_id); 