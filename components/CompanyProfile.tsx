
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Globe, MapPin, Plus, Check, Camera, ExternalLink, Briefcase, DollarSign, Search, Building2, User } from 'lucide-react';
import { Company, Job } from '../types';
import { MOCK_JOBS, MOCK_SUGGESTIONS } from '../constants';

interface CompanyProfileProps {
  company: Company;
  onBack: () => void;
  onJobClick?: (job: Job) => void;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ company, onBack, onJobClick }) => {
  const companyJobs = MOCK_JOBS.filter(job => job.company === company.name);
  const [isFollowing, setIsFollowing] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(company.banner);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('home');

  // Get unique job titles for the summary section
  const uniqueJobTitles = Array.from(new Set(companyJobs.map(job => job.title)));

  // Reset state when company prop changes
  useEffect(() => {
    setBannerUrl(company.banner);
    setIsFollowing(false);
    setActiveTab('home');
    setSavedJobs(new Set());
  }, [company]);

  const handleUpdateBanner = () => {
    // Simulate updating the banner with a new random image
    const randomId = Math.floor(Math.random() * 1000);
    setBannerUrl(`https://picsum.photos/800/200?random=${randomId}`);
  };

  const toggleSaveJob = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    const newSaved = new Set(savedJobs);
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId);
    } else {
      newSaved.add(jobId);
    }
    setSavedJobs(newSaved);
  };

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
        <button 
          onClick={onBack}
          className="absolute top-4 left-4 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        {/* Banner */}
        <div className="h-40 bg-gray-200 relative group">
          <img 
            src={bannerUrl} 
            alt={`${company.name} banner`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <button
            onClick={handleUpdateBanner}
            className="absolute top-4 right-4 z-10 p-2 bg-white text-gray-700 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:text-blue-600 hover:bg-gray-50"
            title="Update cover photo"
          >
            <Camera className="w-5 h-5" />
          </button>
          {/* Overlay to indicate interactivity on hover */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </div>

        <div className="px-6 pt-0 pb-0 relative">
          {/* Logo */}
          <div className="absolute -top-16 left-6 p-2 bg-white rounded-xl shadow-lg border border-gray-100 z-10">
             <img 
              src={company.logo} 
              alt={company.name} 
              className="w-32 h-32 rounded-lg object-contain bg-white"
            />
          </div>

          <div className="pt-20 pb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-gray-600 mt-1">{company.industry}</p>
              
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {company.headquarters}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {company.followers.toLocaleString()} followers
                </span>
                <a 
                  href={company.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Globe className="w-4 h-4" /> Website
                </a>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`flex items-center gap-1 px-4 py-1.5 rounded-full font-semibold border transition-colors ${
                  isFollowing 
                    ? 'border-gray-400 text-gray-600 bg-white hover:bg-gray-50'
                    : 'bg-blue-600 text-white border-transparent hover:bg-blue-700'
                }`}
              >
                {isFollowing ? <><Check className="w-4 h-4"/> Following</> : <><Plus className="w-4 h-4"/> Follow</>}
              </button>
              <a 
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 text-blue-600 font-semibold border border-blue-600 rounded-full hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                Visit website <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 flex gap-1 border-t border-gray-200">
           {['Home', 'About', 'Jobs', 'People'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab.toLowerCase())}
               className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                 activeTab === tab.toLowerCase()
                   ? 'border-green-700 text-green-800'
                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {/* --- Tab Content: HOME --- */}
      {activeTab === 'home' && (
        <>
          {/* About Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-4">
              {company.description}
            </p>
            <button 
              onClick={() => setActiveTab('about')}
              className="mt-2 text-blue-600 font-semibold hover:underline text-sm"
            >
              See all details
            </button>
          </div>

          {/* Recently Posted Jobs Summary */}
          {companyJobs.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-3">
                 <h2 className="text-lg font-bold text-gray-900">Recently Posted Jobs</h2>
                 <button 
                  onClick={() => setActiveTab('jobs')}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                 >
                   See all jobs
                 </button>
              </div>
              <div className="space-y-3">
                {companyJobs.slice(0, 3).map(job => (
                  <div 
                    key={job.id} 
                    className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors cursor-pointer"
                    onClick={() => onJobClick && onJobClick(job)}
                  >
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0"></div>
                        <span className="text-sm font-medium text-gray-800 hover:text-blue-600 line-clamp-1">{job.title}</span>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap ml-2">{job.postedTime}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* --- Tab Content: JOBS --- */}
      {activeTab === 'jobs' && (
        <>
           {/* Hiring Summary (Job Titles) */}
           {uniqueJobTitles.length > 0 && (
             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
               <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <h2 className="text-lg font-bold text-gray-900">Roles we are hiring for</h2>
               </div>
               <div className="flex flex-wrap gap-2">
                 {uniqueJobTitles.map((title) => (
                   <span 
                     key={title} 
                     className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200"
                   >
                     {title}
                   </span>
                 ))}
               </div>
             </div>
           )}

           {/* All Open Positions */}
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
             <h2 className="text-lg font-bold text-gray-900 mb-4">
               Open Positions <span className="text-gray-500 font-normal text-base ml-1">({companyJobs.length})</span>
             </h2>
             
             {companyJobs.length > 0 ? (
               <div className="space-y-4">
                 {companyJobs.map(job => (
                   <div key={job.id} className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                     <div className="space-y-1 flex-1">
                       <h3 
                         className="font-semibold text-blue-600 hover:underline cursor-pointer text-base"
                         onClick={() => onJobClick && onJobClick(job)}
                       >
                         {job.title}
                       </h3>
                       <div className="text-sm text-gray-900">
                         {job.location} ({job.type})
                       </div>
                       
                       <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1.5">
                             <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                             {job.experienceLevel}
                          </span>
                          {job.salaryRange && (
                             <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs font-medium border border-green-100">
                                  <DollarSign className="w-3 h-3" />
                                  {job.salaryRange}
                             </span>
                          )}
                       </div>
     
                       <div className="text-xs text-gray-400 mt-2 pt-1">
                         Posted {job.postedTime} • {job.applicants} applicants
                       </div>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row gap-2 ml-4">
                       <button 
                         onClick={(e) => toggleSaveJob(e, job.id)}
                         className={`px-4 py-1.5 font-semibold border rounded-full transition-colors text-sm whitespace-nowrap ${
                           savedJobs.has(job.id) 
                             ? 'border-blue-600 text-blue-600 bg-blue-50'
                             : 'border-gray-400 text-gray-600 hover:bg-gray-50'
                         }`}
                       >
                         {savedJobs.has(job.id) ? 'Saved' : 'Save'}
                       </button>
                       <button className="px-4 py-1.5 text-blue-600 font-semibold border border-blue-600 rounded-full hover:bg-blue-50 transition-colors text-sm whitespace-nowrap">
                         Apply
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="text-gray-500 text-sm">No open positions at the moment.</div>
             )}
           </div>
        </>
      )}

      {/* --- Tab Content: ABOUT --- */}
      {activeTab === 'about' && (
         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About {company.name}</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">
               {company.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-6">
               <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Website</h3>
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                     {company.website}
                  </a>
               </div>
               <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Industry</h3>
                  <p className="text-gray-700 text-sm">{company.industry}</p>
               </div>
               <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Headquarters</h3>
                  <p className="text-gray-700 text-sm">{company.headquarters}</p>
               </div>
               <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Company size</h3>
                  <p className="text-gray-700 text-sm">10,001+ employees</p>
               </div>
            </div>
         </div>
      )}

      {/* --- Tab Content: PEOPLE --- */}
      {activeTab === 'people' && (
         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">People</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-center">
                  <h3 className="text-2xl font-bold text-gray-900">{company.followers.toLocaleString()}</h3>
                  <p className="text-sm text-gray-600">Employees on SemiLink</p>
               </div>
               <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 text-center">
                  <h3 className="text-2xl font-bold text-gray-900">42</h3>
                  <p className="text-sm text-gray-600">Friends work here</p>
               </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mt-6 mb-4">People you may know</h3>
            <div className="space-y-4">
               {MOCK_SUGGESTIONS.slice(0, 3).map(person => (
                  <div key={person.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                     <div className="flex items-center gap-3">
                        <img src={person.avatarUrl} alt={person.name} className="w-12 h-12 rounded-full object-cover" />
                        <div>
                           <h4 className="font-bold text-gray-900">{person.name}</h4>
                           <p className="text-xs text-gray-500">{person.headline}</p>
                        </div>
                     </div>
                     <button className="px-4 py-1.5 rounded-full border border-blue-600 text-blue-600 text-sm font-semibold hover:bg-blue-50">
                        Connect
                     </button>
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );
};

export default CompanyProfile;
