import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  rating: number;
  isRoyal?: boolean;
}

const BookCard = ({ book, isPriority = false }: { book: Book, isPriority?: boolean }) => {
  const originalPrice = book.price > 0 ? (book.price * 1.4).toFixed(2) : null;
  const isTrending = book._id.length % 3 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="group block h-full"
    >
      <Link to={`/book/${book._id}`} className="block h-full relative">
        {/* Card wrapper */}
        <div className="card-premium aspect-[3/4.6] overflow-hidden relative">

          {/* Floating Glow Orb on hover */}
          <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700 pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
            {book.isRoyal && (
              <span className="badge-trending flex items-center gap-1">
                👑 <span>ملكي</span>
              </span>
            )}
            {isTrending && !book.isRoyal && (
              <span className="badge-trending flex items-center gap-1">
                🔥 <span>شائع</span>
              </span>
            )}
            {book.price === 0 && (
              <span className="badge-free">مجاني</span>
            )}
          </div>

          {/* Cover image */}
          <img
            src={book.coverImage}
            alt={book.title}
            loading={isPriority ? 'eager' : 'lazy'}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'; }}
          />

          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0e] via-[#0a0a0e]/50 to-transparent opacity-95 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-br from-gold-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Content overlay */}
          <div className="absolute inset-0 p-5 flex flex-col justify-end text-right z-10">
            {/* Rating */}
            <div className="flex items-center justify-end gap-1 mb-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`text-[10px] ${i < Math.round(book.rating) ? 'text-gold-400' : 'text-slate-700'}`}
                />
              ))}
              <span className="text-gold-400 text-xs font-black ml-1">{book.rating?.toFixed(1)}</span>
            </div>

            {/* Title */}
            <h3 
              title={book.title}
              className="text-lg md:text-xl font-amiri font-black text-white leading-[1.3] line-clamp-2 drop-shadow-lg mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-400"
            >
              {book.title}
            </h3>

            {/* Author */}
            <p 
              title={book.author}
              className="text-gold-500/70 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-1"
            >
              {book.author}
            </p>
          </div>

          {/* Bottom shine line */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 flex flex-row-reverse justify-between items-center px-1">
          <div className="text-right">
            {originalPrice && book.price > 0 && (
              <span className="text-slate-600 line-through text-[11px] block leading-none mb-0.5">${originalPrice}</span>
            )}
            <span className={`text-xl font-amiri font-black ${book.price === 0 ? 'text-emerald-400' : 'text-white'}`}>
              {book.price === 0 ? 'مجانًا' : `$${book.price.toFixed(2)}`}
            </span>
          </div>

          <motion.button
            whileTap={{ scale: 0.85 }}
            className="w-11 h-11 rounded-2xl bg-gold-500/8 border border-gold-500/20 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-slate-950 hover:border-gold-400 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 shadow-lg"
          >
            <AddShoppingCartIcon className="text-[18px]" />
          </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;
