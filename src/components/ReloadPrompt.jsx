import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { FiRefreshCw, FiX } from 'react-icons/fi';

const ReloadPrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Periodically check for updates every hour
      if (r) {
        setInterval(() => {
          r.update();
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.error('SW registration error', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[99999] bg-white rounded-xl shadow-2xl border border-indigo-100 p-4 max-w-sm w-full mx-4 flex flex-col gap-3 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FiRefreshCw className="text-indigo-600 animate-spin-slow" /> 
            Update Available
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            A new version of ParentaLink is ready. Update now to get the latest features and bug fixes.
          </p>
        </div>
        <button 
          onClick={() => setNeedRefresh(false)}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <FiX size={18} />
        </button>
      </div>
      <div className="flex gap-2 mt-1">
        <button
          onClick={() => updateServiceWorker(true)}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-colors"
        >
          Update & Reload
        </button>
      </div>
      <style>{`
        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ReloadPrompt;
