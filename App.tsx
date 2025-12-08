
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import JobsFeed from './components/JobsFeed';
import CompanyProfile from './components/CompanyProfile';
import JobDetail from './components/JobDetail';
import RightPanel from './components/RightPanel';
import { MOCK_COMPANIES, CURRENT_USER } from './constants';
import { Company, Job } from './types';
import { Users, MessageSquare, Bell, User } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Check for API key on mount to warn developer if missing (console only)
  useEffect(() => {
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key is missing. The AI generation features will not work. Please set REACT_APP_GEMINI_API_KEY or VITE_API_KEY depending on your setup, or manually inject it into process.env.API_KEY for this demo.");
    }
  }, []);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    // Reset selections when navigating to main tabs
    if (view !== 'company' && view !== 'job') {
      setSelectedCompany(null);
      setSelectedJob(null);
    }
    window.scrollTo(0, 0);
  };

  const handleCompanyClick = (companyName: string) => {
    const company = MOCK_COMPANIES.find(c => c.name === companyName);
    if (company) {
      setSelectedCompany(company);
      setCurrentView('company');
      window.scrollTo(0, 0);
    }
  };

  const handleJobClick = (job: Job) => {
    setSelectedJob(job);
    setCurrentView('job');
    window.scrollTo(0, 0);
  };

  const handleBackToJobs = () => {
    setSelectedCompany(null);
    setCurrentView('jobs');
  };

  const handleBackFromJob = () => {
    setSelectedJob(null);
    // If we have a selected company, go back to company profile
    if (selectedCompany) {
      setCurrentView('company');
    } else {
      // Otherwise go back to main jobs feed
      setCurrentView('jobs');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Feed />;
      case 'jobs':
        return <JobsFeed onCompanyClick={handleCompanyClick} onJobClick={handleJobClick} />;
      case 'company':
        return selectedCompany ? (
          <CompanyProfile 
            company={selectedCompany} 
            onBack={handleBackToJobs}
            onJobClick={handleJobClick}
          />
        ) : null;
      case 'job':
        return selectedJob ? (
          <JobDetail job={selectedJob} onBack={handleBackFromJob} />
        ) : null;
      case 'network':
        return <PlaceholderView title="My Network" icon={<Users />} />;
      case 'messaging':
        return <PlaceholderView title="Messaging" icon={<MessageSquare />} />;
      case 'notifications':
        return <PlaceholderView title="Notifications" icon={<Bell />} />;
      case 'profile':
        return <PlaceholderView title="My Profile" icon={<User />} />;
      default:
        return <Feed />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef] font-sans">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />
      
      <main className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar (Profile) - Hidden on mobile, visible on medium+ */}
          <div className="hidden md:block md:col-span-3 lg:col-span-3">
            <Sidebar onNavigate={handleNavigate} />
          </div>

          {/* Center Feed */}
          <div className="col-span-1 md:col-span-9 lg:col-span-6">
            {renderContent()}
          </div>

          {/* Right Sidebar (News) - Hidden on tablet, visible on large+ */}
          <div className="hidden lg:block lg:col-span-3">
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

const PlaceholderView: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center h-[500px] flex flex-col items-center justify-center">
    <div className="flex justify-center mb-6 text-semi-200 bg-semi-50 p-6 rounded-full">
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-12 h-12 text-semi-600" })}
    </div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-500 max-w-md mx-auto">
      This feature is currently under development. Check back soon for updates to the {title} section.
    </p>
    <button className="mt-6 px-6 py-2 bg-semi-600 text-white rounded-full font-medium hover:bg-semi-700 transition-colors">
      Notify me when ready
    </button>
  </div>
);

export default App;
