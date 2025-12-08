
import React from 'react';
import { Search, Home, Users, Briefcase, MessageSquare, Bell, Cpu } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <Cpu className="h-8 w-8 text-semi-700" />
              <span className="ml-2 text-xl font-bold text-semi-800 hidden md:block">SemiLink</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-64 pl-10 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-semi-500 focus:border-semi-500 sm:text-sm transition duration-150 ease-in-out"
                  placeholder="Search for chips, companies, or people"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end space-x-6 md:space-x-8">
            <NavItem 
              icon={<Home className="h-6 w-6" />} 
              label="Home" 
              active={currentView === 'home'} 
              onClick={() => onNavigate('home')}
            />
            <NavItem 
              icon={<Users className="h-6 w-6" />} 
              label="My Network" 
              active={currentView === 'network'}
              onClick={() => onNavigate('network')}
            />
            <NavItem 
              icon={<Briefcase className="h-6 w-6" />} 
              label="Jobs" 
              active={currentView === 'jobs' || currentView === 'job' || currentView === 'company'}
              onClick={() => onNavigate('jobs')}
            />
            <NavItem 
              icon={<MessageSquare className="h-6 w-6" />} 
              label="Messaging" 
              active={currentView === 'messaging'}
              onClick={() => onNavigate('messaging')}
            />
            <NavItem 
              icon={<Bell className="h-6 w-6" />} 
              label="Notifications" 
              active={currentView === 'notifications'}
              onClick={() => onNavigate('notifications')}
            />
            <div 
              className={`flex flex-col items-center cursor-pointer ${currentView === 'profile' ? 'border-b-2 border-gray-900' : ''}`}
              onClick={() => onNavigate('profile')}
            >
              <img
                className="h-6 w-6 rounded-full object-cover"
                src="https://picsum.photos/150/150?random=1"
                alt="Profile"
              />
              <span className={`hidden md:block text-xs mt-1 ${currentView === 'profile' ? 'text-gray-900' : 'text-gray-500'}`}>Me</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <div 
      className={`flex flex-col items-center cursor-pointer ${active ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
      onClick={onClick}
    >
      <div className="mt-1">{icon}</div>
      <span className="hidden md:block text-xs mt-1">{label}</span>
    </div>
  );
};

export default Navbar;
