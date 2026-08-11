import React, { useEffect, useState } from 'react';
import { ShieldAlert, Lock } from 'lucide-react';

export const CodeProtectionGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  useEffect(() => {
    // Helper to detect if target is an interactive form element
    const isEditableElement = (el: EventTarget | null): boolean => {
      if (!el || !(el instanceof HTMLElement)) return false;
      const tagName = el.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') return true;
      if (el.isContentEditable) return true;
      return false;
    };

    // 1. Context Menu (Right Click) Protection
    const handleContextMenu = (e: MouseEvent) => {
      // Allow right click ONLY inside text input / textarea if needed for paste
      if (isEditableElement(e.target)) return;
      e.preventDefault();
      triggerToast('Security Notice: Right-click & context menu are disabled to protect portal code.');
    };

    // 2. Keyboard Shortcuts Protection
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      // Always allow typing and navigation inside form inputs
      if (isEditableElement(e.target)) {
        // Only block view source or devtools even when inside input
        if (e.key === 'F12' || (isCmdOrCtrl && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) || (isCmdOrCtrl && key === 'u')) {
          e.preventDefault();
          triggerToast('Security Notice: Developer tools & source inspection are restricted.');
        }
        return;
      }

      // Block Developer Tools (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Cmd+Option+I)
      if (
        e.key === 'F12' ||
        (isCmdOrCtrl && e.shiftKey && (key === 'i' || key === 'j' || key === 'c'))
      ) {
        e.preventDefault();
        triggerToast('Security Notice: Inspector & Developer console access is disabled.');
        return;
      }

      // Block View Source (Ctrl+U)
      if (isCmdOrCtrl && key === 'u') {
        e.preventDefault();
        triggerToast('Security Notice: Page source viewing is restricted.');
        return;
      }

      // Block Save Page (Ctrl+S)
      if (isCmdOrCtrl && key === 's') {
        e.preventDefault();
        triggerToast('Security Notice: Saving website pages is disabled.');
        return;
      }

      // Block Copy (Ctrl+C)
      if (isCmdOrCtrl && key === 'c') {
        e.preventDefault();
        triggerToast('Security Notice: Content copying is disabled on this portal.');
        return;
      }

      // Block Cut (Ctrl+X)
      if (isCmdOrCtrl && key === 'x') {
        e.preventDefault();
        triggerToast('Security Notice: Content cutting is disabled.');
        return;
      }

      // Block Select All outside inputs (Ctrl+A)
      if (isCmdOrCtrl && key === 'a') {
        e.preventDefault();
      }
    };

    // 3. Drag & Drop Protection (prevent dragging images or assets out of app)
    const handleDragStart = (e: DragEvent) => {
      if (isEditableElement(e.target)) return;
      e.preventDefault();
    };

    // 4. Selection Start Protection
    const handleSelectStart = (e: Event) => {
      if (isEditableElement(e.target)) return;
      e.preventDefault();
    };

    // 5. Copy Event Protection
    const handleCopy = (e: ClipboardEvent) => {
      if (isEditableElement(e.target)) return;
      e.preventDefault();
      triggerToast('Security Notice: Copying text or code is disabled.');
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  return (
    <>
      {children}

      {/* Security Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-slate-900 text-white border border-slate-700 px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 text-xs font-semibold backdrop-blur-md bg-opacity-95 max-w-md text-center">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  );
};
