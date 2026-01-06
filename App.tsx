import React, { useEffect, useState, useRef } from 'react';
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
import { MOCK_COMPANIES, CURRENT_USER, MOCK_POSTS, MOCK_CONVERSATIONS, MOCK_NOTIFICATIONS, MOCK_INVITATIONS, MOCK_SUGGESTIONS } from './constants';
import { Company, Job, Post, User, Conversation, Notification, Message, Experience } from './types';
import { supabase } from './lib/supabaseClient';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Map specific emails to mock users for demo purposes (Fallback)
const MOCK_USER_MAP: Record<string, string> = {
  'alex@semilink.com': 'u1',  // Alex Silicon (Default)
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
  const [shouldEditProfile, setShouldEditProfile] = useState(false);
  
  // --- Persistent State ---

  // User Database (Simulates a backend User table)
  const [usersDb, setUsersDb] = useState<Record<string, User>>(() => {
    try {
      const saved = localStorage.getItem('semilink_users_db');
      if (saved) {
        const db = JSON.parse(saved);
        // Robustness: Ensure all loaded users have an experience array
        Object.keys(db).forEach(key => {
            if (!db[key].experience) db[key].experience = [];
        });
        return db;
      }
    } catch (e) {
      console.error("Failed to load user db", e);
    }

    const db: Record<string, User> = {};
    db[CURRENT_USER.id] = CURRENT_USER;
    MOCK_POSTS.forEach(p => { db[p.author.id] = p.author; });
    return db;
  });

  // Other persistent states
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const savedPosts = localStorage.getItem('semilink_posts');
      return savedPosts ? JSON.parse(savedPosts) : MOCK_POSTS;
    } catch (e) { return MOCK_POSTS; }
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
      try {
          const saved = localStorage.getItem('semilink_conversations');
          return saved ? JSON.parse(saved) : MOCK_CONVERSATIONS;
      } catch(e) { return MOCK_CONVERSATIONS; }
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
      try {
          const saved = localStorage.getItem('semilink_notifications');
          return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
      } catch(e) { return MOCK_NOTIFICATIONS; }
  });

  const [invitations, setInvitations] = useState<User[]>(() => {
      try {
          const saved = localStorage.getItem('semilink_invitations');
          return saved ? JSON.parse(saved) : MOCK_INVITATIONS;
      } catch(e) { return MOCK_INVITATIONS; }
  });

  const [connectedIds, setConnectedIds] = useState<Set<string>>(() => {
      try {
          const saved = localStorage.getItem('semilink_connections');
          return saved ? new Set(JSON.parse(saved)) : new Set();
      } catch(e) { return new Set(); }
  });

  const [savedJobs, setSavedJobs] = useState<Set<string>>(() => {
      try {
          const saved = localStorage.getItem('semilink_saved_jobs');
          return saved ? new Set(JSON.parse(saved)) : new Set();
      } catch(e) { return new Set(); }
  });

  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('semilink_applied_jobs');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) { return new Set(); }
  });


  // --- Persistence Effects ---
  useEffect(() => localStorage.setItem('semilink_users_db', JSON.stringify(usersDb)), [usersDb]);
  useEffect(() => localStorage.setItem('semilink_posts', JSON.stringify(posts)), [posts]);
  useEffect(() => localStorage.setItem('semilink_conversations', JSON.stringify(conversations)), [conversations]);
  useEffect(() => localStorage.setItem('semilink_notifications', JSON.stringify(notifications)), [notifications]);
  useEffect(() => localStorage.setItem('semilink_invitations', JSON.stringify(invitations)), [invitations]);
  useEffect(() => localStorage.setItem('semilink_connections', JSON.stringify(Array.from(connectedIds))), [connectedIds]);
  useEffect(() => localStorage.setItem('semilink_saved_jobs', JSON.stringify(Array.from(savedJobs))), [savedJobs]);
  useEffect(() => localStorage.setItem('semilink_applied_jobs', JSON.stringify(Array.from(appliedJobs))), [appliedJobs]);


  // Check for API key and Supabase Session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        fetchProfile(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true);
        fetchProfile(session.user);
      } else {
        setIsLoggedIn(false);
        setCurrentUser(CURRENT_USER);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (sbUser: SupabaseUser) => {
    try {
      // 1. Fetch Source of Truth from Supabase
      let { data: sbProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .single();

      // Create profile if it doesn't exist
      if (!sbProfile) {
        const newProfile = {
            id: sbUser.id,
            email: sbUser.email,
            name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'User',
            avatar_url: sbUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(sbUser.email?.split('@')[0] || 'User')}`,
            headline: 'Semiconductor Professional',
            connections: 0,
            location: '',
            about: '',
            experience: []
        };
        const { error: insertError } = await supabase.from('profiles').insert(newProfile);
        if (!insertError) sbProfile = newProfile;
      }

      // 2. Fetch Local Cache for Merging
      let savedDb: Record<string, User> = {};
      try {
          const savedDbStr = localStorage.getItem('semilink_users_db');
          if (savedDbStr) savedDb = JSON.parse(savedDbStr);
      } catch(e) {}

      let localUser = savedDb[sbUser.id];
      if (!localUser && sbUser.email) {
          const foundKey = Object.keys(savedDb).find(key => 
             savedDb[key].email?.toLowerCase() === sbUser.email?.toLowerCase()
          );
          if (foundKey) localUser = savedDb[foundKey];
      }

      if (sbProfile) {
        // 3. Robust Experience Merging
        // Priority: Supabase > Local Cache > Empty
        let experienceToUse: Experience[] = [];
        
        if (Array.isArray(sbProfile.experience) && sbProfile.experience.length > 0) {
            experienceToUse = sbProfile.experience;
        } else if (localUser && Array.isArray(localUser.experience) && localUser.experience.length > 0) {
            experienceToUse = localUser.experience;
            // Sync local-only experience back to cloud
            supabase.from('profiles').update({ experience: experienceToUse }).eq('id', sbUser.id).then(({ error }) => {
                if (!error) console.log("Experience synced to cloud successfully");
            });
        }

        const dbUser: User = {
          id: sbProfile.id,
          email: sbProfile.email || sbUser.email,
          name: sbProfile.name || localUser?.name || 'User',
          headline: sbProfile.headline || localUser?.headline || 'Semiconductor Professional',
          avatarUrl: sbProfile.avatar_url || localUser?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(sbProfile.name || 'User')}`,
          location: sbProfile.location || localUser?.location || '',
          about: sbProfile.about || localUser?.about || '',
          backgroundImageUrl: sbProfile.background_image_url || localUser?.backgroundImageUrl || 'https://picsum.photos/800/200?random=101',
          connections: sbProfile.connections ?? localUser?.connections ?? 0,
          experience: experienceToUse
        };
        
        // Update local database
        setUsersDb(prev => ({ ...prev, [dbUser.id]: dbUser }));
        setCurrentUser(dbUser);

        // Redirect to profile if profile is incomplete
        if (!dbUser.location || !dbUser.about || dbUser.experience.length === 0) {
            setShouldEditProfile(true);
            setCurrentView('profile');
        }
      }
    } catch (err) {
      console.error("Critical error in fetchProfile:", err);
    }
  };

  const handleUpdateProfile = async (updatedUser: User) => {
    // 1. Update State immediately for responsiveness
    setCurrentUser(updatedUser);
    setUsersDb(prev => ({ ...prev, [updatedUser.id]: updatedUser }));
    setShouldEditProfile(false);
    
    // 2. Persist to Supabase if logged in
    const hasSupabase = ((import.meta as any).env?.VITE_SUPABASE_URL) || (process.env.VITE_SUPABASE_URL);
    if (hasSupabase && isLoggedIn) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            name: updatedUser.name,
            headline: updatedUser.headline,
            location: updatedUser.location,
            about: updatedUser.about,
            avatar_url: updatedUser.avatarUrl,
            background_image_url: updatedUser.backgroundImageUrl,
            experience: updatedUser.experience, // Critical: Ensure experience array is saved
            connections: updatedUser.connections
          })
          .eq('id', updatedUser.id);
          
        if (error) throw error;
      } catch (e) {
        console.error("Failed to sync profile to cloud database:", e);
      }
    }
  };

  // --- Login/Logout handlers ---
  const handleMockLogin = (userData?: { name?: string; email: string }) => {
    if (userData?.name) {
      const newId = 'user_' + Date.now();
      const newMockUser = {
        id: newId,
        name: userData.name,
        email: userData.email,
        headline: 'Semiconductor Professional', 
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0ea5e9&color=fff`,
        connections: 0,
        experience: []
      };
      setUsersDb(prev => ({...prev, [newId]: newMockUser}));
      setCurrentUser(newMockUser);
      setShouldEditProfile(true);
      setCurrentView('profile');
    } else if (userData?.email) {
      const email = userData.email.toLowerCase();
      const mockId = MOCK_USER_MAP[email];
      const loadedUser = (mockId && usersDb[mockId]) ? usersDb[mockId] : Object.values(usersDb).find(u => u.email === email);
      
      if (loadedUser) setCurrentUser(loadedUser);
      else if (mockId) setCurrentUser(MOCK_POSTS.find(p => p.author.id === mockId)?.author || CURRENT_USER);
      
      setCurrentView('home');
    }
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    const hasSupabase = ((import.meta as any).env?.VITE_SUPABASE_URL) || (process.env.VITE_SUPABASE_URL);
    if (hasSupabase) await supabase.auth.signOut();
    setIsLoggedIn(false);
    setCurrentUser(CURRENT_USER);
    setCurrentView('home');
    setSearchQuery('');
  };

  // --- Remaining Action Handlers (Posts, Network, etc) ---
  const handlePostCreated = (newPost: Post) => setPosts([newPost, ...posts]);
  const handlePostLike = (postId: string) => {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.isLikedByCurrentUser ? p.likes - 1 : p.likes + 1, isLikedByCurrentUser: !p.isLikedByCurrentUser } : p));
  };
  const handleSendMessage = (conversationId: string, content: string) => {
    const newMessage = { id: Date.now().toString(), senderId: 'me', content, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isRead: true };
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: [...c.messages, newMessage], lastMessageTimestamp: 'Just now' } : c));
  };
  const handleMarkNotificationRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  const handleDeleteNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const handleConnectUser = (userId: string) => setConnectedIds(prev => new Set(prev).add(userId));
  const handleAcceptInvitation = (userId: string) => {
      setInvitations(prev => prev.filter(inv => inv.id !== userId));
      setConnectedIds(prev => new Set(prev).add(userId));
      handleUpdateProfile({ ...currentUser, connections: currentUser.connections + 1 });
  };
  const handleIgnoreInvitation = (userId: string) => setInvitations(prev => prev.filter(inv => inv.id !== userId));
  const handleToggleSaveJob = (jobId: string) => setSavedJobs(prev => { const n = new Set(prev); n.has(jobId) ? n.delete(jobId) : n.add(jobId); return n; });
  const handleApplyJob = (jobId: string) => setAppliedJobs(prev => new Set(prev).add(jobId));

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSearchQuery('');
    if (view !== 'profile') setShouldEditProfile(false);
    if (!['company', 'job', 'user-profile'].includes(view)) { setSelectedCompany(null); setSelectedJob(null); setSelectedUser(null); }
    window.scrollTo(0, 0);
  };

  const handleCompanyClick = (name: string) => {
    const c = MOCK_COMPANIES.find(c => c.name === name);
    if (c) { setSelectedCompany(c); setCurrentView('company'); window.scrollTo(0, 0); }
  };

  const handleJobClick = (job: Job) => { setSelectedJob(job); setCurrentView('job'); window.scrollTo(0, 0); };
  const handleUserClick = (u: User) => {
    if (u.id === currentUser.id) handleNavigate('profile');
    else { setSelectedUser(u); setCurrentView('user-profile'); window.scrollTo(0, 0); }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home': return <Feed posts={posts} onPostCreated={handlePostCreated} onPostLike={handlePostLike} searchQuery={searchQuery} onCompanyClick={handleCompanyClick} onUserClick={handleUserClick} user={currentUser} />;
      case 'jobs': return <JobsFeed onCompanyClick={handleCompanyClick} onJobClick={handleJobClick} appliedJobs={appliedJobs} savedJobs={savedJobs} onApplyJob={handleApplyJob} onToggleSaveJob={handleToggleSaveJob} />;
      case 'company': return selectedCompany ? <CompanyProfile company={selectedCompany} onBack={() => handleNavigate('jobs')} onJobClick={handleJobClick} savedJobs={savedJobs} onToggleSaveJob={handleToggleSaveJob} /> : null;
      case 'job': return selectedJob ? <JobDetail job={selectedJob} onBack={() => handleNavigate('jobs')} isApplied={appliedJobs.has(selectedJob.id)} isSaved={savedJobs.has(selectedJob.id)} onApply={() => handleApplyJob(selectedJob.id)} onToggleSave={() => handleToggleSaveJob(selectedJob.id)} /> : null;
      case 'user-profile': return selectedUser ? <UserProfile user={selectedUser} onBack={() => handleNavigate('home')} onMessageClick={() => handleNavigate('messaging')} isConnected={connectedIds.has(selectedUser.id)} onConnect={() => handleConnectUser(selectedUser.id)} onPostLike={handlePostLike} userPosts={posts.filter(p => p.author.id === selectedUser.id)} /> : null;
      case 'network': return <Network invitations={invitations} connectedIds={connectedIds} suggestions={MOCK_SUGGESTIONS} onAccept={handleAcceptInvitation} onIgnore={handleIgnoreInvitation} onConnect={handleConnectUser} />;
      case 'messaging': return <Messaging conversations={conversations} onSendMessage={handleSendMessage} />;
      case 'notifications': return <Notifications notifications={notifications} onMarkRead={handleMarkNotificationRead} onDelete={handleDeleteNotification} />;
      case 'profile': return <UserProfile user={currentUser} onBack={() => handleNavigate('home')} onUpdateProfile={handleUpdateProfile} initialEdit={shouldEditProfile} onPostLike={handlePostLike} userPosts={posts.filter(p => p.author.id === currentUser.id)} />;
      default: return <Feed posts={posts} onPostCreated={handlePostCreated} onPostLike={handlePostLike} searchQuery={searchQuery} onCompanyClick={handleCompanyClick} onUserClick={handleUserClick} user={currentUser} />;
    }
  };

  if (!isLoggedIn) return <Login onLogin={handleMockLogin} />;

  const sidebarUser = (currentView === 'user-profile' && selectedUser) ? selectedUser : currentUser;

  return (
    <div className="min-h-screen bg-[#f3f2ef] font-sans">
      <Navbar currentView={currentView} onNavigate={handleNavigate} onSearch={setSearchQuery} searchQuery={searchQuery} user={currentUser} onLogout={handleLogout} />
      <main className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="hidden md:block md:col-span-3 lg:col-span-3">
            <Sidebar onNavigate={handleNavigate} user={sidebarUser} isMe={sidebarUser.id === currentUser.id} onAvatarChange={(url) => handleUpdateProfile({ ...currentUser, avatarUrl: url })} />
          </div>
          <div className="col-span-1 md:col-span-9 lg:col-span-6">{renderContent()}</div>
          <div className="hidden lg:block lg:col-span-3"><RightPanel /></div>
        </div>
      </main>
    </div>
  );
};

export default App;