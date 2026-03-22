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
  const isTrending = Math.random() > 0.7;

  return (
    <Link to={`/book/${book._id}`} className="group block h-full">
      <div className="relative aspect-[3/4.5] rounded-[2rem] overflow-hidden bg-surface-container-low border border-gold-900/10 group-hover:border-gold-500/50 transition-all duration-500 shadow-xl group-hover:shadow-[0_30px_60px_-15px_rgba(212,175,55,0.2)]">
        {/* Badges */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
           {isTrending && (
             <span className="bg-gold-500 text-surface text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse">شائع الآن</span>
           )}
           {book.price === 0 && (
             <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">نسخة مجانية</span>
           )}
        </div>

        <img 
          src={book.coverImage} 
          alt={`غلاف كتاب ${book.title} للمؤلف ${book.author}`} 
          loading={isPriority ? "eager" : "lazy"}
          {...(isPriority ? { fetchPriority: "high" } as any : {})}
          width="400"
          height="600"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.png';
          }}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
        
        {/* Quick Info */}
        <div className="absolute bottom-6 left-6 right-6 text-right">
           <div className="absolute top-4 right-4 bg-gold-500 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg">
          {book.rating} ★
        </div>

        <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <div className="flex-1">
            <h3 className="book-title text-xl mb-1 line-clamp-2">{book.title}</h3>
            <p className="text-gold-200 text-sm font-bold opacity-80">{book.author}</p>
          </div>
        </div>
        </div>
      </div>

      <div className="mt-5 flex flex-row-reverse justify-between items-center px-2">
         <div className="price flex flex-col items-end">
            {originalPrice && book.price > 0 && (
              <del className="text-gray-400">${originalPrice}</del>
            )}
            <span className="text-red-600 font-bold text-2xl font-amiri">
              {book.price === 0 ? 'مجانًا' : `$${book.price.toFixed(2)}`}
            </span>
         </div>
         <motion.button 
           whileTap={{ scale: 0.9 }}
           aria-label={`أضف كتاب ${book.title} إلى سلة المشتريات`}
           className="w-10 h-10 rounded-full border border-gold-900/30 flex items-center justify-center text-gold-500 hover:bg-gold-500 hover:text-surface transition-all"
         >
           <AddShoppingCartIcon className="text-xl" />
         </motion.button>
      </div>
    </Link>
  );
};

export default BookCard;
