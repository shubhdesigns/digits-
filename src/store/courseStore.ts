import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: number;
  content: {
    modules: Array<{
      id: string;
      title: string;
      content: string;
      quiz: Array<{
        question: string;
        options: string[];
        correctAnswer: number;
      }>;
    }>;
  };
}

interface CourseStore {
  courses: Course[];
  userProgress: Record<string, number>;
  loading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
  updateProgress: (courseId: string, progress: number) => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: [],
  userProgress: {},
  loading: false,
  error: null,

  fetchCourses: async () => {
    try {
      set({ loading: true, error: null });
      
      // Fetch courses
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;

      // Fetch user's progress
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data: enrollments, error: enrollmentsError } = await supabase
        .from('course_enrollments')
        .select('course_id, progress')
        .eq('user_id', user.user.id);

      if (enrollmentsError) throw enrollmentsError;

      // Convert enrollments to a progress map
      const progressMap = enrollments?.reduce((acc, enrollment) => ({
        ...acc,
        [enrollment.course_id]: enrollment.progress
      }), {}) || {};

      set({ 
        courses: courses || [], 
        userProgress: progressMap,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch courses',
        loading: false 
      });
    }
  },

  updateProgress: async (courseId: string, progress: number) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('course_enrollments')
        .upsert({
          user_id: user.user.id,
          course_id: courseId,
          progress,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state
      set(state => ({
        userProgress: {
          ...state.userProgress,
          [courseId]: progress
        }
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update progress' 
      });
    }
  },

  enrollInCourse: async (courseId: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          user_id: user.user.id,
          course_id: courseId,
          progress: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state
      set(state => ({
        userProgress: {
          ...state.userProgress,
          [courseId]: 0
        }
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to enroll in course' 
      });
    }
  }
}));