-- Update courses table with more comprehensive content
INSERT INTO courses (id, title, description, level, duration, modules, content, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Password Security Fundamentals',
  'Master the essentials of password security and learn best practices for protecting digital assets.',
  'Beginner',
  '4 hours',
  5,
  jsonb_build_object(
    'modules', jsonb_build_array(
      jsonb_build_object(
        'id', '1',
        'title', 'Understanding Password Security',
        'content', E'# Understanding Password Security\n\nPasswords are your first line of defense in the digital world. In this module, we''ll explore:\n\n## What Makes a Password Secure?\n- Length and complexity requirements\n- Common patterns to avoid\n- The mathematics behind password strength\n\n## The Evolution of Password Security\n- Historical perspectives\n- Modern challenges\n- Future trends\n\n## Real-world Examples\n- Case studies of password breaches\n- Lessons learned from major incidents\n- Impact on organizations and individuals',
        'quiz', jsonb_build_array(
          jsonb_build_object(
            'question', 'What is the minimum recommended length for a secure password?',
            'options', array['8 characters', '12 characters', '16 characters', '20 characters'],
            'correctAnswer', 2
          ),
          jsonb_build_object(
            'question', 'Which of the following is NOT a good practice for password security?',
            'options', array['Using special characters', 'Using personal information', 'Mixing upper and lowercase', 'Using numbers'],
            'correctAnswer', 1
          )
        )
      ),
      jsonb_build_object(
        'id', '2',
        'title', 'Password Storage and Hashing',
        'content', E'# Password Storage and Hashing\n\nLearn how passwords are securely stored and processed.\n\n## Hashing Algorithms\n- Understanding cryptographic hashes\n- Common hashing algorithms (SHA, bcrypt, Argon2)\n- Salt and pepper concepts\n\n## Best Practices\n- Secure storage implementation\n- Handling password resets\n- Migration strategies\n\n## Hands-on Exercise\nImplement a basic password hashing system using bcrypt.',
        'quiz', jsonb_build_array(
          jsonb_build_object(
            'question', 'What is the purpose of adding a salt to a password hash?',
            'options', array['To make the password longer', 'To prevent rainbow table attacks', 'To make the hash faster', 'To compress the password'],
            'correctAnswer', 1
          )
        )
      ),
      jsonb_build_object(
        'id', '3',
        'title', 'Multi-Factor Authentication',
        'content', E'# Multi-Factor Authentication (MFA)\n\nEnhance security beyond passwords with MFA.\n\n## Types of Authentication Factors\n- Something you know (passwords)\n- Something you have (devices)\n- Something you are (biometrics)\n\n## Implementation Strategies\n- Time-based OTP (TOTP)\n- SMS verification\n- Hardware security keys\n\n## Security Considerations\n- Backup methods\n- Recovery processes\n- User experience balance',
        'quiz', jsonb_build_array(
          jsonb_build_object(
            'question', 'Which authentication factor category does a fingerprint belong to?',
            'options', array['Something you know', 'Something you have', 'Something you are', 'Something you do'],
            'correctAnswer', 2
          )
        )
      ),
      jsonb_build_object(
        'id', '4',
        'title', 'Password Managers',
        'content', E'# Password Managers\n\nLearn about tools for managing passwords securely.\n\n## Benefits of Password Managers\n- Secure password generation\n- Cross-device synchronization\n- Secure sharing capabilities\n\n## Popular Solutions\n- Comparison of top password managers\n- Features and limitations\n- Integration capabilities\n\n## Security Considerations\n- Master password importance\n- Backup strategies\n- Vendor security practices',
        'quiz', jsonb_build_array(
          jsonb_build_object(
            'question', 'What is the main advantage of using a password manager?',
            'options', array['It''s free', 'It generates unique passwords for each account', 'It makes passwords easier to remember', 'It makes logging in faster'],
            'correctAnswer', 1
          )
        )
      ),
      jsonb_build_object(
        'id', '5',
        'title', 'Future of Authentication',
        'content', E'# Future of Authentication\n\nExplore emerging trends and technologies in authentication.\n\n## Passwordless Authentication\n- Biometric solutions\n- Magic links\n- WebAuthn standard\n\n## Artificial Intelligence in Authentication\n- Behavioral biometrics\n- Continuous authentication\n- Risk-based authentication\n\n## Practical Implementation\n- Migration strategies\n- User adoption considerations\n- Security implications',
        'quiz', jsonb_build_array(
          jsonb_build_object(
            'question', 'Which technology is part of the FIDO2 standard for passwordless authentication?',
            'options', array['SMS 2FA', 'WebAuthn', 'Email magic links', 'Security questions'],
            'correctAnswer', 1
          )
        )
      )
    )
  ),
  NOW(),
  NOW()
);

-- Add more courses
INSERT INTO courses (id, title, description, level, duration, modules, content, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Cybersecurity Essentials',
  'Learn the fundamental concepts and practices of cybersecurity.',
  'Beginner',
  '6 hours',
  6,
  jsonb_build_object(
    'modules', jsonb_build_array(
      jsonb_build_object(
        'id', '1',
        'title', 'Introduction to Cybersecurity',
        'content', E'# Introduction to Cybersecurity\n\nUnderstand the basics of cybersecurity and its importance in today''s digital world.',
        'quiz', jsonb_build_array(
          jsonb_build_object(
            'question', 'What is the primary goal of cybersecurity?',
            'options', array['Making computers faster', 'Protecting digital assets and information', 'Creating websites', 'Writing code'],
            'correctAnswer', 1
          )
        )
      )
    )
  ),
  NOW(),
  NOW()
); 