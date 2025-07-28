import React from 'react'
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Search, Edit } from 'lucide-react';

import { Input } from '@/components/ui/input';
import EmailDetails from './EmailDetails';

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

const EmailList = () => {

    const [emails, setEmails] = useState<Email[]>([]);
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);
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

    // Simulate AJAX call to fetch single email detail
    const handleEmailClick = (emailId: number) => {
        setDetailLoading(true);
        setSelectedEmail(null);
        setTimeout(() => {
            const found = emails.find(e => e.id === emailId) || null;
            setSelectedEmail(found);
            setDetailLoading(false);
        }, 800);
    };

    // Filter emails based on search term
    const filteredEmails = emails.filter(email => 
        email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.preview.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return (
        <>
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
                    onClick={() => handleEmailClick(email.id)}
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
        
        {/* Email Details */}
        {detailLoading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
                Loading email details...
            </div>
        ) : (
            <EmailDetails selectedEmail={selectedEmail} />
        )}
        </>
    )
}

export default EmailList