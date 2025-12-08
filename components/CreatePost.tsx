
import React, { useState, useRef } from 'react';
import { Image, Video, Calendar, MoreHorizontal, Wand2, Send, Loader2, X } from 'lucide-react';
import { CURRENT_USER } from '../constants';
import { generateIndustryInsight, polishPostContent } from '../services/geminiService';
import { Post, User } from '../types';

interface CreatePostProps {
  onPostCreated: (post: Post) => void;
  currentUser?: User;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, currentUser }) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const user = currentUser || CURRENT_USER;

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Pick a random topic to inspire the AI
    const topics = ["FinFET Scaling", "Chip Shortage Recovery", "RISC-V Adoption", "Advanced Packaging", "Photonics", "EUV Lithography"];
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const aiText = await generateIndustryInsight(randomTopic);
    setContent(aiText);
    setIsGenerating(false);
  };

  const handlePolish = async () => {
    if (!content.trim()) return;
    setIsGenerating(true);
    const polished = await polishPostContent(content);
    setContent(polished);
    setIsGenerating(false);
  };

  const handleMediaClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleVideoClick = () => {
    // Simulate video attachment for the mock
    setContent(prev => prev + (prev ? '\n\n' : '') + "🎥 [Video Attachment: Industry Update Clip]");
  };

  const handleEventClick = () => {
    setContent(prev => prev + (prev ? '\n\n' : '') + "📅 Event Invitation:\nTopic: \nDate: \nLocation: \nLink: ");
  };

  const handleSubmit = () => {
    if (!content.trim() && !selectedImage) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: user,
      content: content,
      imageUrl: selectedImage || undefined,
      likes: 0,
      comments: 0,
      timestamp: 'Just now',
      tags: ['IndustryUpdate']
    };

    onPostCreated(newPost);
    setContent('');
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm mb-4 border border-gray-200">
      <div className="p-4">
        <div className="flex gap-3">
          <img
            src={imgError ? "https://via.placeholder.com/150?text=User" : user.avatarUrl}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
            onError={() => setImgError(true)}
          />
          <div className="flex-1">
            <textarea
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-semi-500 resize-none"
              placeholder={`Start a post about chip design, fab updates, or industry trends...`}
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {selectedImage && (
              <div className="relative mt-2 inline-block">
                <img src={selectedImage} alt="Preview" className="max-h-48 rounded-lg border border-gray-200" />
                <button 
                  onClick={removeImage}
                  className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-4">
            <ActionButton 
              icon={<Image className="w-5 h-5 text-blue-500" />} 
              label="Media" 
              onClick={handleMediaClick}
            />
            <ActionButton 
              icon={<Video className="w-5 h-5 text-green-600" />} 
              label="Video" 
              onClick={handleVideoClick}
            />
            <ActionButton 
              icon={<Calendar className="w-5 h-5 text-orange-500" />} 
              label="Event" 
              onClick={handleEventClick}
            />
          </div>
          
          <div className="flex gap-2">
             <button
              onClick={handlePolish}
              disabled={isGenerating || !content}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-semi-700 hover:bg-semi-50 rounded-md transition-colors disabled:opacity-50"
              title="Polish with AI"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              <span className="hidden sm:inline">Polish</span>
            </button>
             <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-purple-700 hover:bg-purple-50 rounded-md transition-colors disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              <span className="hidden sm:inline">Inspire Me</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() && !selectedImage}
              className="flex items-center gap-2 px-4 py-1.5 bg-semi-700 text-white rounded-full font-semibold text-sm hover:bg-semi-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Post <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void }> = ({ icon, label, onClick }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
  >
    {icon}
    <span className="text-sm font-medium text-gray-500">{label}</span>
  </button>
);

export default CreatePost;
