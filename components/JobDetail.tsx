
import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Briefcase, DollarSign, Share2, Bookmark, Check, Loader2, BarChart2, Layers } from 'lucide-react';
import { Job } from '../types';

interface JobDetailProps {
  job: Job;
  onBack: () => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, onBack }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = () => {
    setIsApplying(true);
    // Simulate API call
    setTimeout(() => {
      setIsApplied(true);
      setIsApplying(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Navigation Header */}
      <div className="p-4 border-b border-gray-100 flex items-center gap-2 sticky top-0 bg-white z-10">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-gray-900 truncate">Job Details</h2>
      </div>

      <div className="p-6 md:p-8">
        {/* Job Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="flex-shrink-0">
            <img 
              src={job.companyLogo} 
              alt={job.company} 
              className="w-20 h-20 md:w-24 md:h-24 object-contain border border-gray-100 rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
            <div className="text-lg text-gray-700 font-medium mb-1">
              {job.company}
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {job.location} ({job.type})
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Posted {job.postedTime}
              </span>
              <span className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-0.5 rounded font-medium">
                 {job.applicants} applicants
              </span>
            </div>
          </div>
          <div className="flex flex-row md:flex-col gap-3 md:items-end">
            <button className="flex-1 md:flex-none p-2 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-600">
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={`flex-1 md:flex-none p-2 rounded-full border transition-colors ${
                isSaved ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-gray-300 hover:bg-gray-50 text-gray-600'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-4 mb-8">
           <button 
            onClick={handleApply}
            disabled={isApplied || isApplying}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-full font-semibold text-lg transition-all ${
              isApplied 
                ? 'bg-green-600 text-white cursor-default shadow-none' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
            } ${isApplying ? 'opacity-75 cursor-wait' : ''}`}
           >
            {isApplied ? (
              <><Check className="w-5 h-5" /> Applied</>
            ) : isApplying ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Applying...</>
            ) : (
              'Apply Now'
            )}
           </button>
           <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold border transition-colors ${
               isSaved
                 ? 'border-blue-600 text-blue-600 bg-blue-50'
                 : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
           >
             {isSaved ? 'Saved' : 'Save'}
           </button>
        </div>

        {/* Job Properties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-start gap-3">
             <Briefcase className="w-5 h-5 text-gray-500 mt-0.5" />
             <div>
               <p className="text-sm font-semibold text-gray-900">Experience Level</p>
               <p className="text-sm text-gray-600">{job.experienceLevel}</p>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <Layers className="w-5 h-5 text-gray-500 mt-0.5" />
             <div>
               <p className="text-sm font-semibold text-gray-900">Job Function</p>
               <p className="text-sm text-gray-600">{job.jobFunction || 'Not specified'}</p>
             </div>
          </div>
           <div className="flex items-start gap-3">
             <BarChart2 className="w-5 h-5 text-gray-500 mt-0.5" />
             <div>
               <p className="text-sm font-semibold text-gray-900">Seniority Level</p>
               <p className="text-sm text-gray-600">{job.seniority || 'Not specified'}</p>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <DollarSign className="w-5 h-5 text-gray-500 mt-0.5" />
             <div>
               <p className="text-sm font-semibold text-gray-900">Salary Range</p>
               <p className="text-sm text-gray-600">{job.salaryRange || 'Not specified'}</p>
             </div>
          </div>
          <div className="flex items-start gap-3">
             <Briefcase className="w-5 h-5 text-gray-500 mt-0.5" />
             <div>
               <p className="text-sm font-semibold text-gray-900">Industry</p>
               <p className="text-sm text-gray-600">{job.industry}</p>
             </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-bold text-gray-900 mb-3">About the job</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {job.description || "No description available."}
            </p>
          </section>

          {job.requirements && job.requirements.length > 0 && (
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Requirements</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
        
        {/* About Company Mini-Section */}
        <div className="mt-10 pt-8 border-t border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">About the company</h3>
          <div className="flex items-center gap-4 mb-6">
             <img src={job.companyLogo} alt={job.company} className="w-12 h-12 object-contain border border-gray-100 p-1 rounded bg-white" />
             <div>
                <p className="font-semibold text-gray-900">{job.company}</p>
                <p className="text-sm text-gray-500">{job.industry}</p>
             </div>
          </div>
        </div>

        {/* Bottom Apply Section */}
        <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Interested in this role?</h3>
            <p className="text-gray-600 text-sm">Don't miss out on this opportunity at {job.company}.</p>
          </div>
           <button 
            onClick={handleApply}
            disabled={isApplied || isApplying}
            className={`flex items-center gap-2 px-8 py-2.5 rounded-full font-semibold text-lg transition-all ${
              isApplied 
                ? 'bg-green-600 text-white cursor-default shadow-none' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
            } ${isApplying ? 'opacity-75 cursor-wait' : ''}`}
           >
            {isApplied ? (
              <><Check className="w-5 h-5" /> Applied</>
            ) : isApplying ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Applying...</>
            ) : (
              'Apply Now'
            )}
           </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
