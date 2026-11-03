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
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#22251F]/40 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          className={`relative z-10 w-full ${maxWidth} bg-white border border-[#EAE8DF] rounded-t-3xl sm:rounded-2xl shadow-[0_20px_60px_rgba(34,37,31,0.14)] max-h-[90vh] overflow-y-auto scroll-hide`}
        >
          {/* Mobile top pill handle */}
          <div className="w-10 h-1 bg-[#D5D2C8] rounded-full mx-auto mt-3.5 mb-1 sm:hidden" />

          <div className="p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                {title && <h3 className="text-base font-bold text-[#22251F]">{title}</h3>}
                {subtitle && <p className="text-xs text-[#77786F] mt-0.5">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-[#A3A297] hover:text-[#22251F] hover:bg-[#F1EFE7] transition-all focus-visible:outline-none ml-4 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default React.memo(Modal);
