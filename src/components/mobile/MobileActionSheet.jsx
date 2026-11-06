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
          className="absolute inset-0 bg-ww-text/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          className="relative z-10 w-full bg-white rounded-t-2xl border-t border-ww-border shadow-[0_-10px_40px_rgba(34,37,31,0.12)] max-h-[85vh] overflow-y-auto scroll-hide pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
        >
          <div className="w-10 h-1 bg-ww-border-strong rounded-full mx-auto mt-4 mb-2" />

          <div className="px-5 pb-2 pt-3 flex items-start justify-between border-b border-ww-border">
            <div>
              {title && <h3 className="text-base font-semibold text-ww-text">{title}</h3>}
              {subtitle && <p className="text-xs text-ww-text-secondary mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-ww-text-muted hover:text-ww-text hover:bg-ww-bg-alt transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default React.memo(MobileActionSheet);
