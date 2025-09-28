import React, { useState } from 'react';
import { TimelineEntry as TimelineEntryType } from '../types/timeline';
import { format, parseISO } from 'date-fns';
import { Heart, MapPin, Music, Film, Smile, Calendar, Camera, X, ChevronLeft, ChevronRight, Plane, Star, Activity } from 'lucide-react';
import './TimelineEntry.css';

interface TimelineEntryProps {
  entry: TimelineEntryType;
  isLeft: boolean; // For alternating layout
}

const TimelineEntry: React.FC<TimelineEntryProps> = ({ entry, isLeft }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const formattedDate = format(parseISO(entry.date), 'MMMM do, yyyy');
  const categoryIcons = {
    date: <Heart className="category-icon" />,
    milestone: <Heart className="category-icon" />,
    trip: <MapPin className="category-icon" />,
    celebration: <Heart className="category-icon" />,
    everyday: <Smile className="category-icon" />,
    special: <Heart className="category-icon" />,
    vacation: <Plane className="category-icon" />
  };

  const nextPhoto = () => {
    if (entry.photos && selectedPhoto !== null) {
      setSelectedPhoto((selectedPhoto + 1) % entry.photos.length);
    }
  };

  const prevPhoto = () => {
    if (entry.photos && selectedPhoto !== null) {
      setSelectedPhoto(selectedPhoto === 0 ? entry.photos.length - 1 : selectedPhoto - 1);
    }
  };

  return (
    <div className={`timeline-entry ${isLeft ? 'left' : 'right'} ${entry.category === 'vacation' ? 'vacation-entry' : ''}`}>
      <div className="timeline-dot">
        {categoryIcons[entry.category || 'special']}
      </div>
      
      <div className="timeline-content">
        <div className="timeline-header">
          <h3 className="timeline-title">{entry.title}</h3>
          <div className="timeline-date">
            <Calendar size={16} />
            {formattedDate}
          </div>
        </div>

        {entry.location && (
          <div className="timeline-location">
            <MapPin size={16} />
            {entry.location}
          </div>
        )}

        {entry.description && (
          <p className="timeline-description">{entry.description}</p>
        )}

        {/* Vacation-specific sections */}
        {entry.category === 'vacation' && entry.duration && (
          <div className="vacation-duration">
            <Calendar size={16} />
            <span>{entry.duration}</span>
            {entry.endDate && (
              <span className="vacation-dates">
                {format(parseISO(entry.date), 'MMM do')} - {format(parseISO(entry.endDate), 'MMM do, yyyy')}
              </span>
            )}
          </div>
        )}

        {entry.highlights && entry.highlights.length > 0 && (
          <div className={`timeline-section ${entry.category === 'vacation' ? 'vacation-highlights' : 'highlights-section'}`}>
            <h4><Star size={18} /> {entry.category === 'vacation' ? 'Vacation Highlights' : 'Highlights'}</h4>
            <ul className="timeline-list highlights-list">
              {entry.highlights.map((highlight, index) => (
                <li key={index} className="highlight-item">{highlight}</li>
              ))}
            </ul>
          </div>
        )}

        {entry.activities && entry.activities.length > 0 && (
          <div className="timeline-section vacation-activities">
            <h4><Activity size={18} /> Activities</h4>
            <div className="activities-grid">
              {entry.activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  {activity}
                </div>
              ))}
            </div>
          </div>
        )}

        {entry.memories && entry.memories.length > 0 && (() => {
          // Filter out memories that are already shown as highlights
          const filteredMemories = entry.highlights && entry.highlights.length > 0
            ? entry.memories.filter(memory => !entry.highlights!.includes(memory))
            : entry.memories;
          
          return filteredMemories.length > 0 && (
            <div className="timeline-section">
              <h4>💭 Memories</h4>
              <ul className="timeline-list">
                {filteredMemories.map((memory, index) => (
                  <li key={index}>{memory}</li>
                ))}
              </ul>
            </div>
          );
        })()}

        {entry.songs && entry.songs.length > 0 && (
          <div className="timeline-section">
            <h4><Music size={18} /> Songs</h4>
            <div className="timeline-items">
              {entry.songs.map((song, index) => (
                <div key={index} className="timeline-item">
                  <strong>"{song.title}"</strong> by {song.artist}
                  {song.note && <em className="item-note">{song.note}</em>}
                </div>
              ))}
            </div>
          </div>
        )}

        {entry.movies && entry.movies.length > 0 && (
          <div className="timeline-section">
            <h4><Film size={18} /> Movies</h4>
            <div className="timeline-items">
              {entry.movies.map((movie, index) => (
                <div key={index} className="timeline-item">
                  <strong>{movie.title}</strong>
                  {movie.year && <span className="movie-year"> ({movie.year})</span>}
                  {movie.note && <em className="item-note">{movie.note}</em>}
                </div>
              ))}
            </div>
          </div>
        )}

        {entry.jokes && entry.jokes.length > 0 && (
          <div className="timeline-section">
            <h4>😄 Jokes & Funny Moments</h4>
            <div className="timeline-items">
              {entry.jokes.map((joke, index) => (
                <div key={index} className="timeline-joke">
                  {joke}
                </div>
              ))}
            </div>
          </div>
        )}

        {entry.photos && entry.photos.length > 0 && (
          <div className="timeline-section">
            <h4><Camera size={18} /> Photos</h4>
            <div className="photo-gallery">
              {entry.photos.map((photo, index) => (
                <div 
                  key={index} 
                  className="photo-thumbnail"
                  onClick={() => setSelectedPhoto(index)}
                >
                  <img 
                    src={photo} 
                    alt={`Memory ${index + 1}`}
                    className="thumbnail-image" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {entry.videos && entry.videos.length > 0 && (
          <div className="timeline-section">
            <h4><Camera size={18} /> Videos</h4>
            <div className="video-gallery">
              {entry.videos.map((video, index) => (
                <div key={index} className="video-container">
                  <video 
                    controls
                    className="timeline-video"
                    preload="metadata"
                  >
                    <source src={video} type="video/mp4" />
                    <source src={video} type="video/webm" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto !== null && entry.photos && (
        <div className="photo-modal" onClick={() => setSelectedPhoto(null)}>
          <div className="photo-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="photo-modal-close"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={24} />
            </button>
            
            {entry.photos.length > 1 && (
              <>
                <button 
                  className="photo-nav photo-nav-prev"
                  onClick={prevPhoto}
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  className="photo-nav photo-nav-next"
                  onClick={nextPhoto}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            
            <img 
              src={entry.photos[selectedPhoto]} 
              alt={`Memory ${selectedPhoto + 1}`}
              className="photo-modal-image" 
            />
            
            <div className="photo-counter">
              {selectedPhoto + 1} of {entry.photos.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineEntry;