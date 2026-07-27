import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Info, AlertTriangle, AlertOctagon, Trash2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, clearNotification, clearAllNotifications } = useApp();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-md"
            >
              <div className="h-full flex flex-col bg-slate-900/95 backdrop-blur-2xl text-white border-l border-white/10 shadow-2xl">
                {/* Header */}
                <div className="p-5 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="relative p-2 bg-rose-500/10 rounded-lg text-rose-500">
                      <Bell className="w-5 h-5 animate-swing" />
                      {notifications.some(n => !n.read) && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full animate-ping" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider">EOC Broadcast Alert Feed</h3>
                      <p className="text-[10px] text-slate-400">Real-time digital twin critical notifications</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Toolbar */}
                {notifications.length > 0 && (
                  <div className="px-5 py-2 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{notifications.length} active alerts</span>
                    <button
                      onClick={clearAllNotifications}
                      className="text-[10px] text-rose-400 hover:text-rose-300 font-bold uppercase flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All Alerts</span>
                    </button>
                  </div>
                )}

                {/* Alert Cards Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {notifications.map(notif => {
                    let icon = <Info className="w-4 h-4 text-blue-400" />;
                    let borderClass = 'border-blue-500/20 bg-blue-500/5';
                    
                    if (notif.severity === 'error') {
                      icon = <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />;
                      borderClass = 'border-rose-500/30 bg-rose-500/10';
                    } else if (notif.severity === 'warning') {
                      icon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
                      borderClass = 'border-amber-500/30 bg-amber-500/10';
                    }

                    return (
                      <motion.div
                        layout
                        key={notif.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`p-3.5 rounded-xl border ${borderClass} flex items-start space-x-3 transition-all relative group`}
                      >
                        <div className="mt-0.5">{icon}</div>
                        <div className="flex-1">
                          <p className="text-xs text-slate-200 leading-normal font-medium">{notif.message}</p>
                          <span className="text-[9px] text-slate-400 block mt-2 font-mono uppercase">
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <button
                          onClick={() => clearNotification(notif.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-all absolute top-2 right-2 cursor-pointer"
                          title="Dismiss Alert"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    );
                  })}

                  {notifications.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 text-slate-500">
                      <CheckCircle2 className="w-12 h-12 text-slate-600 mb-3 opacity-60" />
                      <p className="text-xs font-semibold uppercase tracking-wider">All Clear</p>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">No critical EOC system anomalies or incidents require attention</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
export default NotificationDrawer;
