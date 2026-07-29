import React from 'react';
import { Loader2, Copy, Download } from 'lucide-react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-[#111] border border-[#272727] rounded-xl p-6 ${className}`}>
    {children}
  </div>
);

export const PrimaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean }> = ({ children, isLoading, className = '', ...props }) => (
  <button
    className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
    disabled={isLoading || props.disabled}
    {...props}
  >
    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
    {children}
  </button>
);

export const SecondaryButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
  <button
    className={`bg-[#272727] hover:bg-[#333] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input
    className={`bg-[#111] border border-[#333] focus:border-purple-500 focus:outline-none rounded-lg px-4 py-2 text-white w-full transition-colors ${className}`}
    {...props}
  />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => (
  <textarea
    className={`bg-[#111] border border-[#333] focus:border-purple-500 focus:outline-none rounded-lg px-4 py-2 text-white w-full transition-colors resize-none ${className}`}
    {...props}
  />
);
