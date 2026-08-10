import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#020e10]/85 backdrop-blur-md"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className={`relative z-10 w-full ${maxWidth} p-6 md:p-8 border-t sm:border max-sm:border-[#E5DFD1] sm:border-neon-cyan/25 max-sm:bg-[#F7F4EC] max-sm:text-[#1C1917] sm:text-white rounded-t-3xl sm:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] max-h-[90vh] overflow-y-auto scroll-hide`}
        >
          <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4 sm:hidden" />
          <div className="flex items-start justify-between mb-6">
            <div>
              {title && <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight italic">{title}</h3>}
              {subtitle && <p className="text-[10px] text-cyan-400/70 font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all focus-visible:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default React.memo(Modal);
