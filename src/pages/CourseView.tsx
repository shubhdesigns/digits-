import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCourseStore } from '../store/courseStore';
import { CheckCircle, Circle, PlayCircle, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CourseView = () => {
  const { id } = useParams();
  const { courses, userProgress, updateProgress } = useCourseStore();
  const [currentModule, setCurrentModule] = useState(0);
  const course = courses.find(c => c.id === id);

  const modules = [
    {
      title: "Introduction",
      content: `
# Welcome to ${course?.title}

This course will help you understand the basics of digital security and how to protect yourself online.

## What you'll learn:
- Basic security concepts
- Password management
- Safe browsing practices
- Email security

\`\`\`javascript
// Example of a secure password checker
function isPasswordStrong(password) {
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  
  return password.length >= minLength &&
         hasUpperCase &&
         hasLowerCase &&
         hasNumbers &&
         hasSpecialChar;
}
\`\`\`
      `
    },
    {
      title: "Module 1: Understanding Digital Security",
      content: "Content for module 1..."
    },
    {
      title: "Module 2: Password Management",
      content: "Content for module 2..."
    },
    {
      title: "Module 3: Safe Browsing",
      content: "Content for module 3..."
    },
    {
      title: "Module 4: Email Security",
      content: "Content for module 4..."
    }
  ];

  const handleModuleComplete = async () => {
    const progress = Math.round(((currentModule + 1) / modules.length) * 100);
    await updateProgress(id!, progress);
    setCurrentModule(prev => Math.min(prev + 1, modules.length - 1));
  };

  if (!course) return <div>Course not found</div>;

  return (
    <div className="pt-20 pb-12 bg-[#0a0a0a] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Course Modules</h2>
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentModule(index)}
                    className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                      currentModule === index ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-gray-800'
                    }`}
                  >
                    {index < currentModule ? (
                      <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    ) : currentModule === index ? (
                      <PlayCircle className="w-5 h-5 mr-2 text-blue-500" />
                    ) : (
                      <Circle className="w-5 h-5 mr-2" />
                    )}
                    <span className="text-sm text-left">{module.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-lg p-8">
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    }
                  }}
                >
                  {modules[currentModule].content}
                </ReactMarkdown>
              </div>
              
              <div className="mt-8 flex justify-between items-center">
                <button
                  onClick={() => setCurrentModule(prev => Math.max(prev - 1, 0))}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors disabled:opacity-50"
                  disabled={currentModule === 0}
                >
                  Previous
                </button>
                <button
                  onClick={handleModuleComplete}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {currentModule === modules.length - 1 ? 'Complete Course' : 'Next Module'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;