import React from 'react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import EmailList from './EmailList';

const EmailClient = () => {
  
  const [selectedFolder, setSelectedFolder] = useState('INBOX');

  const folders = [
    { name: 'INBOX', count: 7, icon: '📧' },
    { name: 'CALENDAR', icon: '📅' },
    { name: 'Sent', icon: '📤' },
    { name: 'Drafts', icon: '📝' },
    { name: 'Pins', icon: '📌' },
    { name: 'Archive', icon: '📦' },
    { name: 'More', icon: '⋯' }
  ];

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-56 bg-email-sidebar text-email-sidebar-foreground flex flex-col">
        {/* Window Controls */}
        <div className="flex items-center justify-between p-4 border-b border-email-sidebar-hover">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>

        {/* Folders */}
        <div className="flex-1 p-4">
          <div className="space-y-1">
            {folders.map((folder) => (
              <button
                key={folder.name}
                onClick={() => setSelectedFolder(folder.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedFolder === folder.name
                    ? 'bg-email-sidebar-hover text-white'
                    : 'text-gray-300 hover:bg-email-sidebar-hover hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">{folder.icon}</span>
                  <span>{folder.name}</span>
                </div>
                {folder.count && (
                  <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {folder.count}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 px-3">Folders</p>
            <div className="space-y-1">
              <div className="px-3 py-2 text-sm text-gray-300">Smart</div>
              <div className="px-3 py-2 text-sm text-gray-300">Classic</div>
            </div>
          </div>
        </div>
      </div>

      {/* Email List */}
      <EmailList />

    </div>
  );
};

export default EmailClient;