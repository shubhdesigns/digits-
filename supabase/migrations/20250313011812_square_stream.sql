/*
  # Add course content and modules tables

  1. New Tables
    - course_modules: Stores module information for each course
    - course_content: Stores detailed content for each module

  2. Security
    - Enable RLS on new tables
    - Add policies for content access
*/

-- Create course modules table
CREATE TABLE IF NOT EXISTS course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses NOT NULL,
  title text NOT NULL,
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(course_id, order_number)
);

-- Create course content table
CREATE TABLE IF NOT EXISTS course_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid REFERENCES course_modules NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Course modules are viewable by everyone"
  ON course_modules FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Course content is viewable by everyone"
  ON course_content FOR SELECT
  TO public
  USING (true);