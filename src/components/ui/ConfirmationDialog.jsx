import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, AlertCircle } from 'lucide-react';

const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  description = 'Are you sure you want to proceed? This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          variant === 'danger' ? 'bg-ww-danger-bg text-ww-danger' : 'bg-ww-green-bg text-ww-accent'
        }`}>
          {variant === 'danger' ? <AlertTriangle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        </div>
        <div>
          <h3 className="text-base font-bold text-ww-text">{title}</h3>
          <p className="text-xs text-ww-text-secondary mt-1 leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-ww-border">
        <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'danger' : 'primary'}
          size="sm"
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default React.memo(ConfirmationDialog);

