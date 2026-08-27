import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

interface SmaccFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SmaccFormModal: React.FC<SmaccFormModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel = 'حفظ وإرسال',
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  }[size];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in dir-rtl text-right">
      <div className={`w-full ${sizeClasses} bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}>
        {/* Modal Header */}
        <div className="p-5 bg-black text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
            {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar flex-1 bg-white text-black">
            {children}
          </div>

          {/* Modal Footer */}
          <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="button-outline-on-light"
              style={{ minHeight: '36px', padding: '6px 16px', fontSize: '13px' }}
            >
              إلغاء
            </button>
            {onSubmit && (
              <button
                type="submit"
                className="button-primary-pill"
                style={{ minHeight: '36px', padding: '6px 20px', fontSize: '13px' }}
              >
                <CheckCircle2 className="w-4 h-4 ml-1" />
                <span>{submitLabel}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
