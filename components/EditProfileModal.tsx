
import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { User, Experience } from '../types';

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
    experience: user.experience || [],
  });

  // State for new experience entry
  const [newExp, setNewExp] = useState<Partial<Experience>>({
    title: '',
    company: '',
    startDate: '',
    endDate: 'Present',
    description: '',
  });

  const [isAddingExp, setIsAddingExp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      ...formData,
    });
    onClose();
  };

  const handleAddExperience = () => {
    if (!newExp.title || !newExp.company) return;

    const experienceItem: Experience = {
        id: Date.now().toString(),
        title: newExp.title || '',
        company: newExp.company || '',
        startDate: newExp.startDate || '',
        endDate: newExp.endDate || 'Present',
        description: newExp.description || '',
        logoUrl: '' // Default or could fetch logo
    };

    setFormData({
        ...formData,
        experience: [experienceItem, ...formData.experience]
    });

    // Reset
    setNewExp({ title: '', company: '', startDate: '', endDate: 'Present', description: '' });
    setIsAddingExp(false);
  };

  const handleDeleteExperience = (id: string) => {
      setFormData({
          ...formData,
          experience: formData.experience.filter(exp => exp.id !== id)
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Edit profile</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Section: Basic Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">Intro</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
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

          <div className="border-t border-gray-100 pt-6">
             <h3 className="font-semibold text-gray-900 mb-4 text-lg">Profile Images</h3>
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

          <div className="border-t border-gray-100 pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-lg">About</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
            <textarea
              rows={4}
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-y"
              placeholder="Write about your years of experience, industry, or skills."
            />
          </div>

          {/* Section: Experience */}
          <div className="border-t border-gray-100 pt-6">
             <div className="flex justify-between items-center mb-4">
                 <h3 className="font-semibold text-gray-900 text-lg">Experience</h3>
                 {!isAddingExp && (
                     <button 
                      type="button" 
                      onClick={() => setIsAddingExp(true)}
                      className="flex items-center gap-1 text-blue-600 font-semibold text-sm hover:underline"
                     >
                         <Plus className="w-4 h-4" /> Add Position
                     </button>
                 )}
             </div>

             {isAddingExp && (
                 <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4 animate-in fade-in slide-in-from-top-2">
                     <div className="space-y-3">
                         <div>
                             <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
                             <input type="text" value={newExp.title} onChange={e => setNewExp({...newExp, title: e.target.value})} className="w-full border rounded px-2 py-1.5 text-sm" placeholder="Ex: Senior Engineer" />
                         </div>
                         <div>
                             <label className="block text-xs font-semibold text-gray-600 mb-1">Company *</label>
                             <input type="text" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} className="w-full border rounded px-2 py-1.5 text-sm" placeholder="Ex: Intel" />
                         </div>
                         <div className="flex gap-4">
                             <div className="flex-1">
                                 <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                                 <input type="text" value={newExp.startDate} onChange={e => setNewExp({...newExp, startDate: e.target.value})} className="w-full border rounded px-2 py-1.5 text-sm" placeholder="Ex: Jan 2020" />
                             </div>
                             <div className="flex-1">
                                 <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                                 <div className="flex items-center gap-2">
                                     <input 
                                      type="text" 
                                      value={newExp.endDate} 
                                      onChange={e => setNewExp({...newExp, endDate: e.target.value})} 
                                      disabled={newExp.endDate === 'Present'}
                                      className="w-full border rounded px-2 py-1.5 text-sm disabled:bg-gray-100 disabled:text-gray-400" 
                                      placeholder="Ex: Dec 2023" 
                                     />
                                     <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                                        <input 
                                          type="checkbox" 
                                          checked={newExp.endDate === 'Present'}
                                          onChange={(e) => setNewExp({...newExp, endDate: e.target.checked ? 'Present' : ''})}
                                        />
                                        Present
                                     </label>
                                 </div>
                             </div>
                         </div>
                         <div>
                             <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                             <textarea rows={2} value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})} className="w-full border rounded px-2 py-1.5 text-sm" placeholder="Briefly describe your role." />
                         </div>
                         <div className="flex gap-2 justify-end mt-2">
                             <button type="button" onClick={() => setIsAddingExp(false)} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
                             <button type="button" onClick={handleAddExperience} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
                         </div>
                     </div>
                 </div>
             )}

             <div className="space-y-4">
                 {formData.experience.map((exp) => (
                     <div key={exp.id} className="flex justify-between items-start border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                         <div>
                             <h4 className="font-bold text-gray-800 text-sm">{exp.title}</h4>
                             <p className="text-sm text-gray-600">{exp.company}</p>
                             <p className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</p>
                         </div>
                         <button 
                          type="button" 
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                          title="Remove position"
                         >
                             <Trash2 className="w-4 h-4" />
                         </button>
                     </div>
                 ))}
                 {formData.experience.length === 0 && !isAddingExp && (
                     <p className="text-sm text-gray-500 italic">No experience added yet.</p>
                 )}
             </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-full font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
