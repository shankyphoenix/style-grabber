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
    const [emailTags, setEmailTags] = useState<{ [emailId: number]: string[] }>({});
    const [tagModalEmailId, setTagModalEmailId] = useState<number | null>(null);
    const [customTag, setCustomTag] = useState('');
    const [predefinedTags, setPredefinedTags] = useState<string[]>(["Work", "Personal", "Urgent", "Follow Up", "Newsletter"]);

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

    // Add tag to email
    const addTagToEmail = (emailId: number, tag: string) => {
        setEmailTags(prev => ({
            ...prev,
            [emailId]: prev[emailId] ? [...new Set([...prev[emailId], tag])] : [tag]
        }));
    };

    // Add custom tag to predefined tags only
    const addCustomTag = (tag: string) => {
        if (tag && !predefinedTags.includes(tag)) {
            setPredefinedTags(prev => [...prev, tag]);
        }
        setCustomTag('');
    };

    // Remove tag from email
    const removeTagFromEmail = (emailId: number, tag: string) => {
        setEmailTags(prev => ({
            ...prev,
            [emailId]: prev[emailId]?.filter(t => t !== tag) || []
        }));
    };

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
                        {/* Email tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                            {(emailTags[email.id] || []).map(tag => (
                                <span key={tag} className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                                    {tag}
                                    <button
                                        className="ml-1 text-gray-400 hover:text-gray-700"
                                        onClick={e => {
                                            e.stopPropagation();
                                            removeTagFromEmail(email.id, tag);
                                        }}
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                            <button
                                className="ml-2 px-2 py-0.5 text-xs rounded bg-primary text-white hover:bg-primary/80"
                                onClick={e => {
                                    e.stopPropagation();
                                    setTagModalEmailId(email.id);
                                }}
                            >
                                + Tag
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
                ))
            )}
            </div>
        </div>

        {/* Tag Modal/Popover */}
        {tagModalEmailId !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded shadow-lg p-6 min-w-[320px]">
                    <h3 className="text-lg font-semibold mb-2">Manage Tags</h3>
                    <div className="mb-2">
                        <div className="font-medium text-sm mb-1">Predefined Tags:</div>
                        <div className="flex flex-wrap gap-2">
                            {predefinedTags.map(tag => (
                                <button
                                    key={tag}
                                    className={`px-2 py-1 rounded-full text-xs border ${
                                        emailTags[tagModalEmailId]?.includes(tag)
                                            ? "bg-primary text-white border-primary"
                                            : "bg-gray-100 text-gray-700 border-gray-300"
                                    }`}
                                    onClick={() => addTagToEmail(tagModalEmailId, tag)}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="font-medium text-sm mb-1">Add Custom Tag:</div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                className="border rounded px-2 py-1 text-sm flex-1"
                                value={customTag}
                                onChange={e => setCustomTag(e.target.value)}
                                placeholder="Enter tag"
                            />
                            <button
                                className="px-2 py-1 bg-primary text-white rounded text-xs"
                                disabled={!customTag.trim()}
                                onClick={() => addCustomTag(customTag.trim())}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4">
                        <button
                            className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                            onClick={() => {
                                setTagModalEmailId(null);
                                setCustomTag('');
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Email Details */}
        {detailLoading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
                Loading email details...
            </div>
        ) : (
            <EmailDetails selectedEmail={selectedEmail} tags={selectedEmail ? emailTags[selectedEmail.id] || [] : []} />
        )}
        </>
    )
}

export default EmailList