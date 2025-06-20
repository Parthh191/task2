import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] relative flex items-center justify-center p-6
      bg-gradient-to-br from-sky-100 via-rose-100 to-lime-100 
      dark:from-blue-900 dark:via-purple-900 dark:to-teal-900 
      transition-all duration-500 overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute transform -rotate-45 blur-3xl opacity-50 mix-blend-overlay">
          <div className="w-96 h-96 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full -translate-x-1/2 animate-pulse"></div>
          <div className="w-96 h-96 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full translate-x-1/2 animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Card container with enhanced glass effect */}
        <div className="space-y-8 
          bg-white/80 dark:bg-gray-900/80
          backdrop-blur-xl
          p-8 rounded-3xl
          shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          border border-white/20 dark:border-gray-700/30
          transform transition-all duration-300 
          hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
          
          <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold 
              bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 
              dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 
              bg-clip-text text-transparent
              animate-gradient">
              Welcome Back
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Sign in to access your account
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="group">
                <label htmlFor="email-address" 
                  className="block text-sm font-medium 
                    text-gray-700 dark:text-gray-300 mb-1
                    transition-colors duration-200">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full px-5 py-4
                      bg-white/50 dark:bg-gray-800/50
                      border border-gray-200 dark:border-gray-700
                      rounded-2xl
                      placeholder-gray-400 dark:placeholder-gray-500
                      transition-all duration-200
                      focus:bg-white dark:focus:bg-gray-800
                      focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                      focus:border-transparent
                      hover:border-gray-300 dark:hover:border-gray-600"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-2xl transition-opacity duration-200 pointer-events-none
                    opacity-0 group-hover:opacity-100
                    bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  </div>
                </div>
              </div>

              <div className="group">
                <label htmlFor="password" 
                  className="block text-sm font-medium 
                    text-gray-700 dark:text-gray-300 mb-1
                    transition-colors duration-200">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full px-5 py-4
                      bg-white/50 dark:bg-gray-800/50
                      border border-gray-200 dark:border-gray-700
                      rounded-2xl
                      placeholder-gray-400 dark:placeholder-gray-500
                      transition-all duration-200
                      focus:bg-white dark:focus:bg-gray-800
                      focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                      focus:border-transparent
                      hover:border-gray-300 dark:hover:border-gray-600"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div className="absolute inset-0 rounded-2xl transition-opacity duration-200 pointer-events-none
                    opacity-0 group-hover:opacity-100
                    bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="relative overflow-hidden
                bg-red-50 dark:bg-red-900/20 
                text-red-700 dark:text-red-200 
                p-4 rounded-2xl 
                border border-red-100 dark:border-red-800">
                <div className="relative z-10">{error}</div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10"></div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full group
                flex justify-center items-center
                px-8 py-4
                text-base font-medium text-white
                rounded-2xl
                transition-all duration-300
                transform hover:scale-[1.02]
                disabled:opacity-50 disabled:cursor-not-allowed
                before:absolute before:inset-0
                before:bg-gradient-to-r before:from-blue-600 before:via-purple-600 before:to-pink-600
                dark:before:from-blue-500 dark:before:via-purple-500 dark:before:to-pink-500
                before:rounded-2xl before:transition-all before:duration-300
                hover:before:scale-[1.02] hover:before:opacity-90
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              <span className="relative">
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </span>
            </button>

            <div className="text-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
              </span>
              <Link 
                to="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}