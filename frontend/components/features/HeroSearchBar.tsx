"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Home, MapPin } from "lucide-react";
import Link from "next/link";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", 
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", 
  "Taraba", "Yobe", "Zamfara"
];

const POPULAR_STATES = ["Lagos", "FCT - Abuja", "Rivers"];

export function HeroSearchBar() {
  const [query, setQuery] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredStates = query.trim() === "" 
    ? POPULAR_STATES 
    : NIGERIAN_STATES.filter(state => state.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative w-full max-w-xl" ref={wrapperRef}>
      <div 
        className={`w-full bg-white p-2 rounded-2xl sm:rounded-full shadow-2xl transition-all border-2 flex flex-col sm:flex-row items-center gap-2 ${
          isFocused 
            ? "border-olive shadow-[0_0_20px_rgba(107,122,58,0.15)]" 
            : "border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.05)]"
        }`}
      >
        <div className="flex-1 flex items-center px-4 w-full sm:w-auto relative">
          <Search className={`h-5 w-5 mr-3 shrink-0 transition-colors ${isFocused ? "text-olive" : "text-gray-400"}`} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Where do you want to live?" 
            className="w-full bg-transparent border-none focus:ring-0 text-charcoal placeholder:text-gray-400 py-3 outline-none focus-visible:outline-none"
            style={{ outline: 'none' }} // Ensure no fallback outline appears
          />
          
          {/* Dropdown Menu */}
          {isFocused && (
            <div className="absolute top-full left-0 sm:-left-4 mt-4 w-full sm:w-[120%] bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50 py-2">
              {filteredStates.length > 0 ? (
                <ul className="max-h-64 overflow-y-auto">
                  {query.trim() === "" && (
                    <li className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Popular Locations
                    </li>
                  )}
                  {filteredStates.map(state => (
                    <li key={state}>
                      <button
                        type="button"
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors text-charcoal"
                        onClick={() => {
                          setQuery(state);
                          setIsFocused(false);
                        }}
                      >
                        <MapPin className="h-4 w-4 text-gray-400" />
                        {state}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-4 text-sm text-gray-500 flex items-center justify-center">
                  No states found matching "{query}"
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="hidden sm:block h-8 w-px bg-gray-200"></div>
        
        <div className="flex-1 px-4 w-full sm:w-auto hidden sm:flex items-center">
          <Home className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
          <select 
            className="w-full bg-transparent border-none focus:ring-0 text-charcoal outline-none py-3 cursor-pointer focus-visible:outline-none"
            style={{ outline: 'none' }}
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Property Type</option>
            <option value="room">Room Share</option>
            <option value="apartment">Full Apartment</option>
          </select>
        </div>
        
        <Link 
          href={`/search?location=${encodeURIComponent(query)}&type=${encodeURIComponent(propertyType)}`}
          className="w-full sm:w-auto flex-shrink-0 bg-gray-100 text-charcoal rounded-xl sm:rounded-full px-8 py-3.5 font-semibold transition-all hover:shadow-[0_4px_15px_rgba(107,122,58,0.3)] flex items-center justify-center hover:bg-olive hover:text-white"
        >
          Search
        </Link>
      </div>
    </div>
  );
}
