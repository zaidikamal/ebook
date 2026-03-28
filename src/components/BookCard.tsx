import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  rating: number;
}

const BookCard = ({ book, isPriority = false }: { book: Book, isPriority?: boolean }) => {
  const originalPrice = book.price > 0 ? (book.price * 1.4).toFixed(2) : null;
  // Stable "trending" state derived from ID to avoid re-render performance hits
  const isTrending = book._id.length % 3 === 0;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group block h-full"
    >
      <Link to={`/book/${book._id}`} className="block h-full relative">
        <div className="card-premium aspect-[3/4.6] overflow-hidden relative">
          {/* Badges */}
          <div className="absolute top-5 right-5 z-20 flex flex-col gap-2">
             {isTrending && (
               <span className="bg-gold-500 text-surface text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl">شائع</span>
             )}
             {book.price === 0 && (
               <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-xl">مجاني</span>
             )}
          </div>

          <img 
            src={book.coverImage} 
            alt={book.title} 
            loading={isPriority ? "eager" : "lazy"}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
            onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
          />
          
          {/* Elegant Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Content Over Image */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end text-right">
             <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
               <div className="flex items-center justify-end gap-1 text-gold-400 text-xs font-black mb-2 px-1">
                 <span>{book.rating}</span>
                 <span className="text-[10px]">★</span>
               </div>
               <h3 className="text-xl md:text-2xl font-amiri font-black text-white leading-tight mb-2 line-clamp-2 drop-shadow-lg">
                 {book.title}
               </h3>
               <p className="text-on-surface-variant text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-1">
                 {book.author}
               </p>
             </div>
          </div>
        </div>

        {/* Pricing & Quick Action */}
        <div className="mt-6 flex flex-row-reverse justify-between items-center px-2">
           <div className="text-right">
              {originalPrice && book.price > 0 && (
                <span className="text-slate-600 line-through text-xs block mb-0.5">${originalPrice}</span>
              )}
              <span className="text-2xl font-amiri font-black text-white">
                {book.price === 0 ? 'مجانًا' : `$${book.price.toFixed(2)}`}
              </span>
           </div>
           
           <motion.button 
             whileTap={{ scale: 0.9 }}
             className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-slate-950 transition-all duration-300 shadow-lg"
           >
             <AddShoppingCartIcon className="text-xl" />
           </motion.button>
        </div>
      </Link>
    </motion.div>
  );
};

export default BookCard;
