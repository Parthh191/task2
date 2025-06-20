import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { 
  SunIcon, 
  MoonIcon, 
  Bars3Icon, 
  XMarkIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/roles';

export default function Navbar() {
  const { user, logout, theme, toggleTheme } = useAuth();

  const navigation = [
    { name: 'Blogs', href: '/', permission: 'VIEW_BLOGS' },
    { name: 'Add Blog', href: '/blog/new', permission: 'EDIT_BLOGS' },
    { name: 'Users', href: '/users', permission: 'MANAGE_USERS' },
  ].filter(item => hasPermission(user?.role, item.permission));

  const getUserInitials = () => {
    if (!user?.name && !user?.email) return '?';
    return (user.name?.[0] || user.email?.[0] || '?').toUpperCase();
  };

  return (
    <Disclosure as="nav" className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo section */}
              <div className="flex-shrink-0">
                <Link 
                  to="/" 
                  className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-indigo-600 dark:from-rose-400 dark:to-indigo-400 bg-clip-text text-transparent hover:from-indigo-600 hover:to-rose-500 dark:hover:from-indigo-400 dark:hover:to-rose-400 transition-all duration-300"
                >
                  Blog Admin
                </Link>
              </div>

              {/* Center Navigation Links */}
              <div className="hidden sm:flex flex-1 justify-center">
                <div className="flex space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-rose-500 dark:hover:text-rose-400 relative group"
                    >
                      {item.name}
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-rose-500 to-indigo-600 dark:from-rose-400 dark:to-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="rounded-full p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-rose-500 dark:hover:text-rose-400 transition-all duration-200"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </button>

                {user && (
                  <Menu as="div" className="relative ml-3">
                    <Menu.Button className="flex rounded-full bg-gradient-to-r from-rose-500 to-indigo-600 dark:from-rose-400 dark:to-indigo-400 p-0.5 hover:from-indigo-600 hover:to-rose-500 dark:hover:from-indigo-400 dark:hover:to-rose-400 transition-all duration-300">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-900">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {getUserInitials()}
                        </span>
                      </span>
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-900 py-2 shadow-lg ring-1 ring-gray-200 dark:ring-gray-800 focus:outline-none">
                        <div className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-800">
                          {user.name || user.email}
                        </div>
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                          Role: {user.role}
                        </div>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={`${
                                active ? 'bg-red-600 dark:bg-red-700' : 'bg-red-500 dark:bg-red-600'
                              } group flex w-full items-center px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-red-600 dark:hover:bg-red-700`}
                            >
                              <ArrowRightOnRectangleIcon 
                                className="h-5 w-5 mr-2 transition-transform duration-200 group-hover:translate-x-0.5" 
                              />
                              <span>Logout</span>
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-200">
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-rose-500 dark:hover:text-rose-400 rounded-md transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}