
import React, { useState } from 'react';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { MOCK_POSTS, MOCK_COMPANIES } from '../constants';
import { Post } from '../types';
import { Building2, ArrowRight } from 'lucide-react';

interface FeedProps {
  searchQuery: string;
  onCompanyClick?: (companyName: string) => void;
}

const Feed: React.FC<FeedProps> = ({ searchQuery, onCompanyClick }) => {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  const handlePostCreated = (newPost: Post) => {
    setPosts([newPost, ...posts]);
  };

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.toLowerCase();
    return (
      post.content.toLowerCase().includes(query) ||
      post.author.name.toLowerCase().includes(query) ||
      post.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const filteredCompanies = searchQuery
    ? MOCK_COMPANIES.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div>
      <CreatePost onPostCreated={handlePostCreated} />
      
      {searchQuery && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <h3 className="text-sm font-semibold text-gray-500">Search Results</h3>
          </div>
          
          {/* Company Results */}
          {filteredCompanies.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
               <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
                 <Building2 className="w-4 h-4 text-gray-500" />
                 <h4 className="text-sm font-semibold text-gray-800">Companies</h4>
               </div>
               <div>
                 {filteredCompanies.map(company => (
                   <div 
                    key={company.id} 
                    className="p-4 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors border-b border-gray-100 last:border-0"
                    onClick={() => onCompanyClick && onCompanyClick(company.name)}
                   >
                     <div className="flex items-center gap-3">
                       <img 
                        src={company.logo} 
                        alt={company.name} 
                        className="w-12 h-12 object-contain border border-gray-100 rounded-lg bg-white" 
                       />
                       <div>
                         <h4 className="font-bold text-gray-900 text-base">{company.name}</h4>
                         <p className="text-xs text-gray-500">{company.industry} • {company.headquarters}</p>
                       </div>
                     </div>
                     <button className="text-semi-600 hover:bg-semi-50 p-2 rounded-full">
                       <ArrowRight className="w-5 h-5" />
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <div className="h-[1px] bg-gray-300 flex-1"></div>
        <span className="text-xs text-gray-500 px-2">Sort by: <strong className="text-gray-900 cursor-pointer">Top</strong></span>
      </div>

      {filteredPosts.length > 0 ? (
        filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="text-center py-10 text-gray-500">
          {searchQuery && filteredCompanies.length === 0 ? (
            <p>No posts or companies found matching "{searchQuery}"</p>
          ) : searchQuery && filteredCompanies.length > 0 ? (
             <p className="text-sm mt-4">No posts found matching "{searchQuery}", but check the companies above.</p>
          ) : (
            <p>No posts to display.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
