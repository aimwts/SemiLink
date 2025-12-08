
import React, { useState } from 'react';
import { UserPlus, X, Users, Briefcase } from 'lucide-react';
import { MOCK_INVITATIONS, MOCK_SUGGESTIONS } from '../constants';

const Network: React.FC = () => {
  const [invitations, setInvitations] = useState(MOCK_INVITATIONS);
  const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set());

  const handleAccept = (id: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== id));
    // In a real app, this would add the user to connections
  };

  const handleIgnore = (id: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  const handleConnect = (id: string) => {
    setConnectedIds(prev => new Set(prev).add(id));
  };

  return (
    <div className="space-y-4">
      {/* Invitations Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-base font-semibold text-gray-900">Invitations</h2>
          <button className="text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-2 py-1 rounded">
            Manage
          </button>
        </div>
        
        {invitations.length > 0 ? (
          <div>
            {invitations.map((inv) => (
              <div key={inv.id} className="p-4 border-b border-gray-100 last:border-0 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <img 
                    src={inv.avatarUrl} 
                    alt={inv.name} 
                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">{inv.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{inv.headline}</p>
                    {inv.mutualConnections && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {inv.mutualConnections} mutual connections
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleIgnore(inv.id)}
                    className="px-4 py-1.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-full transition-colors"
                  >
                    Ignore
                  </button>
                  <button 
                    onClick={() => handleAccept(inv.id)}
                    className="px-4 py-1.5 text-blue-600 border border-blue-600 font-semibold hover:bg-blue-50 rounded-full transition-colors"
                  >
                    Accept
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No pending invitations.</p>
          </div>
        )}
      </div>

      {/* Suggestions Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-base font-semibold text-gray-900">People you may know in Semiconductor Industry</h2>
           <button className="text-sm font-semibold text-gray-500 hover:text-gray-700">See all</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((user) => (
            <div key={user.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col items-center pb-4 hover:shadow-md transition-shadow">
              {/* Card Banner */}
              <div className="h-16 w-full bg-gradient-to-r from-gray-200 to-gray-300 relative">
                 <button className="absolute top-2 right-2 text-gray-500 hover:bg-black/10 p-1 rounded-full">
                    <X className="w-4 h-4" />
                 </button>
              </div>
              
              {/* Avatar */}
              <div className="-mt-10 mb-2">
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-white cursor-pointer"
                />
              </div>
              
              {/* Info */}
              <div className="text-center px-4 mb-4 flex-1">
                <h3 className="font-semibold text-gray-900 text-sm hover:underline cursor-pointer line-clamp-1">{user.name}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 min-h-[2.5em]">{user.headline}</p>
                {user.mutualConnections ? (
                   <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" /> {user.mutualConnections} mutual connections
                   </p>
                ) : (
                    <p className="text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
                        <Briefcase className="w-3 h-3" /> Based on your profile
                    </p>
                )}
              </div>
              
              {/* Action */}
              <div className="px-4 w-full">
                <button 
                  onClick={() => handleConnect(user.id)}
                  disabled={connectedIds.has(user.id)}
                  className={`w-full py-1.5 rounded-full font-semibold border flex items-center justify-center gap-1 transition-colors ${
                      connectedIds.has(user.id)
                      ? 'bg-white text-gray-500 border-gray-300 cursor-default'
                      : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {connectedIds.has(user.id) ? 'Pending' : <><UserPlus className="w-4 h-4" /> Connect</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Network;
