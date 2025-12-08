
import React, { useState, useMemo } from 'react';
import { Search, MapPin, Clock, Briefcase, Filter, ChevronDown } from 'lucide-react';
import { MOCK_JOBS } from '../constants';
import { Job, JobExperience, JobIndustry, JobLocationType, JobFunction, JobSeniority } from '../types';

interface JobsFeedProps {
  onCompanyClick: (companyName: string) => void;
  onJobClick?: (job: Job) => void;
}

const JobsFeed: React.FC<JobsFeedProps> = ({ onCompanyClick, onJobClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    industry: 'All' as JobIndustry | 'All',
    experience: 'All' as JobExperience | 'All',
    locationType: 'All' as JobLocationType | 'All',
    jobFunction: 'All' as JobFunction | 'All',
    seniority: 'All' as JobSeniority | 'All',
  });

  const filteredJobs = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    return MOCK_JOBS.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        // Check if any requirement contains the search query
        job.requirements?.some(req => req.toLowerCase().includes(query));
      
      const matchesIndustry = filters.industry === 'All' || job.industry === filters.industry;
      const matchesExperience = filters.experience === 'All' || job.experienceLevel === filters.experience;
      const matchesLocation = filters.locationType === 'All' || job.type === filters.locationType;
      const matchesFunction = filters.jobFunction === 'All' || job.jobFunction === filters.jobFunction;
      const matchesSeniority = filters.seniority === 'All' || job.seniority === filters.seniority;

      return matchesSearch && matchesIndustry && matchesExperience && matchesLocation && matchesFunction && matchesSeniority;
    });
  }, [searchQuery, filters]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
      {/* Search and Filter Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Job Search</h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-semi-500 focus:border-semi-500 sm:text-sm"
            placeholder="Search by title, skill (e.g. Verilog, UVM), or company"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Industry</label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-8 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-semi-500 focus:border-semi-500 sm:text-sm rounded-md appearance-none bg-white"
                value={filters.industry}
                onChange={(e) => handleFilterChange('industry', e.target.value)}
              >
                <option value="All">All Industries</option>
                <option value="Fab Manufacturing">Fab Manufacturing</option>
                <option value="IC Design">IC Design</option>
                <option value="EDA / Software">EDA / Software</option>
                <option value="Equipment">Equipment</option>
                <option value="Semiconductor Materials">Semiconductor Materials</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Job Function</label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-8 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-semi-500 focus:border-semi-500 sm:text-sm rounded-md appearance-none bg-white"
                value={filters.jobFunction}
                onChange={(e) => handleFilterChange('jobFunction', e.target.value)}
              >
                <option value="All">All Functions</option>
                <option value="Engineering">Engineering</option>
                <option value="Research">Research</option>
                <option value="Operations">Operations</option>
                <option value="Product Management">Product Management</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Seniority Level</label>
            <div className="relative">
              <select
                className="block w-full pl-3 pr-8 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-semi-500 focus:border-semi-500 sm:text-sm rounded-md appearance-none bg-white"
                value={filters.seniority}
                onChange={(e) => handleFilterChange('seniority', e.target.value)}
              >
                <option value="All">All Seniority</option>
                <option value="Intern">Intern</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Principal">Principal</option>
                <option value="Manager">Manager</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Experience Level</label>
             <div className="relative">
              <select
                className="block w-full pl-3 pr-8 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-semi-500 focus:border-semi-500 sm:text-sm rounded-md appearance-none bg-white"
                value={filters.experience}
                onChange={(e) => handleFilterChange('experience', e.target.value)}
              >
                <option value="All">Any Experience</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid-Senior">Mid-Senior</option>
                <option value="Director">Director</option>
                <option value="Executive">Executive</option>
              </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-gray-700 mb-1">Location Type</label>
             <div className="relative">
              <select
                className="block w-full pl-3 pr-8 py-1.5 text-sm border border-gray-300 focus:outline-none focus:ring-semi-500 focus:border-semi-500 sm:text-sm rounded-md appearance-none bg-white"
                value={filters.locationType}
                onChange={(e) => handleFilterChange('locationType', e.target.value)}
              >
                <option value="All">Any Location</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-gray-600">
          Showing <strong>{filteredJobs.length}</strong> results
        </span>
      </div>

      {/* Job List */}
      <div className="space-y-3">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onJobClick && onJobClick(job)}
            >
              <div className="flex items-start gap-4">
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-12 h-12 rounded bg-white object-contain border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${job.company}&background=random`;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompanyClick(job.company);
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-blue-600 hover:underline">
                    {job.title}
                  </h3>
                  <div 
                    className="text-sm text-gray-900 mb-0.5 hover:underline cursor-pointer inline-block"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompanyClick(job.company);
                    }}
                  >
                    {job.company}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1 mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location} ({job.type})
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3" /> {job.postedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {job.applicants} applicants
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                        {job.industry}
                    </span>
                     {job.seniority && (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
                            {job.seniority}
                        </span>
                    )}
                  </div>
                </div>
                <button 
                  onClick={(e) => toggleSaveJob(e, job.id)}
                  className={`hidden sm:block px-4 py-1.5 font-semibold border rounded-full transition-colors text-sm ${
                    savedJobs.has(job.id)
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {savedJobs.has(job.id) ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsFeed;
