import { useState, useEffect } from 'react';
import { RoleGuard } from '../components/RoleGuard';
import { api } from '../utils/api';
import { ROLES } from '../utils/roles';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      console.error('Error updating user role:', err);
      alert('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-indigo-500 opacity-20"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard requiredPermission="MANAGE_USERS">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient mb-2 sm:mb-4">
              User Management
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
              Manage roles and permissions for your team members
            </p>
          </div>

          {error ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 sm:p-6 text-center border border-red-200 dark:border-red-800"
            >
              <div className="flex items-center justify-center space-x-3 text-red-600 dark:text-red-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-lg font-semibold">{error}</span>
              </div>
              <button
                onClick={fetchUsers}
                className="mt-4 px-6 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-xl hover:bg-red-200 dark:hover:bg-red-700 transition-colors duration-200"
              >
                Retry
              </button>
            </motion.div>
          ) : (
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                <ul className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                  {users.map((user, index) => (
                    <motion.li
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative"
                    >
                      <div className="px-3 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 group-hover:bg-gray-50/50 dark:group-hover:bg-gray-700/50 transition-all duration-200">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-[2px] group-hover:animate-gradient">
                                <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                                  <UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 dark:text-gray-400" />
                                </div>
                              </div>
                              {user.id === currentUser.id && (
                                <div className="absolute -top-1 -right-1">
                                  <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                    <ShieldCheckIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-indigo-600 dark:text-indigo-400" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="space-y-0.5 sm:space-y-1">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {user.id} {user.id === currentUser.id && '(Current User)'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="relative w-full sm:w-auto">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            disabled={user.id === currentUser.id}
                            className={`block w-full sm:w-44 rounded-xl text-sm border-gray-200 dark:border-gray-600 
                              ${user.id === currentUser.id 
                                ? 'bg-gray-50 dark:bg-gray-700/50 cursor-not-allowed' 
                                : 'bg-white dark:bg-gray-700 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400'
                              }
                              focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                              shadow-sm group-hover:shadow-md
                              transition-all duration-200`}
                          >
                            {Object.entries(ROLES).map(([key, value]) => (
                              <option 
                                key={value} 
                                value={value}
                                className="bg-white dark:bg-gray-700"
                              >
                                {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                          {/* Decorative gradient bar */}
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}