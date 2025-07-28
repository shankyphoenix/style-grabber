import { useState, useEffect } from 'react';
import { Search, Edit, Archive, Flag, MoreHorizontal, Reply, Forward, Star, MapPin, Bike, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Email {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  isUnread: boolean;
  isImportant?: boolean;
  category?: string;
}

const EmailClient = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [selectedFolder, setSelectedFolder] = useState('INBOX');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate AJAX call to fetch emails
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const fetchedEmails = [
        {
          id: 1,
          sender: "Lisa Greenberg",
          subject: "Book Recommendations",
          preview: "I'm a huge productivity nerd and was...",
          time: "8:19 AM",
          isUnread: true,
          category: "Personal"
        },
        {
          id: 2,
          sender: "John Smith",
          subject: "Welcome Back",
          preview: "Hey Mike, Good to see you are back",
          time: "8:16 AM",
          isUnread: true
        },
        {
          id: 3,
          sender: "Spark",
          subject: "New email account login in Spark",
          preview: "Your email address -",
          time: "8:07 AM",
          isUnread: true
        },
        {
          id: 4,
          sender: "SaneBox",
          subject: "What's new with your SaneBox acco...",
          preview: "Goto my Dashboard Hi Mike! Share",
          time: "Nov 16",
          isUnread: false
        },
        {
          id: 5,
          sender: "SaneBox",
          subject: "What's new with your SaneBox acco...",
          preview: "Goto my Dashboard Hi Mike! Share",
          time: "Nov 9",
          isUnread: false
        },
        {
          id: 6,
          sender: "SaneBox Digest",
          subject: "(Sane Digest) 11 recent messages f...",
          preview: "Email address:",
          time: "Yesterday",
          isUnread: false,
          category: "Newsletters"
        }
      ];
      setEmails(fetchedEmails);
      setSelectedEmail(fetchedEmails[0]);
      setLoading(false);
    }, 1200);
  }, []);

  // Filter emails based on search term
  const filteredEmails = emails.filter(email => 
    email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="w-96 bg-email-list-bg border-r border-email-list-border flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-email-list-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-300"
            />
            <Edit className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-email-list-border px-4">
          <button className="px-4 py-3 text-sm font-medium text-primary border-b-2 border-primary">
            Smart
          </button>
          <button className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900">
            Classic
          </button>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {
          loading ? (
            <div className="flex items-center justify-center h-full text-gray-500 text-lg">
              Loading emails...
            </div>
          ) : (
            filteredEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`p-4 border-b border-email-list-border cursor-pointer transition-colors ${
                  selectedEmail?.id === email.id ? 'bg-email-selected' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {email.isUnread && (
                      <div className="w-2 h-2 bg-email-unread-indicator rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`text-sm ${email.isUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {email.sender}
                      </p>
                      <p className="text-xs text-gray-500">{email.time}</p>
                    </div>
                    <p className={`text-sm mb-1 ${email.isUnread ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      {email.subject}
                    </p>
                    <p className="text-sm text-gray-500 truncate">{email.preview}</p>
                    {email.category && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {email.category}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Email Detail */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">{selectedEmail?.subject}</h1>
            <div className="flex items-center space-x-2">
              <Badge className="bg-email-sidebar text-white px-3 py-1">
                INBOX
              </Badge>
              {selectedEmail?.isUnread && (
                <Badge variant="outline" className="px-3 py-1">
                  Important
                </Badge>
              )}
              {selectedEmail?.category && (
                <Badge className="bg-primary text-primary-foreground px-3 py-1">
                  {selectedEmail.category}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {selectedEmail?.sender
                    ? selectedEmail.sender.split(' ').map(n => n[0]).join('').slice(0, 2)
                    : ''}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{selectedEmail?.sender}</p>
                <p className="text-sm text-gray-600">To: Mike Schmitz</p>
                {/* Tag-like options */}
                <div className="flex space-x-2 mt-2">
                  {/* Portland tag */}
                  <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
                    <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                    Portland
                    <button className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                  {/* Biking tag */}
                  <span className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
                    <Bike className="w-4 h-4 mr-1 text-gray-500" />
                    Biking
                    <button className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95A1 1 0 115.05 3.636L10 8.586z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                  {/* Add more tags as needed */}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-gray-600">
              <span className="text-sm">Monday, Nov 19, {selectedEmail?.time}</span>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="prose max-w-none">
            {selectedEmail ? (
              selectedEmail.id === 1 ? (
                <>
                  <p className="text-gray-800 leading-relaxed mb-4">
                    I'm a huge productivity nerd and was wondering if you have any book recommendations for 
                    someone who wants to work on creating better habits. Any suggestions?
                  </p>
                  <p className="text-gray-800 leading-relaxed mb-4">
                    Thanks in advance,
                  </p>
                  <p className="text-gray-800 leading-relaxed mb-4">
                    Lisa
                  </p>
                  <p className="text-gray-800 leading-relaxed">
                    P.S. I listen to Bookworm and love it!
                  </p>
                </>
              ) : (
                <div className="text-gray-800 leading-relaxed">
                  <p className="mb-4">{selectedEmail.preview}</p>
                  <p className="mb-4">
                    This is the full content of the email from {selectedEmail.sender}.
                  </p>
                  <p className="text-gray-600">
                    Best regards,<br />
                    {selectedEmail.sender}
                  </p>
                </div>
              )
            ) : (
              <div className="text-gray-500">Select an email to view details.</div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <Reply className="w-4 h-4" />
              <span>Reply</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Forward className="w-4 h-4" />
              <span>Forward</span>
            </Button>
            <Button className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Quick Reply</span>
            </Button>
            {/* Added icons after Quick Reply */}
            <div className="flex items-center space-x-2 ml-4">
              {/* Pin */}
              <Button variant="ghost" size="icon">
                <Flag className="w-5 h-5" />
              </Button>
              {/* Circle (use a simple SVG or emoji) */}
              <Button variant="ghost" size="icon">
                <span className="w-5 h-5 flex items-center justify-center">⚪</span>
              </Button>
              {/* Clock */}
              <Button variant="ghost" size="icon">
                <Clock className="w-5 h-5" />
              </Button>
              {/* Archive */}
              <Button variant="ghost" size="icon">
                <Archive className="w-5 h-5" />
              </Button>
              {/* Trash */}
              <Button variant="ghost" size="icon">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 6h18M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6M10 11v6M14 11v6" />
                </svg>
              </Button>
              {/* Folder */}
              <Button variant="ghost" size="icon">
                <span className="w-5 h-5 flex items-center justify-center">📁</span>
              </Button>
              {/* More */}
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailClient;