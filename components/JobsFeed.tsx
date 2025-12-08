
import React, { useState, useMemo } from 'react';
import { Search, MapPin, Clock, Briefcase, Filter, ChevronDown, CheckCircle, Bookmark, Layers, BarChart2 } from 'lucide-react';
import { MOCK_JOBS } from '../constants';
import { Job, JobExperience, JobIndustry, JobLocationType, JobFunction, JobSeniority } from '../types';

interface JobsFeedProps {
  onCompanyClick: (companyName: string) => void;
  onJobClick?: (job: Job) => void;
  appliedJobs: Set<string>;
  onApplyJob: (jobId: string) => void;
}

const JobsFeed: React.FC<JobsFeedProps> = ({ onCompanyClick, onJobClick, appliedJobs, onApplyJob }) => {
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
        job.requirements?.some(req => req.toLowerCase().includes(query));
      
      const matchesIndustry = filters.industry === 'All' || job.industry === filters.industry;
      const matchesExperience = filters.experience === 'All' || job.experienceLevel === filters.experience;
      const matchesLocation = filters.locationType === 'All' || job.type === filters.locationType;
      const matchesFunction = filters.jobFunction === 'All' || job.jobFunction === filters.jobFunction;
      const matchesSeniority = filters.seniority === 'All' || job.seniority === filters.seniority;

      return matchesSearch && matchesIndustry && matchesExperience && matchesLocation && matchesFunction && matchesSeniority;
    });
  }, [searchQuery, filters]);

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

  const handleApplyClick = (e: React.MouseEvent, jobId: string) => {
    e.stopPropagation();
    onApplyJob(jobId);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-semi-500 focus:border-semi-500 sm:text-sm"
            placeholder="Search by title, skill, or company"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterDropdown 
            label="Industry" 
            value={filters.industry} 
            options={['All', 'Fab Manufacturing', 'IC Design', 'EDA / Software', 'Equipment', 'Semiconductor Materials']}
            onChange={(val) => setFilters({...filters, industry: val as any})}
          />
          <FilterDropdown 
            label="Experience" 
            value={filters.experience} 
            options={['All', 'Entry Level', 'Mid-Senior', 'Director', 'Executive']}
            onChange={(val) => setFilters({...filters, experience: val as any})}
          />
          <FilterDropdown 
            label="Location" 
            value={filters.locationType} 
            options={['All', 'On-site', 'Hybrid', 'Remote']}
            onChange={(val) => setFilters({...filters, locationType: val as any})}
          />
          <FilterDropdown 
            label="Function" 
            value={filters.jobFunction} 
            options={['All', 'Engineering', 'Research', 'Operations', 'Product Management', 'Sales', 'Marketing']}
            onChange={(val) => setFilters({...filters, jobFunction: val as any})}
          />
           <FilterDropdown 
            label="Seniority" 
            value={filters.seniority} 
            options={['All', 'Intern', 'Junior', 'Senior', 'Lead', 'Principal', 'Manager']}
            onChange={(val) => setFilters({...filters, seniority: val as any})}
          />
        </div>
      </div>

      {/* Job List */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">
          {searchQuery || Object.values(filters).some(v => v !== 'All') 
            ? `Search Results (${filteredJobs.length})` 
            : 'Recommended for you'}
        </h2>
        
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => {
            const isApplied = appliedJobs.has(job.id);
            return (
              <div 
                key={job.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow cursor-pointer relative"
                onClick={() => onJobClick && onJobClick(job)}
              >
                <div className="flex gap-4">
                  <img 
                    src={job.companyLogo} 
                    alt={job.company} 
                    className="w-16 h-16 object-contain border border-gray-100 rounded-lg p-1 bg-white"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-blue-600 text-lg hover:underline mb-0.5">{job.title}</h3>
                        <p 
                          className="text-gray-900 font-medium text-sm hover:underline cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCompanyClick(job.company);
                          }}
                        >
                          {job.company}
                        </p>
                      </div>
                      <button 
                        onClick={(e) => toggleSaveJob(e, job.id)}
                        className={`p-2 rounded-full hover:bg-gray-100 ${savedJobs.has(job.id) ? 'text-blue-600' : 'text-gray-400'}`}
                      >
                        <Bookmark className={`w-5 h-5 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location} ({job.type})
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" /> {job.experienceLevel}
                      </span>
                      {job.jobFunction && (
                        <span className="flex items-center gap-1">
                          <Layers className="w-4 h-4" /> {job.jobFunction}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-green-700 font-medium">
                        <Clock className="w-4 h-4" /> {job.postedTime}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                      {isApplied ? (
                        <span className="flex items-center gap-1 text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                          <CheckCircle className="w-4 h-4" /> Applied
                        </span>
                      ) : (
                        <button 
                          onClick={(e) => handleApplyClick(e, job.id)}
                          className="px-4 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 transition-colors"
                        >
                          Easy Apply
                        </button>
                      )}
                      <span className="text-xs text-gray-500">
                        {job.applicants} applicants
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your filters or search query.</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  industry: 'All',
                  experience: 'All',
                  locationType: 'All',
                  jobFunction: 'All',
                  seniority: 'All'
                });
              }}
              className="mt-4 text-blue-600 font-semibold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const FilterDropdown: React.FC<{
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}> = ({ label, value, options, onChange }) => {
  return (
    <div className="relative group">
      <button className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
        value !== 'All' 
          ? 'bg-green-700 text-white border-transparent' 
          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
      }`}>
        {label}: {value} <ChevronDown className="w-3 h-3" />
      </button>
      
      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block z-20">
        <div className="py-1 max-h-60 overflow-y-auto">
          {options.map(opt => (
            <div 
              key={opt}
              onClick={() => onChange(opt)}
              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${value === opt ? 'font-bold text-semi-700' : 'text-gray-700'}`}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobsFeed;
