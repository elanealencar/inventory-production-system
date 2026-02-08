import { useEffect, type ReactNode } from 'react';

type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, children, onClose }: ModalProps) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-[min(92vw,520px)] max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[calc(85vh-64px)] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}
