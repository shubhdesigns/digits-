import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const openaiApiKey = process.env.OPENAI_API_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({ apiKey: openaiApiKey });

const systemPrompt = `You are an expert cybersecurity instructor and mentor, helping users learn about digital security. 
Your responses should be:
1. Educational and informative
2. Practical with real-world examples
3. Encouraging and supportive
4. Security-focused and up-to-date
5. Clear and concise

When explaining concepts:
- Break down complex topics into simple terms
- Provide concrete examples
- Highlight best practices
- Mention common pitfalls to avoid
- Include relevant security tips

Always maintain a professional yet friendly tone, and encourage users to follow security best practices.`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user's profile and learning history
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Get user's current course and progress
    const { data: enrollment } = await supabase
      .from('course_enrollments')
      .select('course_id, progress')
      .eq('user_id', userId)
      .single();

    // Get course content
    const { data: course } = enrollment
      ? await supabase
          .from('courses')
          .select('*')
          .eq('id', enrollment.course_id)
          .single()
      : null;

    // Get recent chat history
    const { data: recentChats } = await supabase
      .from('chat_history')
      .select('message, response')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Prepare context for the AI
    const userContext = {
      name: profile?.first_name,
      currentCourse: course?.title,
      courseProgress: enrollment?.progress,
      recentTopics: recentChats?.map(chat => chat.message).join(', '),
    };

    const contextPrompt = `
User Profile:
- Name: ${userContext.name || 'Student'}
${userContext.currentCourse ? `- Currently studying: ${userContext.currentCourse} (${userContext.courseProgress}% complete)` : '- Not enrolled in any course'}
${userContext.recentTopics ? `- Recent topics discussed: ${userContext.recentTopics}` : ''}

Please provide a helpful response based on the user's learning context.`;

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'system',
          content: contextPrompt
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
      presence_penalty: 0.6,
      frequency_penalty: 0.3
    });

    const response = completion.choices[0].message.content;

    // Store the conversation in the database
    await supabase.from('chat_history').insert([
      {
        user_id: userId,
        message,
        response,
        course_id: enrollment?.course_id || null
      }
    ]);

    return res.status(200).json({ response });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 