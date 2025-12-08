
import React from 'react';
import { Info, ArrowRight } from 'lucide-react';
import { NEWS_ITEMS } from '../constants';

const RightPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-20">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-900 text-sm">SemiLink News</h2>
        <Info className="w-4 h-4 text-gray-500 cursor-pointer fill-current" />
      </div>

      <ul className="space-y-4">
        {NEWS_ITEMS.map((item) => (
          <li key={item.id} className="cursor-pointer group">
            <a 
              href={`https://www.google.com/search?q=${encodeURIComponent(item.title + ' semiconductor news')}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start gap-2 block"
            >
                <span className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 group-hover:bg-semi-600 flex-shrink-0"></span>
                <div>
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 group-hover:underline leading-snug">
                    {item.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-1 gap-1">
                    <span>{item.time}</span>
                    <span>•</span>
                    <span>{item.readers.toLocaleString()} readers</span>
                    </div>
                </div>
            </a>
          </li>
        ))}
      </ul>

      <button className="mt-4 flex items-center gap-1 text-sm text-gray-500 font-semibold hover:bg-gray-100 px-2 py-1 rounded transition-colors">
        Show more <ArrowRight className="w-4 h-4" />
      </button>

      {/* Ad Placeholder */}
      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 mb-2">Promoted</p>
        <div className="flex items-center justify-center gap-3 cursor-pointer">
            <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
            <div className="text-left">
                <p className="text-xs font-bold text-gray-800">Master Verilog Today</p>
                <p className="text-xs text-gray-500">Join 5000+ engineers</p>
            </div>
        </div>
        <button className="mt-3 text-blue-600 text-sm font-semibold border border-blue-600 rounded-full px-4 py-1 hover:bg-blue-50 transition-colors">
            Learn more
        </button>
      </div>
    </div>
  );
};

export default RightPanel;
