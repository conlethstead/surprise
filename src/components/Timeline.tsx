import React, { useState, useMemo } from 'react';
import { TimelineData } from '../types/timeline';
import TimelineEntry from './TimelineEntry';
import MonthlyRecapCard from './MonthlyRecapCard';
import AnniversaryCountdown from './AnniversaryCountdown';
import { getPhotosFromDateFolder } from '../utils/photoUtils';
import { format, getMonth, getYear, parseISO } from 'date-fns';
import { Heart, Calendar, ChevronDown } from 'lucide-react';
import './Timeline.css';

interface TimelineProps {
  data: TimelineData;
}

const Timeline: React.FC<TimelineProps> = ({ data }) => {
  const currentDate = new Date();
  const currentMonthYear = `${getYear(currentDate)}-${getMonth(currentDate)}`;
  
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const sortedEntries = [...data.entries].sort((a, b) => 
    parseISO(a.date).getTime() - parseISO(b.date).getTime()
  );

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    sortedEntries.forEach(entry => {
      const date = parseISO(entry.date);
      const monthYear = `${getYear(date)}-${getMonth(date)}`;
      const monthLabel = format(date, 'MMMM yyyy');
      months.add(`${monthYear}|${monthLabel}`);
    });
    
    return Array.from(months)
      .map(item => {
        const [value, label] = item.split('|');
        return { value, label };
      })
      .sort((a, b) => {
        const [yearA, monthA] = a.value.split('-').map(Number);
        const [yearB, monthB] = b.value.split('-').map(Number);
        return yearA !== yearB ? yearA - yearB : monthA - monthB;
      });
  }, [sortedEntries]);

  const filteredEntries = useMemo(() => {
    if (selectedMonth === 'all') return sortedEntries;
    
    return sortedEntries.filter(entry => {
      const date = parseISO(entry.date);
      const entryMonthYear = `${getYear(date)}-${getMonth(date)}`;
      return entryMonthYear === selectedMonth;
    });
  }, [sortedEntries, selectedMonth]);

  // Calculate total photos using the photo utility
  const totalPhotos = useMemo(() => {
    return data.entries.reduce((total, entry) => {
      const photos = entry.photos && entry.photos.length > 0 
        ? entry.photos 
        : getPhotosFromDateFolder(entry.date);
      return total + photos.length;
    }, 0);
  }, [data.entries]);

  // Get monthly recap for the currently selected month
  const currentMonthRecap = useMemo(() => {
    if (selectedMonth === 'all' || !data.monthlyRecaps) return null;
    
    return data.monthlyRecaps.find(recap => recap.monthYear === selectedMonth);
  }, [selectedMonth, data.monthlyRecaps]);

  // Get the favorite entry for the recap
  const favoriteEntry = useMemo(() => {
    if (!currentMonthRecap) return null;
    
    return sortedEntries.find(entry => entry.id === currentMonthRecap.favoriteDate.entryId);
  }, [currentMonthRecap, sortedEntries]);

  const startDate = format(parseISO(data.relationshipStart), 'MMMM do, yyyy');

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h1 className="timeline-main-title">
          <span className="title-heart-emoji">💕</span>
          Our Love Story
          <span className="title-heart-emoji">💕</span>
        </h1>
        <p className="timeline-subtitle">
          {data.names.person1} & {data.names.person2}
        </p>
        <div className="timeline-start-date">
          <div className="start-date-decorative">
            <span className="start-date-flourish">✦</span>
            <span className="start-date-text">Together since</span>
            <span className="start-date-flourish">✦</span>
          </div>
          <div className="start-date-main">{startDate}</div>
        </div>
      </div>

      {/* Anniversary Countdown */}
      <AnniversaryCountdown 
        relationshipStart={data.relationshipStart}
        totalMemories={data.entries.length}
        totalPhotos={totalPhotos}
        totalLocations={new Set(data.entries.map(entry => entry.location).filter(Boolean)).size}
      />

      {/* Month Filter */}
      <div className="month-filter">
        <div className="filter-container">
          <Calendar className="filter-icon" size={20} />
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="month-dropdown"
          >
            <option value="all">All Memories</option>
            {availableMonths.map(month => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <ChevronDown className="dropdown-arrow" size={16} />
        </div>
        
        {selectedMonth !== 'all' && (
          <p className="filter-info">
            Showing {filteredEntries.length} {filteredEntries.length === 1 ? 'memory' : 'memories'} from{' '}
            {availableMonths.find(m => m.value === selectedMonth)?.label}
          </p>
        )}
      </div>

      <div className="timeline">
        {filteredEntries.length > 0 ? (
          <>
            {filteredEntries.map((entry, index) => (
              <TimelineEntry 
                key={entry.id} 
                entry={entry} 
                isLeft={index % 2 === 0}
              />
            ))}
            
            {/* Show monthly recap if viewing a specific month and recap exists */}
            {selectedMonth !== 'all' && currentMonthRecap && (
              <MonthlyRecapCard
                recap={currentMonthRecap}
                favoriteEntry={favoriteEntry || undefined}
                monthLabel={availableMonths.find(m => m.value === selectedMonth)?.label || ''}
              />
            )}
          </>
        ) : (
          <div className="no-memories">
            <Heart className="no-memories-icon" />
            <p>No memories found for this month</p>
            <p className="no-memories-subtitle">Try selecting a different month or "All Memories"</p>
          </div>
        )}
      </div>

      <div className="timeline-footer">
        <div className="timeline-end-dot">
          <Heart className="end-heart" />
        </div>
        <p className="timeline-end-message">
          And our story continues... ❤️
        </p>
      </div>
    </div>
  );
};

export default Timeline;