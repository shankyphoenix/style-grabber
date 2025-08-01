import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import EmailList from './EmailList';
import { Inbox, Users, StickyNote } from 'lucide-react';
import { Input } from '@/components/ui/input';

const EmailClient = () => {
  const [selectedFolder, setSelectedFolder] = useState('INBOX');

  const folders = [
    { name: 'Inbox', icon: <Inbox className="w-5 h-5 mr-2" /> },
    { name: 'Contacts', icon: <Users className="w-5 h-5 mr-2" /> },
    { name: 'Notes', icon: <StickyNote className="w-5 h-5 mr-2" /> },
    { name: 'Reminders', icon: <StickyNote className="w-5 h-5 mr-2" /> }
  ];

  // For search/autosuggest
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Fetch companies from API
  const [allOptions, setAllOptions] = useState<{ company_id: string; company_name: string; url: string }[]>([]);
  useEffect(() => {
    // Use import.meta.env for Vite or process.env for Create React App
    const apiKey =
      typeof process !== "undefined" && process.env && process.env.REACT_APP_INTERLYNX_API_KEY
        ? process.env.REACT_APP_INTERLYNX_API_KEY
        : (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_INTERLYNX_API_KEY
            ? import.meta.env.VITE_INTERLYNX_API_KEY
            : 'AWS_API_KEY_12345');
            

    // Use fetch with credentials: 'same-origin' to ensure headers are sent
    fetch('https://database.interlynxsystems.com/AWSFeatures/get_all_companies', {
      method: 'GET',
      headers: {
        'x-api-key': apiKey || '',
        'Accept': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        setAllOptions(data);
      })
      .catch(() => setAllOptions([]));
  }, []);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedCompanyUrl, setSelectedCompanyUrl] = useState<string | null>(null);

  // Update suggestions as user types
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (val.trim() === '') {
      setSuggestions([]);
    } else {
      setSuggestions(
        allOptions
          .filter(opt => opt.name.toLowerCase().includes(val.toLowerCase()))
          .map(opt => opt.name)
      );
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (option: string) => {
    console.log(allOptions);
    const selected = allOptions.find(opt => opt.name === option);
    setSelectedOption(option);
    setSelectedCompanyId(selected ? selected.company_id : null);
    setSelectedCompanyUrl(selected ? selected.url : null);
    console.log(selected.url);
    setSelectedFolder('Inbox'); // Automatically select Inbox
    setSearchValue('');
    setSuggestions([]);
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-56 bg-email-sidebar text-email-sidebar-foreground flex flex-col">
        {/* Window Controls */}
        <div className="flex flex-col items-center p-4 border-b border-email-sidebar-hover">
          {/* Search box with autosuggest */}
          <div className="w-full">
            <div className="relative w-full">
              <Input
                placeholder="Search Company Here"
                value={searchValue}
                onChange={handleSearchChange}
                className="pl-3 pr-8 py-2 text-sm rounded-lg bg-[#232232] border border-[#bdbdbd] text-white"
                style={{ backgroundColor: "#232232", color: "#fff" }}
              />
              {/* Suggestions dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 w-full bg-[#232232] border border-[#bdbdbd] rounded shadow z-10">
                  {suggestions.map(option => (
                    <div
                      key={option}
                      className="px-3 py-2 hover:bg-[#4f67ff] hover:text-white cursor-pointer text-sm text-white rounded"
                      onClick={() => handleSelectSuggestion(option)}
                      style={{ transition: 'background 0.2s' }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Selected option as a label below the search box */}
            {selectedOption && (
              <div className="mt-2 w-full">
                <div className="flex items-center w-full">
                  <span className="flex-1 font-bold text-white text-base truncate">
                    {selectedOption}
                  </span>
                  <button
                    className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                    onClick={() => {
                      setSelectedOption(null);
                      setSelectedCompanyId(null); // Reset company selection for default view
                      setSelectedCompanyUrl(null); // Reset company selection for default view
                    }}
                  >
                    &times;
                  </button>
                </div>
              </div>
            )}
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
                {folder.name === 'Inbox' ? (
                  <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    {0}
                  </Badge>
                ) : (
                  <></>
                )}
              </button>
            ))}
          </div>

          {/* <div className="mt-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 px-3">Folders</p>
            <div className="space-y-1">
              <div className="px-3 py-2 text-sm text-gray-300">Smart</div>
              <div className="px-3 py-2 text-sm text-gray-300">Classic</div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Email List */}
      <EmailList
        selectedFolder={selectedFolder}
        selectedCompanyId={selectedCompanyId}
        selectedCompanyUrl={selectedCompanyUrl}
      />

    </div>
  );
};

export default EmailClient;