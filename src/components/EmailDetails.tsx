import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Archive, Flag, MoreHorizontal, Reply, Forward, Star, MapPin, Bike, Clock } from 'lucide-react';

// Accept tags prop from parent
const EmailDetails = ({ selectedEmail, selectedCompanyUrl,  tags = [] }) => {
  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [processSuccess, setProcessSuccess] = useState(false);

  const handleProcess = async () => {
    if (!selectedCompanyUrl) {
      setProcessError('No email URL found.');
      return;
    }
    setProcessing(true);
    setProcessError(null);
    setProcessSuccess(false);
    try {
      // Generate mmddmmyymm format
      const now = new Date();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const yy = String(now.getFullYear()).slice(-2);
      const m = String(now.getMonth() + 1);
      const datePattern = `${mm}${dd}${m}${yy}${m}`; // mmddmmyymm

      const response = await fetch('https://h26clhfesah2yyq5cwo4hotsfm0gfjcq.lambda-url.eu-north-1.on.aws/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: selectedCompanyUrl + "/outlook/email/" + datePattern + "/" + selectedEmail.id }),
      });
      if (!response.ok) {
        throw new Error('API request failed');
      }
      setProcessSuccess(true);
    } catch (err: any) {
      setProcessError(err.message || 'Unknown error');
    } finally {
      setProcessing(false);
    }
  };

  return (
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
                <p className="text-sm text-gray-600">To: {selectedEmail?.to}</p>
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
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-700">
                      {tag}
                    </span>
                  ))}
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
                  <div
                    className="mb-4"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.preview }}
                  />
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
            <Button
              className="flex items-center space-x-2"
              onClick={handleProcess}
              disabled={processing}
            >
              <Star className="w-4 h-4" />
              <span>
                {processing ? 'Processing...' : 'Process'}
              </span>
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
          {processError && (
            <div className="mt-4 text-red-600 text-sm">{processError}</div>
          )}
          {processSuccess && (
            <div className="mt-4 text-green-600 text-sm">Processed successfully!</div>
          )}
        </div>
    </div>
  )
}

export default EmailDetails