import React from 'react'
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Search, Edit } from 'lucide-react';

import { Input } from '@/components/ui/input';
import EmailDetails from './EmailDetails';
import TagManager from './TagManager';

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

const fetchedEmails: Record<string, Array<{
  id: string;
  subject: string;
  sender: string;
  body: string;
  date: string;
}>> = {
  abb: [
    { id: '1', subject: 'ABB Order Confirmation', sender: 'sales@abb.com', body: 'Your order is confirmed.', date: '2024-06-01' },
    { id: '2', subject: 'ABB Invoice', sender: 'billing@abb.com', body: 'Please find attached invoice.', date: '2024-06-02' }
  ],
  ami: [
    { id: '3', subject: 'AMI Bearings Update', sender: 'info@ami.com', body: 'Product update details.', date: '2024-06-03' }
  ],
  banner: [
    { id: '4', subject: 'Banner Engineering Newsletter', sender: 'newsletter@banner.com', body: 'Latest news from Banner.', date: '2024-06-04' }
  ],
  bosch: [
    { id: '5', subject: 'Bosch Rexroth Shipment', sender: 'shipping@bosch.com', body: 'Your shipment is on the way.', date: '2024-06-05' }
  ],
  ericson: [
    { id: '6', subject: 'Ericson Manufacturing Quote', sender: 'quotes@ericson.com', body: 'Here is your requested quote.', date: '2024-06-06' }
  ],
  gates: [
    { id: '7', subject: 'Gates Corporation Support', sender: 'support@gates.com', body: 'Support ticket update.', date: '2024-06-07' }
  ],
  imi: [
    { id: '8', subject: 'IMI Norgren Product Launch', sender: 'marketing@imi.com', body: 'Check out our new products.', date: '2024-06-08' }
  ]
};

interface EmailListProps {
  selectedFolder: string;
  selectedCompanyId: string | null;
}

const EmailList: React.FC<EmailListProps> = ({ selectedFolder, selectedCompanyId }) => {
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
        let emailsToSet: any[] = [];
        if (
            selectedFolder === 'Inbox' &&
            selectedCompanyId &&
            fetchedEmails[selectedCompanyId]
        ) {
            emailsToSet = fetchedEmails[selectedCompanyId].map((email) => ({
                id: Number(email.id),
                sender: email.sender,
                subject: email.subject,
                preview: email.body,
                time: email.date,
                isUnread: true,
                category: "Company"
            }));
            setSelectedEmail(emailsToSet[0] || null);
        } else {
            // Show default view (no emails) if no company is selected
            emailsToSet = [];
            setSelectedEmail(null);
        }
        setEmails(emailsToSet);
        setLoading(false);
    }, 1200);
}, [selectedCompanyId, selectedFolder]);

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
          {/* <div className="flex border-b border-email-list-border px-4">
          <button className="px-4 py-3 text-sm font-medium text-primary border-b-2 border-primary">
              Smart
          </button>
          <button className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900">
              Classic
          </button>
          </div> */}

          {/* Email List */}
          <div className="flex-1 overflow-y-auto">
          {
          loading ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-lg">
              Loading emails...
              </div>
          ) : (
            filteredEmails.length > 0 ? (
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
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 text-lg">
                Selected Company OR No emails found.
                </div>
            )
          )}
          </div>
      </div>

      {/* Tag Modal/Popover */}
      {tagModalEmailId !== null && (
          <TagManager tagModalEmailId={tagModalEmailId} predefinedTags={predefinedTags} addTagToEmail={addTagToEmail} emailTags={emailTags}  addCustomTag={addCustomTag} setTagModalEmailId={setTagModalEmailId}/>
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