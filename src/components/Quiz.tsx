import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useSupabase } from '../lib/supabaseClient';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: QuizQuestion[];
  courseId: string;
  moduleId: string;
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, courseId, moduleId, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const supabase = useSupabase();

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleNextQuestion = async () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    const newAnswers = { ...answers, [currentQuestion]: selectedAnswer };
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Quiz completed
      const finalScore = ((score + (isCorrect ? 1 : 0)) / questions.length) * 100;
      
      // Update progress in database
      const { data: user } = await supabase.auth.getUser();
      if (user?.user?.id) {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.user.id)
          .eq('course_id', courseId)
          .single();

        if (progress) {
          // Update existing progress
          const updatedQuizScores = {
            ...progress.quiz_scores,
            [moduleId]: finalScore
          };

          await supabase
            .from('user_progress')
            .update({
              quiz_scores: updatedQuizScores,
              completion_percentage: Math.round(
                (Object.keys(updatedQuizScores).length / questions.length) * 100
              )
            })
            .eq('id', progress.id);
        } else {
          // Create new progress entry
          await supabase
            .from('user_progress')
            .insert({
              user_id: user.user.id,
              course_id: courseId,
              quiz_scores: { [moduleId]: finalScore },
              completion_percentage: Math.round((1 / questions.length) * 100)
            });
        }
      }

      onComplete(finalScore);
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-2xl mx-auto p-6 glass rounded-xl neon-border"
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold digital-text">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <span className="text-sm text-gray-400">
            Score: {score}/{currentQuestion}
          </span>
        </div>
        <div className="w-full bg-gray-700/30 h-2 rounded-full">
          <motion.div
            className="h-full rounded-full progress-bar"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <h2 className="text-xl mb-6">{currentQ.question}</h2>

      <div className="space-y-4">
        {currentQ.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full p-4 rounded-lg quiz-option ${
              selectedAnswer === index
                ? 'selected'
                : ''
            } ${
              showResult
                ? index === currentQ.correctAnswer
                  ? 'correct'
                  : selectedAnswer === index
                  ? 'incorrect'
                  : ''
                : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              {showResult && index === currentQ.correctAnswer && (
                <Check className="w-5 h-5 text-green-500" />
              )}
              {showResult && selectedAnswer === index && index !== currentQ.correctAnswer && (
                <X className="w-5 h-5 text-red-500" />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNextQuestion}
        disabled={selectedAnswer === null}
        className={`mt-8 w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          selectedAnswer === null
            ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
            : 'bg-indigo-500 hover:bg-indigo-600 text-white'
        }`}
      >
        {currentQuestion + 1 === questions.length ? 'Finish Quiz' : 'Next Question'}
      </motion.button>
    </motion.div>
  );
};

export default Quiz; 