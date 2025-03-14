import React from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter } from 'react-icons/fi';

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  filters: string[];
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
  filters,
}) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-12 w-full md:w-96"
        />
      </div>
      
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-thin">
        <div className="flex items-center gap-2 text-white/50">
          <FiFilter />
          <span className="text-sm">Filters:</span>
        </div>
        {filters.map((filter) => (
          <motion.button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
              ${activeFilter === filter 
                ? 'bg-primary text-white' 
                : 'bg-secondary/50 text-white/70 hover:bg-secondary'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilter; 