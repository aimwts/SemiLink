
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import JobsFeed from './components/JobsFeed';
import CompanyProfile from './components/CompanyProfile';
import JobDetail from './components/JobDetail';
import RightPanel from './components/RightPanel';
import Network from './components/Network';
import Messaging from './components/Messaging';
import Notifications from './components/Notifications';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import { MOCK_COMPANIES, CURRENT_USER, MOCK_POSTS } from './constants';
import { Company, Job, Post, User } from './types';
import { Users, MessageSquare, Bell, User as UserIcon } from 'lucide-react';

// Map specific emails to mock users for demo purposes
const MOCK_USER_MAP: Record<string, string> = {
  'sarah@semilink.com': 'u2', // Sarah Chen
  'david@semilink.com': 'u3', // David Miller
  'emily@semilink.com': 'u4', // Emily Zhang
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [currentView, setCurrentView] = useState('home');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lifted state for posts so they persist across view changes
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  // Persisted state for applied jobs
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('semilink_applied_jobs');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      console.error("Failed to load applied jobs", e);
      return new Set();
    }
  });

  // Check for API key on mount to warn developer if missing (console only)
  useEffect(() => {
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key is missing. The AI generation features will not work. Please set REACT_APP_GEMINI_API_KEY or VITE_API_KEY depending on your setup, or manually inject it into process.env.API_KEY for this demo.");
    }
  }, []);

  const handleLogin = (userData?: { name?: string; email: string }) => {
    if (userData?.name) {
      // Sign Up: Create a new user identity
      setCurrentUser({
        ...CURRENT_USER,
        id: 'new_user_' + Date.now(),
        name: userData.name,
        headline: 'Semiconductor Enthusiast', // Default headline for new users
        avatarUrl: `https://picsum.photos/150/150?random=${Date.now()}`
      });
    } else if (userData?.email) {
      // Sign In: Check if it's one of our mock users
      const mockId = MOCK_USER_MAP[userData.email.toLowerCase()];
      if (mockId) {
        // Find the user from posts (since we store user data there in this simple mock)
        const mockUser = MOCK_POSTS.find(p => p.author.id === mockId)?.author;
        if (mockUser) {
          setCurrentUser(mockUser);
        } else {
          // Fallback to Alex if mock user not found in posts
          setCurrentUser(CURRENT_USER);
        }
      } else {
        // Default Sign In (Unknown email) -> Login as Alex Silicon
        setCurrentUser(CURRENT_USER);
      }
    }
    setIsLoggedIn(true);
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSearchQuery(''); // Clear search when navigating
    // Reset selections when navigating to main tabs
    if (view !== 'company' && view !== 'job' && view !== 'user-profile') {
      setSelectedCompany(null);
      setSelectedJob(null);
      setSelectedUser(null);
    }
    window.scrollTo(0, 0);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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

  const handleUserClick = (user: User) => {
    if (user.id === currentUser.id) {
      handleNavigate('profile'); // Go to "Me" section if clicking self
      return;
    }
    setSelectedUser(user);
    setCurrentView('user-profile');
    window.scrollTo(0, 0);
  };

  const handleApplyJob = (jobId: string) => {
    const newApplied = new Set(appliedJobs);
    newApplied.add(jobId);
    setAppliedJobs(newApplied);
    try {
      localStorage.setItem('semilink_applied_jobs', JSON.stringify(Array.from(newApplied)));
    } catch (e) {
      console.error("Failed to save applied jobs", e);
    }
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

  const handleBackFromUserProfile = () => {
    setSelectedUser(null);
    setCurrentView('home');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <Feed 
            posts={posts}
            onPostCreated={handlePostCreated}
            searchQuery={searchQuery} 
            onCompanyClick={handleCompanyClick} 
            onUserClick={handleUserClick} 
            user={currentUser}
          />
        );
      case 'jobs':
        return (
          <JobsFeed 
            onCompanyClick={handleCompanyClick} 
            onJobClick={handleJobClick} 
            appliedJobs={appliedJobs}
            onApplyJob={handleApplyJob}
          />
        );
      case 'company':
        return selectedCompany ? (
          <CompanyProfile 
            key={selectedCompany.id} // Important: Force re-render when company changes
            company={selectedCompany} 
            onBack={handleBackToJobs}
            onJobClick={handleJobClick}
          />
        ) : null;
      case 'job':
        return selectedJob ? (
          <JobDetail 
            job={selectedJob} 
            onBack={handleBackFromJob} 
            isApplied={appliedJobs.has(selectedJob.id)}
            onApply={() => handleApplyJob(selectedJob.id)}
          />
        ) : null;
      case 'user-profile':
        return selectedUser ? (
          <UserProfile 
            key={selectedUser.id} // Important: Force re-render when user changes
            user={selectedUser} 
            onBack={handleBackFromUserProfile}
            onMessageClick={() => handleNavigate('messaging')}
          />
        ) : null;
      case 'network':
        return <Network />;
      case 'messaging':
        return <Messaging />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <UserProfile user={currentUser} onBack={() => handleNavigate('home')} />;
      default:
        return (
          <Feed 
            posts={posts}
            onPostCreated={handlePostCreated}
            searchQuery={searchQuery} 
            onCompanyClick={handleCompanyClick} 
            onUserClick={handleUserClick} 
            user={currentUser}
          />
        );
    }
  };

  // Determine which user to show in the sidebar
  // If we are viewing another user's profile, show that user in the sidebar
  // Otherwise, show the current logged-in user
  const sidebarUser = (currentView === 'user-profile' && selectedUser) ? selectedUser : currentUser;

  // Show Login page if not logged in
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef] font-sans">
      <Navbar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        user={currentUser}
      />
      
      <main className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Sidebar (Profile) - Hidden on mobile, visible on medium+ */}
          <div className="hidden md:block md:col-span-3 lg:col-span-3">
            <Sidebar onNavigate={handleNavigate} user={sidebarUser} />
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

export default App;
