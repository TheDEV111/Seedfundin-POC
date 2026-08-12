'use client';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { Search, Send, MoreVertical, Phone, Info } from 'lucide-react';

const DUMMY_CHATS_TENANT = [
  { id: 1, name: 'John Doe (Landlord)', property: 'Luxury 2-Bed Apartment', lastMessage: 'Yes it is! I\'ll be around from 10 AM...', time: '10:42 AM', unread: 2, avatar: 'JD' },
  { id: 2, name: 'Alice Smith', property: 'Cozy Master Suite', lastMessage: 'The application is approved.', time: 'Yesterday', unread: 0, avatar: 'AS' },
];

const DUMMY_CHATS_LANDLORD = [
  { id: 1, name: 'Sarah Connor', property: 'Luxury 2-Bed Apartment', lastMessage: 'Hi! Is the apartment still available?', time: '10:42 AM', unread: 2, avatar: 'SC' },
  { id: 2, name: 'Mike Ross', property: 'Luxury 2-Bed Apartment', lastMessage: 'I can pay 6 months upfront.', time: 'Yesterday', unread: 0, avatar: 'MR' },
  { id: 3, name: 'Harvey Specter', property: 'Downtown Office Space', lastMessage: 'Let\'s schedule a viewing.', time: 'Monday', unread: 0, avatar: 'HS' },
];

export const MessagesView = () => {
  const role = useSelector((state: RootState) => state.auth.role);
  const chats = role === 'landlord' ? DUMMY_CHATS_LANDLORD : DUMMY_CHATS_TENANT;
  
  const [activeChat, setActiveChat] = useState(chats[0]);
  const [message, setMessage] = useState('');

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar - Inbox List */}
      <div className="w-80 border-r border-gray-100 flex flex-col h-[calc(100vh-64px)]">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-extrabold text-[#2B2B26] mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-olive-DEFAULT/50"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat)}
              className={`p-4 border-b border-gray-50 cursor-pointer transition-colors flex gap-3 ${activeChat.id === chat.id ? 'bg-olive-DEFAULT/5 border-l-4 border-l-olive-DEFAULT' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
            >
              <div className="h-10 w-10 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h4 className="font-bold text-sm text-charcoal truncate">{chat.name}</h4>
                  <span className="text-xs text-gray-400 font-medium">{chat.time}</span>
                </div>
                <p className="text-xs text-olive-DEFAULT font-semibold truncate mb-1">{chat.property}</p>
                <div className="flex justify-between items-center">
                  <p className={`text-xs truncate ${chat.unread > 0 ? 'text-charcoal font-bold' : 'text-gray-500'}`}>
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col h-[calc(100vh-64px)] bg-[#F7F7F2]">
        {/* Chat Header */}
        <div className="h-16 px-6 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-charcoal text-white flex items-center justify-center font-bold">
              {activeChat.avatar}
            </div>
            <div>
              <h3 className="font-bold text-charcoal leading-tight">{activeChat.name}</h3>
              <p className="text-xs text-olive-DEFAULT font-semibold">Re: {activeChat.property}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <button className="hover:text-olive-DEFAULT transition-colors"><Phone className="w-5 h-5" /></button>
            <button className="hover:text-olive-DEFAULT transition-colors"><Info className="w-5 h-5" /></button>
            <button className="hover:text-olive-DEFAULT transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div className="text-center text-xs text-gray-400 font-medium my-2">Today</div>
          
          {role === 'tenant' ? (
            <>
              <div className="self-end bg-olive-DEFAULT text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[70%] shadow-sm">
                Hi John! I love the apartment. Is it still available for viewing tomorrow?
              </div>
              <div className="self-start bg-white border border-gray-100 text-charcoal px-5 py-3 rounded-2xl rounded-tl-sm max-w-[70%] shadow-sm flex flex-col">
                <span>Yes it is! I'll be around from 10 AM to 2 PM. Let's lock it in.</span>
                <span className="text-[10px] text-gray-400 self-end mt-1">10:42 AM</span>
              </div>
            </>
          ) : (
            <>
              <div className="self-start bg-white border border-gray-100 text-charcoal px-5 py-3 rounded-2xl rounded-tl-sm max-w-[70%] shadow-sm flex flex-col">
                <span>Hi! Is the apartment still available? I saw your listing on Seedfundin.</span>
                <span className="text-[10px] text-gray-400 self-end mt-1">10:42 AM</span>
              </div>
            </>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-olive-DEFAULT/50 focus-within:border-olive-DEFAULT transition-all">
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                className="w-full bg-transparent p-4 outline-none resize-none min-h-[56px] max-h-32 text-sm"
                rows={1}
              />
            </div>
            <button 
              className={`h-14 w-14 rounded-full flex items-center justify-center transition-colors flex-shrink-0 shadow-md ${message.trim() ? 'bg-olive-DEFAULT text-white hover:bg-olive-deep' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
