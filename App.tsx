/// <reference types="vite/client" />
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
import { supabase } from './lib/supabaseClient';

// Map specific emails to mock users for demo purposes (Fallback)
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

  // Check for API key and Supabase Session on mount
  useEffect(() => {
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key is missing. The AI generation features will not work.");
    }

    // SUPABASE: Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        fetchProfile(session.user.id);
      }
    });

    // SUPABASE: Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        fetchProfile(session.user.id);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(CURRENT_USER); // Reset to default
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // 1. Try to fetch from 'profiles' table in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        // Map database columns to our User interface
        const dbUser: User = {
          id: data.id,
          name: data.name || 'User',
          email: data.email,
          headline: data.headline || 'Semiconductor Professional',
          avatarUrl: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}`,
          connections: data.connections || 0,
          location: data.location || '',
          about: data.about || '',
          backgroundImageUrl: data.background_image_url || 'https://picsum.photos/800/200?random=101',
          experience: [] // TODO: Fetch experience from a separate table
        };
        setCurrentUser(dbUser);
      } else {
        // If profile doesn't exist yet (or error), we might need to handle it or fallback
        console.log("No profile found in DB, using auth metadata or defaults");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Keep the Mock Login handler for fallback if no Supabase keys are present
  const handleMockLogin = (userData?: { name?: string; email: string }) => {
    if (userData?.name) {
      // Sign Up Mock
      setCurrentUser({
        id: 'new_user_' + Date.now(),
        name: userData.name,
        headline: 'Semiconductor Professional', 
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0ea5e9&color=fff`,
        connections: 0,
        mutualConnections: 0,
        location: 'Earth',
        about: '',
        backgroundImageUrl: 'https://picsum.photos/800/200?random=101',
        experience: []
      });
    } else if (userData?.email) {
      // Sign In Mock
      const mockId = MOCK_USER_MAP[userData.email.toLowerCase()];
      if (mockId) {
        const mockUser = MOCK_POSTS.find(p => p.author.id === mockId)?.author;
        if (mockUser) {
          setCurrentUser(mockUser);
        } else {
          setCurrentUser(CURRENT_USER);
        }
      } else {
        setCurrentUser(CURRENT_USER);
      }
    }
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleLogout = async () => {
    // Check if we are using supabase
    const hasSupabase = (import.meta.env?.VITE_SUPABASE_URL) || (process.env.VITE_SUPABASE_URL);
    if (hasSupabase) {
      await supabase.auth.signOut();
    }
    setIsLoggedIn(false);
    setCurrentUser(CURRENT_USER);
    setCurrentView('home');
    setSearchQuery('');
  };

  const handleUpdateProfile = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    
    // Save to Supabase if logged in with it
    const hasSupabase = (import.meta.env?.VITE_SUPABASE_URL) || (process.env.VITE_SUPABASE_URL);
    if (hasSupabase) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: updatedUser.name,
            headline: updatedUser.headline,
            location: updatedUser.location,
            about: updatedUser.about,
            avatar_url: updatedUser.avatarUrl,
            background_image_url: updatedUser.backgroundImageUrl
          })
          .eq('id', updatedUser.id);
          
        if (error) throw error;
      } catch (e) {
        console.error("Failed to update profile in DB:", e);
      }
    }
  };

  const handlePostCreated = async (newPost: Post) => {
    setPosts([newPost, ...posts]);

    // Save to Supabase if possible
    const hasSupabase = (import.meta.env?.VITE_SUPABASE_URL) || (process.env.VITE_SUPABASE_URL);
    if (hasSupabase) {
        try {
            const { error } = await supabase.from('posts').insert({
                author_id: currentUser.id,
                content: newPost.content,
                image_url: newPost.imageUrl,
                tags: newPost.tags
            });
            if (error) console.error("Error saving post to DB:", error);
        } catch (e) {
            console.error("Supabase post error", e);
        }
    }
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSearchQuery('');
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
      handleNavigate('profile');
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
    if (selectedCompany) {
      setCurrentView('company');
    } else {
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
            key={selectedCompany.id}
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
            key={selectedUser.id}
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
        return (
          <UserProfile 
            user={currentUser} 
            onBack={() => handleNavigate('home')} 
            onUpdateProfile={handleUpdateProfile}
          />
        );
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

  const sidebarUser = (currentView === 'user-profile' && selectedUser) ? selectedUser : currentUser;

  if (!isLoggedIn) {
    return <Login onLogin={handleMockLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#f3f2ef] font-sans">
      <Navbar 
        currentView={currentView} 
        onNavigate={handleNavigate} 
        onSearch={handleSearch}
        searchQuery={searchQuery}
        user={currentUser}
        onLogout={handleLogout}
      />
      
      <main className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="hidden md:block md:col-span-3 lg:col-span-3">
            <Sidebar onNavigate={handleNavigate} user={sidebarUser} />
          </div>

          <div className="col-span-1 md:col-span-9 lg:col-span-6">
            {renderContent()}
          </div>

          <div className="hidden lg:block lg:col-span-3">
            <RightPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;