import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface AuthFormProps {
  onClose: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Successfully logged in!');
      } else {
        await signUp(email, password, firstName, lastName);
        toast.success('Successfully registered! Please check your email for verification.');
      }
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[var(--space-bg)] p-8 rounded-lg max-w-md w-full mx-4 border border-[var(--terminal-green)]"
      >
        <h2 className="text-2xl font-bold text-[var(--terminal-green)] mb-6 terminal-text">
          {isLogin ? 'LOGIN' : 'REGISTER'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-[var(--terminal-green)] mb-1">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 bg-black/30 border border-[var(--terminal-green)] rounded text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--terminal-green)] mb-1">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 bg-black/30 border border-[var(--terminal-green)] rounded text-white"
                  required
                />
              </div>
            </>
          )}
          
          <div>
            <label className="block text-[var(--terminal-green)] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-black/30 border border-[var(--terminal-green)] rounded text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-[var(--terminal-green)] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-black/30 border border-[var(--terminal-green)] rounded text-white"
              required
              minLength={6}
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[var(--terminal-green)] hover:underline"
            >
              {isLogin ? 'Need an account?' : 'Already have an account?'}
            </button>
            
            <div className="space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[var(--terminal-green)] text-[var(--terminal-green)] rounded hover:bg-[var(--terminal-green)] hover:text-black transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-[var(--terminal-green)] text-black rounded hover:bg-[var(--terminal-green)]/90 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthForm; 