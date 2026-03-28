import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface TrendingBookCardProps {
  book: any;
  rank: number;
}

const TrendingBookCard: React.FC<TrendingBookCardProps> = ({ book, rank }) => {
  return (
    <Link to={`/book/${book._id}`}>
      <motion.div 
        whileHover={{ y: -8, scale: 1.02 }}
        className="group relative h-40 sm:h-48 md:h-56 bg-surface-container-low rounded-[2rem] border border-gold-900/20 overflow-hidden flex shadow-lg hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.3)] hover:border-gold-500/50 transition-all duration-500"
      >
        {/* Number Badge */}
        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-bl from-gold-500 to-gold-900 rounded-bl-[2rem] flex items-start justify-end p-3 sm:p-4 z-20 shadow-xl">
          <span className="text-2xl sm:text-3xl font-black text-surface font-amiri leading-none">{rank}</span>
        </div>

        {/* Cover Image Wrapper with Glow */}
        <div className="relative w-28 sm:w-36 md:w-44 h-full flex-shrink-0 z-10 overflow-hidden bg-surface-container-lowest border-l border-gold-900/30 group-hover:border-gold-500/30 transition-colors">
          <div className="absolute inset-0 bg-gold-500/20 group-hover:bg-transparent transition-colors z-10"></div>
          <img 
            src={book.coverImage} 
            alt={book.title} 
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-center relative z-10">
          {/* Subtle Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gold-600/10 rounded-full blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
             <div className="flex bg-gold-900/20 px-2 py-1 rounded-full items-center gap-1 border border-gold-500/20">
               <LocalFireDepartmentIcon className="text-orange-500 text-[10px] sm:text-xs" />
               <span className="text-orange-400 text-[9px] sm:text-[10px] font-black tracking-widest uppercase">الأكثر رواجاً</span>
             </div>
             {book.rating && (
               <div className="flex items-center gap-1">
                 <StarIcon className="text-gold-400 text-[10px] sm:text-xs" />
                 <span className="text-gold-400 text-xs sm:text-sm font-bold">{book.rating}</span>
               </div>
             )}
          </div>

          <h3 className="text-lg sm:text-xl md:text-2xl font-amiri font-black text-white mb-1 sm:mb-2 line-clamp-1 group-hover:text-gold-400 transition-colors">{book.title}</h3>
          <p className="text-slate-400 text-xs sm:text-sm font-bold mb-3 sm:mb-4 line-clamp-1">{book.author}</p>
          
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gold-900/10">
            <div className="flex items-center gap-2 text-slate-500 group-hover:text-gold-500/80 transition-colors">
               <VisibilityIcon className="text-[14px] sm:text-[16px]" />
               <span className="text-xs sm:text-sm font-black">{book.views ? `${book.views} مشاهدة` : 'رائج جداً'}</span>
            </div>
            <span className="text-gold-500 font-black text-sm sm:text-lg">
              {book.price === 0 ? 'مجاني' : `$${book.price}`}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default TrendingBookCard;
