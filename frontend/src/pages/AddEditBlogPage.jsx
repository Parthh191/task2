import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { api } from '../utils/api';
import { RoleGuard } from '../components/RoleGuard';

export default function AddEditBlogPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const blog = await api.getBlogById(id);
      setFormData({
        title: blog.title,
        content: blog.content,
      });
      if (blog.image) {
        setImagePreview(`http://localhost:3000${blog.image}`);
      }
    } catch (err) {
      setError('Failed to fetch blog');
      console.error('Error fetching blog:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('content', formData.content);
      if (image) {
        form.append('image', image);
      }

      if (id) {
        await api.updateBlog(id, form);
      } else {
        await api.createBlog(form);
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <RoleGuard requiredPermission="EDIT_BLOGS">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8 transition-all duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-8">
                <div className="space-y-6">
                  {/* Title Input */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                          shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                          placeholder-gray-400 dark:placeholder-gray-500
                          transition-all duration-200"
                        placeholder="Enter a catchy title"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Blog Image
                    </label>
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl
                      border-gray-300 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400
                      transition-all duration-200">
                      <div className="space-y-2 text-center">
                        {imagePreview ? (
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-64 rounded-lg object-contain"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 p-1 bg-red-100 dark:bg-red-900 rounded-full
                                text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800
                                transition-colors duration-200"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md font-medium text-indigo-600 dark:text-indigo-400
                                  hover:text-indigo-500 dark:hover:text-indigo-300 focus-within:outline-none
                                  focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                              >
                                <span>Upload an image</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  ref={fileInputRef}
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Textarea */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                      Content
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="content"
                        name="content"
                        rows={12}
                        value={formData.content}
                        onChange={handleChange}
                        required
                        className="block w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                          shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                          placeholder-gray-400 dark:placeholder-gray-500
                          transition-all duration-200"
                        placeholder="Write your blog content here..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="px-8 py-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
                  <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="px-8 py-4 bg-gray-50 dark:bg-gray-700/50 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-4 py-2 rounded-xl text-gray-700 dark:text-gray-200 
                    bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
                    hover:bg-gray-50 dark:hover:bg-gray-700
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl text-white
                    bg-gradient-to-r from-indigo-500 to-purple-500
                    hover:from-indigo-600 hover:to-purple-600
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    id ? 'Update Blog' : 'Create Blog'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}