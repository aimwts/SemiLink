
import React, { useState } from 'react';
import { Heart, MessageSquare, UserPlus, Briefcase, Eye, AtSign, MoreHorizontal, Filter } from 'lucide-react';
import { Notification, NotificationType } from '../types';

interface NotificationsProps {
    notifications: Notification[];
    onMarkRead: (id: string) => void;
    onDelete: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, onMarkRead, onDelete }) => {
  const [filter, setFilter] = useState<'All' | 'My posts' | 'Mentions' | 'Jobs'>('All');

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-red-500 fill-current" />;
      case 'comment': return <MessageSquare className="w-5 h-5 text-blue-500 fill-current" />;
      case 'connection': return <UserPlus className="w-5 h-5 text-blue-600" />;
      case 'job': return <Briefcase className="w-5 h-5 text-purple-600" />;
      case 'view': return <Eye className="w-5 h-5 text-gray-600" />;
      case 'mention': return <AtSign className="w-5 h-5 text-green-600" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'My posts') return n.type === 'like' || n.type === 'comment';
    if (filter === 'Mentions') return n.type === 'mention';
    if (filter === 'Jobs') return n.type === 'job';
    return true;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Filters Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {['All', 'My posts', 'Mentions', 'Jobs'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
              filter === f 
                ? 'bg-green-700 text-white' 
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => onMarkRead(notif.id)}
              className={`flex items-start gap-4 p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors relative ${
                !notif.isRead ? 'bg-blue-50/40' : 'bg-white'
              }`}
            >
              {/* Icon Status */}
              <div className="mt-1 flex-shrink-0">
                 {getIcon(notif.type)}
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0 relative">
                <img 
                  src={notif.actor.avatarUrl} 
                  alt={notif.actor.name} 
                  className={`w-12 h-12 rounded-full object-cover border border-gray-200 ${notif.actor.type === 'company' ? 'bg-white p-0.5' : ''}`}
                />
              </div>

              {/* Content */}
              <div className="flex-1 pr-8">
                <p className="text-sm text-gray-900 leading-snug">
                  <span className="font-bold">{notif.actor.name}</span>{' '}
                  {notif.content}
                  {notif.targetContext && (
                    <span className="font-semibold text-gray-800"> {notif.targetContext}</span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                
                {notif.type === 'connection' && (
                  <div className="mt-2 flex gap-2">
                    <button className="px-4 py-1 text-blue-600 border border-blue-600 rounded-full text-sm font-semibold hover:bg-blue-50">
                      Message
                    </button>
                  </div>
                )}
                 {notif.type === 'job' && (
                  <div className="mt-2">
                    <button className="px-4 py-1 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700">
                      View Job
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col items-center gap-1">
                 <p className="text-xs text-gray-400 whitespace-nowrap">{notif.timestamp}</p>
                 <div className="group relative">
                   <button className="p-1 hover:bg-gray-200 rounded-full text-gray-500">
                     <MoreHorizontal className="w-5 h-5" />
                   </button>
                   {/* Simple Dropdown Simulator */}
                   <div className="hidden group-hover:block absolute right-0 top-full bg-white shadow-lg border border-gray-100 rounded-md py-1 w-32 z-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(notif.id); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Turn off
                      </button>
                   </div>
                 </div>
                 {!notif.isRead && (
                   <div className="w-3 h-3 bg-blue-600 rounded-full mt-2"></div>
                 )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-gray-500">
            <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900">No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
