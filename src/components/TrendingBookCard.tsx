import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface TrendingBookCardProps {
  book: any;
  rank: number;
}

const TrendingBookCard: React.FC<TrendingBookCardProps> = ({ book, rank }) => {
  const isTopThree = rank <= 3;

  return (
    <Link to={`/book/${book._id}`} className="block">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: rank * 0.07, duration: 0.5, ease: 'easeOut' }}
        whileHover={{ y: -6, scale: 1.015 }}
        className="group relative overflow-hidden rounded-[2rem] border border-gold-900/20 hover:border-gold-500/50 transition-all duration-500 shadow-lg hover:shadow-[0_24px_70px_-10px_rgba(212,175,55,0.35)]"
        style={{
          background: 'linear-gradient(135deg, rgba(18,15,25,0.95) 0%, rgba(12,10,18,0.98) 100%)',
          height: '9rem',
        }}
      >
        {/* Ambient background glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 50%, rgba(212,175,55,0.07) 0%, transparent 70%)' }}
        />

        {/* Rank Watermark */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 font-amiri font-black select-none leading-none transition-all duration-500 group-hover:opacity-25"
          style={{
            fontSize: '5.5rem',
            background: isTopThree
              ? 'linear-gradient(135deg, #d4af37, #8b6914)'
              : 'linear-gradient(135deg, rgba(212,175,55,0.4), rgba(139,105,20,0.2))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: isTopThree ? 0.2 : 0.1,
          }}
        >
          {rank}
        </div>

        {/* Cover Image */}
        <div className="absolute right-0 top-0 bottom-0 w-28 overflow-hidden border-r border-gold-900/30 group-hover:border-gold-500/30 transition-colors">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[rgba(12,10,18,0.3)] z-10 pointer-events-none" />
          <img
            src={book.coverImage}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=300'; }}
          />
        </div>

        {/* Top gold line for top-3 */}
        {isTopThree && (
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/70 to-transparent" />
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center pr-32 pl-6 py-5">
          {/* Tags row */}
          <div className="flex items-center gap-2 mb-2.5">
            <div className="badge-trending flex items-center gap-1 text-[10px]">
              <LocalFireDepartmentIcon className="text-orange-400" style={{ fontSize: '11px' }} />
              <span>رائج</span>
            </div>
            {isTopThree && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-black"
                style={{
                  border: '1px solid rgba(212,175,55,0.4)',
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(139,105,20,0.1))',
                  color: '#d4af37',
                }}>
                #{rank} الأكثر قراءةً
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-amiri font-black text-white text-xl leading-tight line-clamp-1 group-hover:text-gold-300 transition-colors duration-400 mb-1">
            {book.title}
          </h3>

          {/* Author */}
          <p className="text-slate-500 text-xs font-bold line-clamp-1 mb-3 group-hover:text-slate-400 transition-colors">
            {book.author}
          </p>

          {/* Footer row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-slate-600">
              {book.views ? (
                <span className="flex items-center gap-1 text-xs text-slate-500 group-hover:text-gold-500/70 transition-colors">
                  <VisibilityIcon style={{ fontSize: '13px' }} />
                  <span className="font-bold">{book.views.toLocaleString()}</span>
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <span className={`font-amiri font-black text-base ${book.price === 0 ? 'text-emerald-400' : 'text-gold-400'}`}>
                {book.price === 0 ? 'مجاني' : `$${Number(book.price).toFixed(2)}`}
              </span>
              <ArrowForwardIosIcon
                className="text-gold-500/30 group-hover:text-gold-500/80 transition-colors"
                style={{ fontSize: '11px', transform: 'rotate(180deg)' }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default TrendingBookCard;
