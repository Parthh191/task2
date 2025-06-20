import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { BiUser } from 'react-icons/bi';
import { FiClock, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { hasPermission } from '../utils/roles';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function BlogCard({ blog, onDelete }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const readTime = Math.max(1, Math.ceil(blog.content.split(" ").length / 200));
  
  const canEdit = hasPermission(user?.role, 'EDIT_BLOGS');
  const canDelete = hasPermission(user?.role, 'DELETE_BLOGS');

  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative h-full"
    >
      <Link to={`/blog/${blog.id}`} className="block h-full">
        {/* Card wrapper with main gradient background */}
        <div className="relative h-full overflow-hidden rounded-2xl 
          bg-gradient-to-tl from-purple-50/90 via-white to-blue-50/90
           dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/40
          shadow-[0_8px_30px_rgb(0,0,0,0.12)]
          dark:shadow-[0_8px_30px_rgba(14,165,233,0.15)]
          group-hover:shadow-[0_8px_30px_rgba(124,58,237,0.12)]
          dark:group-hover:shadow-[0_8px_30px_rgba(139,92,246,0.15)]
          border border-white/20 dark:border-gray-800
          backdrop-blur-xl transform transition-all duration-500">
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br 
            from-purple-500/[0.05] via-transparent to-blue-500/[0.05]
            dark:from-purple-500/[0.08] dark:to-blue-500/[0.08]
            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Animated glow effect */}
          <div className="absolute -inset-x-1/2 -inset-y-1/2 w-[200%] h-[200%]
            bg-gradient-conic from-blue-500/0 via-purple-500/10 to-blue-500/0
            dark:from-blue-600/10 dark:via-purple-600/20 dark:to-blue-600/10
            opacity-0 group-hover:opacity-100 animate-[spin_8s_linear_infinite]
            pointer-events-none mix-blend-overlay transition-opacity duration-500" />

          {/* Content wrapper */}
          <div className="relative z-10 p-6 h-full
            bg-gradient-to-br from-white/40 to-white/20 
            dark:from-gray-900/40 dark:to-gray-800/20
            backdrop-blur-sm">
            
            {/* Image section with enhanced gradient overlay */}
            <div className="relative mb-6 overflow-hidden rounded-xl aspect-[16/9]
              ring-1 ring-black/5 dark:ring-white/10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="h-full w-full"
              >
                {blog.image ? (
                  <img
                    src={`http://localhost:3000${blog.image}`}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-all duration-700
                      brightness-105 dark:brightness-90 contrast-[1.02]
                      group-hover:brightness-110 dark:group-hover:brightness-95
                      transform group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br 
                    from-purple-100 via-fuchsia-100 to-blue-100
                    dark:from-purple-900 dark:via-fuchsia-900 dark:to-blue-900
                    animate-gradient-x" />
                )}
              </motion.div>
              
              {/* Enhanced image gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t 
                from-white/90 via-white/50 to-white/0
                dark:from-gray-900/90 dark:via-gray-900/50 dark:to-transparent
                mix-blend-overlay group-hover:opacity-75 transition-opacity duration-500" />
            </div>

            {/* Enhanced title styling */}
            <motion.h2
              whileHover={{ x: 4 }}
              className="text-2xl font-bold mb-3 
                bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900
                dark:from-white dark:via-purple-200 dark:to-blue-200
                bg-clip-text text-transparent
                group-hover:from-purple-700 group-hover:via-fuchsia-600 group-hover:to-blue-600
                dark:group-hover:from-purple-300 dark:group-hover:via-fuchsia-200 dark:group-hover:to-blue-300
                transition-all duration-300"
            >
              {blog.title}
            </motion.h2>

            {/* Content preview with enhanced styling */}
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 
              line-clamp-2 group-hover:line-clamp-none transition-all duration-300
              bg-gradient-to-r from-gray-800 to-gray-600
              dark:from-gray-200 dark:to-gray-400
              bg-clip-text group-hover:text-transparent">
              {blog.content}
            </p>

            {/* Meta information with enhanced styling */}
            <div className="flex items-center justify-between mt-auto pt-4
              border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative"
                >
                  {/* Enhanced avatar background */}
                  <div className="h-10 w-10 rounded-full 
                    bg-gradient-to-br from-purple-400 via-fuchsia-500 to-blue-500
                    dark:from-purple-500 dark:via-fuchsia-600 dark:to-blue-600
                    p-[2px] transform group-hover:scale-110 transition-all duration-300
                    animate-gradient-xy">
                    <div className="h-full w-full rounded-full 
                      bg-white dark:bg-gray-900 
                      flex items-center justify-center
                      ring-1 ring-white/10 dark:ring-black/10">
                      <span className="text-lg font-medium 
                        bg-gradient-to-br from-purple-600 via-fuchsia-600 to-blue-600
                        dark:from-purple-400 dark:via-fuchsia-400 dark:to-blue-400
                        bg-clip-text text-transparent">
                        {blog.author?.name?.[0] || 'A'}
                      </span>
                    </div>
                  </div>
                </motion.div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {blog.author?.name || 'Anonymous'}
                  </span>
                  <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="h-3.5 w-3.5" />
                      {dayjs(blog.createdAt).format("MMM D, YYYY")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock className="h-3.5 w-3.5" />
                      {readTime} min read
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {canEdit && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/blog/edit/${blog.id}`);
                    }}
                    className="p-2 text-rose-600 dark:text-purple-400
                      bg-rose-50 dark:bg-purple-900/20
                      hover:bg-rose-100 hover:text-rose-700
                      dark:hover:bg-purple-800/30 dark:hover:text-purple-300
                      rounded-lg transition-all duration-300
                      ring-1 ring-rose-200 dark:ring-purple-700/50"
                    title="Edit blog"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </motion.button>
                )}
                {canDelete && (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(blog.id);
                    }}
                    className="p-2 text-red-600 dark:text-red-400
                      bg-red-50 dark:bg-red-900/20
                      hover:bg-red-100 hover:text-red-700
                      dark:hover:bg-red-800/30 dark:hover:text-red-300
                      rounded-lg transition-all duration-300
                      ring-1 ring-red-200 dark:ring-red-700/50"
                    title="Delete blog"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}