import React from 'react'
import { useState } from 'react';

const TagManager = ({predefinedTags, tagModalEmailId, emailTags, addTagToEmail, addCustomTag, setTagModalEmailId}) => {
    const [customTag, setCustomTag] = useState('');

    return (
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
    )
}

export default TagManager