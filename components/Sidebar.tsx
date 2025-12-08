
import React from 'react';
import { Bookmark, UserPlus } from 'lucide-react';
import { CURRENT_USER } from '../constants';

interface SidebarProps {
  onNavigate?: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Banner */}
        <div 
          className="h-16 bg-gradient-to-r from-semi-700 to-semi-500 cursor-pointer"
          onClick={() => onNavigate && onNavigate('profile')}
        ></div>
        
        {/* Profile Info */}
        <div className="px-4 pb-4 relative">
          <div 
            className="absolute -top-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
            onClick={() => onNavigate && onNavigate('profile')}
          >
            <img
              src={CURRENT_USER.avatarUrl}
              alt={CURRENT_USER.name}
              className="w-20 h-20 rounded-full border-4 border-white object-cover"
            />
          </div>
          
          <div className="mt-12 text-center">
            <h2 
              className="text-lg font-bold text-gray-900 hover:underline cursor-pointer"
              onClick={() => onNavigate && onNavigate('profile')}
            >
              {CURRENT_USER.name}
            </h2>
            <p className="text-xs text-gray-500 mt-1 leading-tight">
              {CURRENT_USER.headline}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div 
              className="flex justify-between items-center text-sm px-2 hover:bg-gray-100 py-1 rounded cursor-pointer"
              onClick={() => onNavigate && onNavigate('network')}
            >
              <span className="text-gray-500 font-medium">Connections</span>
              <span className="text-semi-700 font-bold">{CURRENT_USER.connections}</span>
            </div>
            <div 
              className="flex justify-between items-center text-sm px-2 hover:bg-gray-100 py-1 rounded cursor-pointer mt-1"
              onClick={() => onNavigate && onNavigate('profile')}
            >
              <span className="text-gray-500 font-medium">Profile views</span>
              <span className="text-semi-700 font-bold">342</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-600 hover:bg-gray-100 p-2 rounded cursor-pointer">
            <Bookmark className="w-4 h-4 text-gray-500" />
            <span className="font-semibold">My Items</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-20">
        <h3 className="text-xs font-semibold text-gray-900 mb-3">Recent</h3>
        <ul className="space-y-2">
            {[
                '# RISC-V Summit',
                '# TSMC Technology Symposium',
                '# Chiplets',
                '# Analog Design',
                '# Semiconductor Physics'
            ].map((item, idx) => (
                <li key={idx} className="text-xs text-gray-500 font-medium hover:text-gray-900 hover:underline cursor-pointer flex items-center gap-2">
                   <UserPlus className="w-3 h-3" /> {item}
                </li>
            ))}
        </ul>
        <div className="mt-4 pt-3 border-t border-gray-100 text-center">
             <button className="text-sm text-gray-500 hover:text-gray-900 font-semibold">Discover more</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
