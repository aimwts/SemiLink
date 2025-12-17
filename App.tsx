
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
        // Robustness: Ensure all loaded users have an experience array (handles older saved data)
        Object.keys(db).forEach(key => {
            if (!db[key].experience) db[key].experience = [];
        });
        return db;
      }
    } catch (e) {
      console.error("Failed to load user db", e);
    }

    // Initialize with constants if no save found
    const db: Record<string, User> = {};
    db[CURRENT_USER.id] = CURRENT_USER;
    MOCK_POSTS.forEach(p => { db[p.author.id] = p.author; });
    return db;
  });

  // Posts
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const savedPosts = localStorage.getItem('semilink_posts');
      return savedPosts ? JSON.parse(savedPosts) : MOCK_POSTS;
    } catch (e) {
      console.error("Failed to load posts", e);
      return MOCK_POSTS;
    }
  });

  // Conversations
  const [conversations, setConversations] = useState<Conversation[]>(() => {
      try {
          const saved = localStorage.getItem('semilink_conversations');
          return saved ? JSON.parse(saved) : MOCK_CONVERSATIONS;
      } catch(e) { return MOCK_CONVERSATIONS; }
  });

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(() => {
      try {
          const saved = localStorage.getItem('semilink_notifications');
          return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
      } catch(e) { return MOCK_NOTIFICATIONS; }
  });

  // Network: Invitations
  const [invitations, setInvitations] = useState<User[]>(() => {
      try {
          const saved = localStorage.getItem('semilink_invitations');
          return saved ? JSON.parse(saved) : MOCK_INVITATIONS;
      } catch(e) { return MOCK_INVITATIONS; }
  });

  // Network: Connected User IDs
  const [connectedIds, setConnectedIds] = useState<Set<string>>(() => {
      try {
          const saved = localStorage.getItem('semilink_connections');
          return saved ? new Set(JSON.parse(saved)) : new Set();
      } catch(e) { return new Set(); }
  });

  // Jobs: Saved
  const [savedJobs, setSavedJobs] = useState<Set<string>>(() => {
      try {
          const saved = localStorage.getItem('semilink_saved_jobs');
          return saved ? new Set(JSON.parse(saved)) : new Set();
      } catch(e) { return new Set(); }
  });

  // Jobs: Applied
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('semilink_applied_jobs');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      console.error("Failed to load applied jobs", e);
      return new Set();
    }
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
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key is missing. The AI generation features will not work.");
    }

    // SUPABASE: Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsLoggedIn(true);
        fetchProfile(session.user);
      }
    });

    // SUPABASE: Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
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
      // 1. Fetch Identity AND Experience from Supabase (Source of Truth for Auth/Basic Info)
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .single();

      // If profile doesn't exist, create it manually
      if (!data) {
        const newProfile = {
            id: sbUser.id,
            email: sbUser.email,
            name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'User',
            avatar_url: sbUser.user_metadata?.avatar_url,
            headline: 'Semiconductor Professional',
            connections: 0,
            location: '',
            about: '',
            experience: []
        };
        const { error: insertError } = await supabase.from('profiles').insert(newProfile);
        if (!insertError) data = newProfile;
      }

      // 2. Fetch Extended Data from LocalStorage (Fallback for Experience)
      let savedDb: Record<string, User> = {};
      try {
          const savedDbStr = localStorage.getItem('semilink_users_db');
          if (savedDbStr) savedDb = JSON.parse(savedDbStr);
      } catch(e) { console.warn("Local DB load failed", e); }

      // 3. Resolve "Local User"
      let localUser = savedDb[sbUser.id];
      
      // Migration: Email match check
      if (!localUser && sbUser.email) {
          const foundKey = Object.keys(savedDb).find(key => 
             savedDb[key].email?.toLowerCase() === sbUser.email?.toLowerCase()
          );
          if (foundKey) {
             localUser = savedDb[foundKey];
          }
      }

      if (data) {
        // 4. Resolve Experience Data
        let experienceToUse: Experience[] = [];

        if (data.experience && Array.isArray(data.experience)) {
            experienceToUse = data.experience;
        } else if (localUser && Array.isArray(localUser.experience) && localUser.experience.length > 0) {
            experienceToUse = localUser.experience;
            
            // Auto-sync local experience UP to Supabase if Supabase was missing/null
            supabase.from('profiles').update({ experience: experienceToUse }).eq('id', sbUser.id).then(({ error }) => {
                if (error) console.warn("Failed to sync local experience to Supabase:", error.message);
                else console.log("Synced local experience to Supabase");
            });
        }

        const defaultUser = {
          id: sbUser.id,
          name: 'User',
          headline: 'Semiconductor Professional',
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}`,
          connections: 0,
          location: '',
          about: '',
          backgroundImageUrl: 'https://picsum.photos/800/200?random=101',
          experience: []
        };

        const dbUser: User = {
          ...defaultUser,
          ...(localUser || {}),
          id: data.id, 
          email: data.email,
          name: data.name || localUser?.name || 'User',
          headline: data.headline || localUser?.headline || 'Semiconductor Professional',
          avatarUrl: data.avatar_url || localUser?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}`,
          location: data.location || localUser?.location || '',
          about: data.about || localUser?.about || '',
          backgroundImageUrl: data.background_image_url || localUser?.backgroundImageUrl || 'https://picsum.photos/800/200?random=101',
          experience: experienceToUse
        };
        
        setUsersDb(prev => {
            const next = { ...prev, [dbUser.id]: dbUser };
            localStorage.setItem('semilink_users_db', JSON.stringify(next));
            return next;
        });

        setCurrentUser(dbUser);

        // Check onboarding
        if (!dbUser.location || !dbUser.about) {
            setShouldEditProfile(true);
            setCurrentView('profile');
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleMockLogin = (userData?: { name?: string; email: string }) => {
    if (userData?.name) {
      // Sign Up Mock
      const newId = 'new_user_' + Date.now();
      const newMockUser = {
        id: newId,
        name: userData.name,
        email: userData.email,
        headline: 'Semiconductor Professional', 
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=0ea5e9&color=fff`,
        connections: 0,
        mutualConnections: 0,
        location: '',
        about: '',
        backgroundImageUrl: 'https://picsum.photos/800/200?random=101',
        experience: []
      };
      
      setUsersDb(prev => {
         const next = {...prev, [newId]: newMockUser};
         localStorage.setItem('semilink_users_db', JSON.stringify(next));
         return next;
      });
      
      setCurrentUser(newMockUser);
      setShouldEditProfile(true);
      setCurrentView('profile');
    } else if (userData?.email) {
      const email = userData.email.toLowerCase();
      const mockId = MOCK_USER_MAP[email];
      
      let loadedUser: User | null = null;
      
      if (mockId && usersDb[mockId]) {
         loadedUser = usersDb[mockId];
      } else {
         const found = Object.values(usersDb).find(u => u.email === email);
         if (found) loadedUser = found;
      }

      if (loadedUser) {
          setCurrentUser(loadedUser);
      } else {
          if (mockId) {
             const mockUser = MOCK_POSTS.find(p => p.author.id === mockId)?.author;
             if (mockUser) setCurrentUser(mockUser);
             else setCurrentUser(CURRENT_USER);
          } else {
             setCurrentUser(CURRENT_USER);
          }
      }
      setCurrentView('home');
    }
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    const hasSupabase = ((import.meta as any).env?.VITE_SUPABASE_URL) || (process.env.VITE_SUPABASE_URL);
    if (hasSupabase) {
      await supabase.auth.signOut();
    }
    setIsLoggedIn(false);
    setCurrentUser(CURRENT_USER);
    setCurrentView('home');
    setSearchQuery('');
    setShouldEditProfile(false);
  };

  const handleUpdateProfile = async (updatedUser: User) => {
    setCurrentUser(updatedUser);
    
    setUsersDb(prev => {
        const next = { ...prev, [updatedUser.id]: updatedUser };
        localStorage.setItem('semilink_users_db', JSON.stringify(next));
        return next;
    });
    
    setShouldEditProfile(false);
    
    const hasSupabase = ((import.meta as any).env?.VITE_SUPABASE_URL) || (process.env.VITE_SUPABASE_URL);
    
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
            background_image_url: updatedUser.backgroundImageUrl,
            experience: updatedUser.experience
          })
          .eq('id', updatedUser.id);
          
        if (error) console.error("Failed to update profile in DB:", error);
      } catch (e) {
        console.error("Failed to update profile in DB:", e);
      }
    }
  };

  // --- Actions Handlers ---

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostLike = (postId: string) => {
      setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
              const isLiked = !!post.isLikedByCurrentUser;
              return {
                  ...post,
                  likes: isLiked ? post.likes - 1 : post.likes + 1,
                  isLikedByCurrentUser: !isLiked
              };
          }
          return post;
      }));
  };

  const handleSendMessage = (conversationId: string, content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      content: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessageTimestamp: 'Just now'
        };
      }
      return conv;
    }));
  };

  const handleMarkNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleDeleteNotification = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleConnectUser = (userId: string) => {
      setConnectedIds(prev => {
          const newSet = new Set(prev);
          newSet.add(userId);
          return newSet;
      });
  };

  const handleAcceptInvitation = (userId: string) => {
      setInvitations(prev => prev.filter(inv => inv.id !== userId));
      setConnectedIds(prev => {
          const newSet = new Set(prev);
          newSet.add(userId);
          return newSet;
      });
      
      const updatedUser = {
          ...currentUser,
          connections: currentUser.connections + 1
      };
      handleUpdateProfile(updatedUser);
  };

  const handleIgnoreInvitation = (userId: string) => {
      setInvitations(prev => prev.filter(inv => inv.id !== userId));
  };

  const handleToggleSaveJob = (jobId: string) => {
      setSavedJobs(prev => {
          const newSet = new Set(prev);
          if (newSet.has(jobId)) newSet.delete(jobId);
          else newSet.add(jobId);
          return newSet;
      });
  };

  const handleApplyJob = (jobId: string) => {
    setAppliedJobs(prev => {
        const newSet = new Set(prev);
        newSet.add(jobId);
        return newSet;
    });
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setSearchQuery('');
    if (view !== 'profile') {
        setShouldEditProfile(false);
    }
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
            onPostLike={handlePostLike}
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
            savedJobs={savedJobs}
            onApplyJob={handleApplyJob}
            onToggleSaveJob={handleToggleSaveJob}
          />
        );
      case 'company':
        return selectedCompany ? (
          <CompanyProfile 
            key={selectedCompany.id}
            company={selectedCompany} 
            onBack={handleBackToJobs}
            onJobClick={handleJobClick}
            savedJobs={savedJobs}
            onToggleSaveJob={handleToggleSaveJob}
          />
        ) : null;
      case 'job':
        return selectedJob ? (
          <JobDetail 
            job={selectedJob} 
            onBack={handleBackFromJob} 
            isApplied={appliedJobs.has(selectedJob.id)}
            isSaved={savedJobs.has(selectedJob.id)}
            onApply={() => handleApplyJob(selectedJob.id)}
            onToggleSave={() => handleToggleSaveJob(selectedJob.id)}
          />
        ) : null;
      case 'user-profile':
        return selectedUser ? (
          <UserProfile 
            key={selectedUser.id}
            user={selectedUser} 
            onBack={handleBackFromUserProfile}
            onMessageClick={() => handleNavigate('messaging')}
            isConnected={connectedIds.has(selectedUser.id)}
            onConnect={() => handleConnectUser(selectedUser.id)}
            onPostLike={handlePostLike}
            userPosts={posts.filter(p => p.author.id === selectedUser.id)}
          />
        ) : null;
      case 'network':
        return (
            <Network 
                invitations={invitations}
                connectedIds={connectedIds}
                suggestions={MOCK_SUGGESTIONS}
                onAccept={handleAcceptInvitation}
                onIgnore={handleIgnoreInvitation}
                onConnect={handleConnectUser}
            />
        );
      case 'messaging':
        return (
            <Messaging 
                conversations={conversations}
                onSendMessage={handleSendMessage}
            />
        );
      case 'notifications':
        return (
            <Notifications 
                notifications={notifications}
                onMarkRead={handleMarkNotificationRead}
                onDelete={handleDeleteNotification}
            />
        );
      case 'profile':
        return (
          <UserProfile 
            user={currentUser} 
            onBack={() => handleNavigate('home')} 
            onUpdateProfile={handleUpdateProfile}
            initialEdit={shouldEditProfile}
            onPostLike={handlePostLike}
            userPosts={posts.filter(p => p.author.id === currentUser.id)}
          />
        );
      default:
        return (
          <Feed 
            posts={posts}
            onPostCreated={handlePostCreated}
            onPostLike={handlePostLike}
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
            <Sidebar 
              onNavigate={handleNavigate} 
              user={sidebarUser} 
              isMe={sidebarUser.id === currentUser.id} 
            />
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
