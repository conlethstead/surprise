import React, { useEffect, useState } from 'react';
import './FloatingSparkles.css';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  animationDuration: number;
  delay: number;
}

const FloatingSparkles: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = [];
      const sparkleCount = 25; // Number of sparkles

      for (let i = 0; i < sparkleCount; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100, // Random position across screen width (%)
          y: Math.random() * 100, // Random position across screen height (%)
          size: Math.random() * 6 + 4, // Random size between 4-10px
          animationDuration: Math.random() * 10 + 8, // Random duration between 8-18s
          delay: Math.random() * 5, // Random delay between 0-5s
        });
      }

      setSparkles(newSparkles);
    };

    generateSparkles();

    // Regenerate sparkles occasionally for variety
    const interval = setInterval(generateSparkles, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="floating-sparkles">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDuration: `${sparkle.animationDuration}s`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};

export default FloatingSparkles;