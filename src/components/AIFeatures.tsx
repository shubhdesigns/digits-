import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Target, Zap } from 'lucide-react';

const AIFeatures = () => {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Personalized Learning Path",
      description: "Our AI analyzes your progress and adapts the course content to your learning style."
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Smart Progress Tracking",
      description: "Advanced algorithms monitor your understanding and suggest review materials when needed."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Intelligent Recommendations",
      description: "Get course suggestions based on your interests and learning history."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Assistance",
      description: "24/7 AI-powered help to answer your questions and provide guidance."
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">AI-Powered Learning</h2>
          <p className="text-gray-300 text-lg">Experience the future of education with our advanced AI features</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white bg-opacity-5 rounded-lg p-6 backdrop-blur-sm hover:bg-opacity-10 transition-all"
            >
              <div className="text-white mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;