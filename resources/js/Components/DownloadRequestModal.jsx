// resources/js/Components/DownloadRequestModal.jsx
import React, { useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import axios from 'axios';

const DownloadRequestModal = ({ isOpen, onClose, publicationId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await axios.post(
        route('publication.download.store', publicationId),
        { name, email }
      );

      if (response.data.success && response.data.download) {
        window.open(response.data.download, '_blank', 'noopener,noreferrer');
        onClose();
        setName('');
        setEmail('');
      }
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#1f2d2d]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#5f6967] hover:text-[#bf5429] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display text-2xl text-[#1f2d2d] font-medium mb-2">
          Access this publication
        </h3>
        <p className="text-sm text-[#5f6967] mb-6 leading-relaxed">
          Please enter your name and email to download this document. Your
          information will be used solely to keep you informed about our
          publications and research updates.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1f2d2d] mb-1.5">
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-[#d6d9d8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bf5429]/40"
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1f2d2d] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-[#d6d9d8] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#bf5429]/40"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 w-full rounded-xl bg-[#1f2d2d] hover:bg-[#bf5429] text-white font-semibold py-3 transition-colors duration-300 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {loading ? 'Please wait...' : 'Continue to download'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DownloadRequestModal;