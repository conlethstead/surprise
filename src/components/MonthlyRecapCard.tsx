import React from 'react';
import { MonthlyRecap, TimelineEntry } from '../types/timeline';
import { format, parseISO } from 'date-fns';
import { Star, Heart, Sparkles } from 'lucide-react';
import './MonthlyRecapCard.css';

interface MonthlyRecapCardProps {
  recap: MonthlyRecap;
  favoriteEntry: TimelineEntry | undefined;
  monthLabel: string;
}

const MonthlyRecapCard: React.FC<MonthlyRecapCardProps> = ({ 
  recap, 
  favoriteEntry, 
  monthLabel 
}) => {
  return (
    <div className="monthly-recap-card">
      <div className="recap-header">
        <div className="recap-title">
          <Sparkles className="recap-icon" />
          <h3>{monthLabel} Recap</h3>
          <Sparkles className="recap-icon" />
        </div>
      </div>

      <div className="recap-content">
        <div className="recap-summary">
          <p>{recap.summary}</p>
        </div>

        {favoriteEntry && (
          <div className="favorite-date">
            <div className="favorite-header">
              <Star className="favorite-icon" />
              <h4>Favorite Date of the Month</h4>
            </div>
            <div className="favorite-details">
              <div className="favorite-title">
                <strong>{favoriteEntry.title}</strong>
                <span className="favorite-date-text">
                  {format(parseISO(favoriteEntry.date), 'MMMM do')}
                </span>
              </div>
              <p className="favorite-reason">
                <Heart size={16} className="heart-icon" />
                {recap.favoriteDate.reason}
              </p>
            </div>
          </div>
        )}

        {recap.monthHighlights && recap.monthHighlights.length > 0 && (
          <div className="month-highlights">
            <h5>Month Highlights</h5>
            <ul>
              {recap.monthHighlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyRecapCard;