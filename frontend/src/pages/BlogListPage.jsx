import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import BlogCard from '../components/BlogCard';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/roles';

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const canAddBlog = hasPermission(user?.role, 'EDIT_BLOGS');

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
  }, [searchQuery, blogs]);

  const fetchBlogs = async () => {
    try {
      const data = await api.getBlogs();
      setBlogs(data);
      setFilteredBlogs(data);
    } catch (err) {
      setError('Failed to fetch blogs');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      await api.deleteBlog(blogId);
      const updatedBlogs = blogs.filter(blog => blog.id !== blogId);
      setBlogs(updatedBlogs);
      setFilteredBlogs(updatedBlogs);
    } catch (err) {
      console.error('Error deleting blog:', err);
      alert('Failed to delete blog');
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full transform transition-all hover:scale-105">
            <div className="text-red-500 dark:text-red-400 text-center mb-4 text-lg font-semibold">{error}</div>
            <button
              onClick={fetchBlogs}
              className="w-full py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient mb-4">
            Explore Amazing Blogs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Discover inspiring stories and insights from our talented writers
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blogs..."
                className="w-full px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-700 dark:text-gray-200 pl-12"
              />
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          
          {/* Add Blog Button */}
          {canAddBlog && (
            <button
              onClick={() => navigate('/blog/new')}
              className="mt-8 group relative inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2 transition-transform group-hover:rotate-180 duration-300" />
              New Blog
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          )}
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl p-12 text-center transform transition-all duration-300 hover:scale-[1.02] max-w-2xl mx-auto">
            <div className="max-w-sm mx-auto">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                {searchQuery ? 'No blogs found matching your search' : 'No blogs found'}
              </p>
              {canAddBlog && !searchQuery && (
                <button
                  onClick={() => navigate('/blog/new')}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow transition-all duration-300"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Create your first blog
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, index) => (
              <div
                key={blog.id}
                className="opacity-0 animate-fadeIn"
                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
              >
                <BlogCard
                  blog={blog}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}