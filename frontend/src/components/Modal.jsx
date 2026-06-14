import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl w-full max-w-lg mx-4 border border-[#e2e8f0] shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-[#e2e8f0]">
          <h3 className="text-lg font-semibold text-[#1e293b]">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-[#f1f5f9] rounded text-[#64748b]"><X size={20} /></button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
