import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const MobileActionSheet = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
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
      <div className="fixed inset-0 z-50 flex items-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#1C1917]/50 backdrop-blur-md"
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="relative z-10 w-full bg-[#F7F4EC] rounded-t-3xl border-t border-[#E5DFD1] p-6 shadow-[0_-20px_50px_rgba(28,25,23,0.15)] max-h-[85vh] overflow-y-auto scroll-hide pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        >
          <div className="w-12 h-1 bg-[#D6CDB8] rounded-full mx-auto mb-5" />

          <div className="flex items-start justify-between mb-5 pb-3 border-b border-[#E5DFD1]">
            <div>
              {title && <h3 className="text-lg font-black text-[#1C1917] uppercase tracking-tight italic">{title}</h3>}
              {subtitle && <p className="text-[10px] text-[#0284C7] font-bold uppercase tracking-widest mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white border border-[#E5DFD1] text-[#78716C] hover:text-[#1C1917] transition-all cursor-pointer shadow-xs"
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

export default React.memo(MobileActionSheet);
