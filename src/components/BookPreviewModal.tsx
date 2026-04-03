import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker for react-pdf with matched version
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface BookPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string;
  bookId: string;
  title: string;
  price: number;
}

const MAX_PREVIEW_PAGES = 15;

const BookPreviewModal: React.FC<BookPreviewModalProps> = ({ isOpen, onClose, fileUrl, bookId, title, price }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = () => {
    setError(true);
    setLoading(false);
  };

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  const isPreviewEnd = pageNumber >= Math.min(numPages, MAX_PREVIEW_PAGES);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-surface/90 backdrop-blur-xl"
        dir="rtl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 text-slate-400 hover:text-white bg-surface-container-low p-2 rounded-full transition-colors z-50 border border-white/10"
        >
          <CloseIcon />
        </button>

        <motion.div 
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-surface-container-lowest w-full max-w-4xl h-[90vh] rounded-[3rem] border border-gold-900/20 shadow-2xl overflow-hidden flex flex-col relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gold-900/20 to-transparent p-6 border-b border-gold-900/10 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-amiri font-black gold-text mb-1">{title}</h2>
              <span className="text-[10px] bg-gold-500/10 text-gold-500 px-3 py-1 rounded-full font-bold uppercase tracking-widest border border-gold-500/20">
                قراءة مجانية (الفصل الأول)
              </span>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="flex-1 overflow-y-auto bg-black/40 p-4 sm:p-8 flex flex-col items-center justify-start min-h-0 relative">
            {error ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <ErrorOutlineIcon className="text-6xl text-red-500/50" />
                <p className="text-xl font-bold text-slate-300">عذراً، لم نتمكن من عرض المعاينة لهذا المجلد.</p>
                <p className="text-sm text-slate-500">قد يكون الملف محمياً أو غير متوفر حالياً.</p>
              </div>
            ) : (
              <div className="relative shadow-2xl rounded-lg overflow-hidden border border-white/5 bg-white w-full max-w-fit mx-auto transition-all">
                {/* Note: The file prop uses our Supabase direct public URL */}
                <Document
                  file={fileUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={<div className="p-20 text-gold-500 font-black animate-pulse">جاري استحضار المخطوطة...</div>}
                  className="flex justify-center"
                >
                  <Page 
                    pageNumber={pageNumber} 
                    renderTextLayer={false} 
                    renderAnnotationLayer={false}
                    width={Math.min(window.innerWidth - 64, 800)}
                    loading={<div className="w-[800px] h-[1000px] bg-white animate-pulse" />}
                  />
                </Document>

                {/* Overlay for End of Preview */}
                <AnimatePresence>
                  {!loading && isPreviewEnd && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-8 z-20"
                    >
                      <h3 className="text-3xl font-amiri font-black text-white mb-4">نهاية القراءة المجانية</h3>
                      <p className="text-slate-300 mb-8 max-w-md">
                        لقد وصلت إلى نهاية الفصل المتاح مجاناً. لاقتناء هذا المجلد الملكي وضمّه لخزانتك وإكمال القراءة، يرجى إتمام عملية الشراء.
                      </p>
                      <button 
                        onClick={() => navigate(`/checkout/${bookId}`)}
                        className="gold-button px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-gold-500/20 flex items-center gap-3 hover:scale-105 transition-transform"
                      >
                        <ShoppingCartCheckoutIcon />
                        اقتناء النسخة الكاملة (${price})
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Footer Controls */}
          {!error && !loading && (
            <div className="p-6 bg-surface-container-low border-t border-gold-900/10 flex items-center justify-between">
              <button 
                disabled={pageNumber <= 1} 
                onClick={previousPage}
                className="p-3 bg-surface rounded-xl text-gold-500 hover:bg-gold-500 hover:text-surface transition-all disabled:opacity-30 disabled:hover:bg-surface disabled:hover:text-gold-500 border border-gold-500/20"
              >
                <NavigateNextIcon />
              </button>
              
              <p className="font-bold text-slate-400 text-sm">
                صفحة <span className="text-gold-500 mx-1">{pageNumber}</span> من <span className="mx-1">{Math.min(numPages, MAX_PREVIEW_PAGES)}</span>
                {numPages > MAX_PREVIEW_PAGES && <span className="text-[10px] ml-2 opcaity-50">(معاينة مجانية)</span>}
              </p>

              <button 
                disabled={isPreviewEnd} 
                onClick={nextPage}
                className="p-3 bg-surface rounded-xl text-gold-500 hover:bg-gold-500 hover:text-surface transition-all disabled:opacity-30 disabled:hover:bg-surface disabled:hover:text-gold-500 border border-gold-500/20"
              >
                <NavigateBeforeIcon />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookPreviewModal;
