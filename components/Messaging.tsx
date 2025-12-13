
import React, { useState, useRef, useEffect } from 'react';
import { Search, MoreHorizontal, Video, Phone, Image, Paperclip, Send, Smile, Calendar } from 'lucide-react';
import { Conversation, Message } from '../types';
import { CURRENT_USER } from '../constants';

interface MessagingProps {
    conversations: Conversation[];
    onSendMessage: (conversationId: string, content: string) => void;
}

const Messaging: React.FC<MessagingProps> = ({ conversations, onSendMessage }) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c.id === selectedConvId);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation?.messages]);

  // If no conversation is selected but conversations exist, select the first one
  useEffect(() => {
      if (!selectedConvId && conversations.length > 0) {
          setSelectedConvId(conversations[0].id);
      }
  }, [conversations, selectedConvId]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !selectedConversation) return;
    onSendMessage(selectedConversation.id, inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[calc(100vh-140px)] min-h-[600px] flex overflow-hidden">
      {/* Left Sidebar: Conversation List */}
      <div className="w-full md:w-1/3 lg:w-80 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-3 border-b border-gray-200">
          <div className="flex justify-between items-center mb-3 px-1">
            <h2 className="font-bold text-gray-900">Messaging</h2>
            <div className="flex gap-2">
              <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-900" />
              <div className="p-1 rounded hover:bg-gray-100 cursor-pointer">
                <Send className="w-5 h-5 text-gray-500 hover:text-gray-900" />
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-semi-500 focus:border-semi-500 sm:text-sm"
              placeholder="Search messages"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => {
            const lastMessage = conv.messages[conv.messages.length - 1];
            return (
              <div 
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 border-l-4 transition-colors ${
                  selectedConvId === conv.id ? 'border-semi-600 bg-blue-50/30' : 'border-transparent'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img 
                    src={conv.contact.avatarUrl} 
                    alt={conv.contact.name} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conv.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-gray-900 truncate pr-1">{conv.contact.name}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">{conv.lastMessageTimestamp}</span>
                  </div>
                  <p className={`text-sm truncate mt-0.5 ${
                    lastMessage.senderId !== 'me' && !lastMessage.isRead ? 'font-semibold text-gray-900' : 'text-gray-500'
                  }`}>
                    {lastMessage.senderId === 'me' ? 'You: ' : ''}{lastMessage.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel: Chat Area */}
      <div className="hidden md:flex flex-1 flex-col h-full bg-white">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <img 
                      src={selectedConversation.contact.avatarUrl} 
                      alt={selectedConversation.contact.name} 
                      className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    />
                    {selectedConversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                 </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-sm hover:underline cursor-pointer">
                    {selectedConversation.contact.name}
                  </h2>
                  <p className="text-xs text-gray-500 line-clamp-1">{selectedConversation.contact.headline}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-500">
                <Video className="w-5 h-5 cursor-pointer hover:text-gray-900" />
                <Phone className="w-5 h-5 cursor-pointer hover:text-gray-900" />
                <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-gray-900" />
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              <div className="text-center">
                 <span className="text-xs text-gray-400 font-medium bg-gray-100 px-3 py-1 rounded-full">Today</span>
              </div>
              
              {selectedConversation.messages.map((msg, idx) => {
                const isMe = msg.senderId === 'me';
                const showAvatar = !isMe && (idx === 0 || selectedConversation.messages[idx - 1].senderId === 'me');
                
                return (
                  <div 
                    key={msg.id} 
                    className={`flex items-end gap-2 group ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <div className="w-8 flex-shrink-0">
                         {showAvatar ? (
                             <img src={selectedConversation.contact.avatarUrl} className="w-8 h-8 rounded-full" />
                         ) : <div className="w-8" />}
                      </div>
                    )}
                    
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm relative shadow-sm ${
                      isMe 
                        ? 'bg-semi-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      <span className={`text-[10px] absolute -bottom-5 ${isMe ? 'right-0' : 'left-0'} text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity min-w-max`}>
                         {msg.timestamp}
                      </span>
                    </div>

                    {isMe && (
                       <div className="w-8 flex-shrink-0">
                          <img src={CURRENT_USER.avatarUrl} className="w-8 h-8 rounded-full" />
                       </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form 
                onSubmit={handleSubmit}
                className="bg-gray-100 rounded-xl p-2 focus-within:ring-2 focus-within:ring-semi-200 transition-all border border-gray-200"
              >
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a message..."
                  className="w-full bg-transparent border-none focus:ring-0 resize-none text-sm text-gray-900 placeholder-gray-500 min-h-[40px] max-h-[120px]"
                  rows={2}
                />
                <div className="flex justify-between items-center mt-2 px-1">
                  <div className="flex gap-3 text-gray-500">
                    <Image className="w-5 h-5 cursor-pointer hover:text-gray-700 transition-colors" />
                    <Paperclip className="w-5 h-5 cursor-pointer hover:text-gray-700 transition-colors" />
                    <Smile className="w-5 h-5 cursor-pointer hover:text-gray-700 transition-colors" />
                    <Calendar className="w-5 h-5 cursor-pointer hover:text-gray-700 transition-colors" />
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      type="submit"
                      disabled={!inputText.trim()}
                      className="bg-semi-600 text-white p-2 rounded-full hover:bg-semi-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
            <div className="w-40 h-40 bg-gray-100 rounded-full flex items-center justify-center mb-6">
               <img src="https://illustrations.popsy.co/gray/work-from-home.svg" alt="No selection" className="w-32 opacity-60" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Select a conversation</h3>
            <p className="text-center max-w-xs">Choose a contact from the list on the left to start chatting about chips!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
