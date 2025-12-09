
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { User } from '../types';

interface EditProfileModalProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    headline: user.headline,
    location: user.location || '',
    about: user.about || '',
    avatarUrl: user.avatarUrl,
    backgroundImageUrl: user.backgroundImageUrl || 'https://picsum.photos/800/200?random=99',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      ...formData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Edit intro</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Basic Info</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name & Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Current Position</label>
                 <p className="text-xs text-gray-500 mb-2">To update current position, please update the Experience section (Coming soon).</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: San Jose, CA"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div>
             <h3 className="font-semibold text-gray-900 mb-4">Images</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo URL</label>
                   <input
                    type="text"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
                   <input
                    type="text"
                    value={formData.backgroundImageUrl}
                    onChange={(e) => setFormData({ ...formData, backgroundImageUrl: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                   />
                </div>
             </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">About</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
            <textarea
              rows={5}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
              placeholder="Write about your years of experience, industry, or skills. People also talk about their achievements or previous job experiences."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-full font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
