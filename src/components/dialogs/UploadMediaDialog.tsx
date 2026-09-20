import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UploadCloud,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Check,
  Film
} from 'lucide-react';

interface UploadMediaDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (media: { title: string; url: string; type: 'image' | 'video' | 'stream' }) => void;
}

export const UploadMediaDialog: React.FC<UploadMediaDialogProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'url'>('file');
  const [title, setTitle] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'file' && previewUrl) {
      const isVideo = selectedFile?.type.startsWith('video') || false;
      onUpload({
        title: title || selectedFile?.name || 'Uploaded Visual Feed',
        url: previewUrl,
        type: isVideo ? 'video' : 'image'
      });
      resetForm();
      onClose();
    } else if (activeTab === 'url' && streamUrl) {
      const isVideo = streamUrl.endsWith('.mp4') || streamUrl.includes('youtube') || streamUrl.includes('rtsp');
      onUpload({
        title: title || 'RTSP / Visual Stream',
        url: streamUrl,
        type: isVideo ? 'video' : 'stream'
      });
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setTitle('');
    setStreamUrl('');
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 text-left"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">
                Attach Visual Stream / CCTV Feed
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold">
                Upload incident photos, drone feeds, or RTSP camera streams
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Selection (File vs Stream URL) */}
          <div className="flex border-b border-slate-100 px-6 pt-2">
            <button
              onClick={() => setActiveTab('file')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 mr-4 flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeTab === 'file'
                  ? 'border-cyan-600 text-cyan-600 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Local File</span>
            </button>
            <button
              onClick={() => setActiveTab('url')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
                activeTab === 'url'
                  ? 'border-cyan-600 text-cyan-600 font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>Stream URL / RTSP Feed</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Title Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Feed Title / Label
              </label>
              <input
                type="text"
                placeholder="e.g. Responder Drone Feed #2, B2 Fire CCTV..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-medium"
              />
            </div>

            {/* File Upload Dropzone */}
            {activeTab === 'file' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={e => e.target.files && handleFileChange(e.target.files[0])}
                  accept="image/*,video/*"
                  className="hidden"
                />

                {!previewUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-cyan-500 bg-cyan-50/50'
                        : 'border-slate-300 hover:border-cyan-500 hover:bg-slate-50'
                    }`}
                  >
                    <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800">
                      Click to choose photo or video file
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Supports JPG, PNG, MP4, WEBM up to 50MB
                    </p>
                  </div>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 aspect-video group">
                    {selectedFile?.type.startsWith('video') ? (
                      <video src={previewUrl} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                      className="absolute top-2 right-2 p-1.5 bg-slate-900/80 text-white rounded-lg hover:bg-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* URL Input */}
            {activeTab === 'url' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Stream URL / Live RTSP Endpoint
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or rtsp://camera1.local/feed"
                  value={streamUrl}
                  onChange={e => setStreamUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Paste live CCTV image URL, YouTube live embed, or network camera stream link.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={activeTab === 'file' ? !previewUrl : !streamUrl}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Attach Stream</span>
              </button>
            </div>

          </form>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
