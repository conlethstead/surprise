import React, { useState, useEffect, useMemo } from 'react';
import { Heart, Calendar, Award, Star, Camera, MapPin, Trophy, Clock } from 'lucide-react';
import './AnniversaryCountdown.css';

interface AnniversaryCountdownProps {
  relationshipStart: string; // Format: "YYYY-MM-DD"
  totalMemories?: number;
  totalPhotos?: number;
  totalLocations?: number;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const AnniversaryCountdown: React.FC<AnniversaryCountdownProps> = ({ 
  relationshipStart, 
  totalMemories = 0, 
  totalPhotos = 0, 
  totalLocations = 0 
}) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextAnniversary, setNextAnniversary] = useState<Date | null>(null);
  const [monthsLived, setMonthsLived] = useState<number>(0);
  const [daysLived, setDaysLived] = useState<number>(0);

  useEffect(() => {
    const calculateNextAnniversary = () => {
      const startDate = new Date(relationshipStart);
      const now = new Date();
      
      const yearsDiff = now.getFullYear() - startDate.getFullYear();
      const monthsDiff = now.getMonth() - startDate.getMonth();
      const totalMonths = yearsDiff * 12 + monthsDiff + (now.getDate() >= startDate.getDate() ? 1 : 0);
      setMonthsLived(totalMonths);

      // Calculate days lived together
      const daysDifference = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      setDaysLived(daysDifference);

      // Find next monthly anniversary (15th of each month based on April 15th start)
      const nextMonth = new Date(now.getFullYear(), now.getMonth(), 15);
      
      // If we've passed the 15th this month, go to next month
      if (now.getDate() > 15) {
        nextMonth.setMonth(nextMonth.getMonth() + 1);
      }
      
      // If today is the 15th, go to next month
      if (now.getDate() === 15) {
        nextMonth.setMonth(nextMonth.getMonth() + 1);
      }

      return nextMonth;
    };

    const updateCountdown = () => {
      const nextAnniversaryDate = calculateNextAnniversary();
      setNextAnniversary(nextAnniversaryDate);

      const now = new Date();
      const difference = nextAnniversaryDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeRemaining({ days, hours, minutes, seconds });
      }
    };

    // Initial calculation
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [relationshipStart]);

  // Achievement badges calculation
  const achievements = useMemo(() => {
    return [
      {
        id: 'week',
        icon: Clock,
        title: '1 Week',
        description: 'First week together',
        achieved: daysLived >= 7,
        progress: Math.min(daysLived / 7, 1)
      },
      {
        id: 'month',
        icon: Calendar,
        title: '1 Month',
        description: 'One month milestone',
        achieved: monthsLived >= 1,
        progress: Math.min(monthsLived / 1, 1)
      },
      {
        id: 'sixmonths',
        icon: Heart,
        title: '6 Months',
        description: 'Half year together',
        achieved: monthsLived >= 6,
        progress: Math.min(monthsLived / 6, 1)
      },
      {
        id: 'oneyear',
        icon: Trophy,
        title: '1 Year',
        description: 'One year anniversary',
        achieved: monthsLived >= 12,
        progress: Math.min(monthsLived / 12, 1)
      },
      {
        id: 'memories100',
        icon: Star,
        title: '100 Memories',
        description: 'Century of memories',
        achieved: totalMemories >= 100,
        progress: Math.min(totalMemories / 100, 1)
      },
      {
        id: 'photos50',
        icon: Camera,
        title: '50 Photos',
        description: 'Picture perfect moments',
        achieved: totalPhotos >= 50,
        progress: Math.min(totalPhotos / 50, 1)
      },
      {
        id: 'locations25',
        icon: MapPin,
        title: '25 Places',
        description: 'Adventures together',
        achieved: totalLocations >= 25,
        progress: Math.min(totalLocations / 25, 1)
      },
      {
        id: 'days100',
        icon: Award,
        title: '100 Days',
        description: 'Three months strong',
        achieved: daysLived >= 100,
        progress: Math.min(daysLived / 100, 1)
      }
    ];
  }, [daysLived, monthsLived, totalMemories, totalPhotos, totalLocations]);

  if (!nextAnniversary) return null;

  const nextAnniversaryDate = nextAnniversary.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="anniversary-countdown">
      <div className="countdown-header">
        <Heart className="countdown-heart" size={24} />
        <h2>Next Anniversary</h2>
        <Heart className="countdown-heart" size={24} />
      </div>
      
      <div className="countdown-info">
        <div className="months-together">
          <span className="months-number">{monthsLived}</span>
          <span className="months-label">Months Together</span>
        </div>
        
        <div className="next-date">
          <Calendar size={16} />
          <span>{nextAnniversaryDate}</span>
        </div>
      </div>

      <div className="countdown-timer">
        <div className="time-unit">
          <span className="time-number">{timeRemaining.days}</span>
          <span className="time-label">Days</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-unit">
          <span className="time-number">{timeRemaining.hours.toString().padStart(2, '0')}</span>
          <span className="time-label">Hours</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-unit">
          <span className="time-number">{timeRemaining.minutes.toString().padStart(2, '0')}</span>
          <span className="time-label">Minutes</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-unit">
          <span className="time-number">{timeRemaining.seconds.toString().padStart(2, '0')}</span>
          <span className="time-label">Seconds</span>
        </div>
      </div>

      <div className="achievement-badges">
        <h3 className="badges-title">
          <Award size={18} />
          Relationship Achievements
        </h3>
        <div className="badges-grid">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <div 
                key={achievement.id} 
                className={`achievement-badge ${achievement.achieved ? 'achieved' : 'locked'}`}
                title={achievement.description}
              >
                <IconComponent size={16} className="badge-icon" />
                <span className="badge-title">{achievement.title}</span>
                {!achievement.achieved && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${achievement.progress * 100}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="countdown-message">
        <p>Until we celebrate another month of love! 💕</p>
      </div>
    </div>
  );
};

export default AnniversaryCountdown;