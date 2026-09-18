import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "h-8 w-auto" }) => (
  <img 
    src="/757-Gas-Logo-Nav.png" 
    alt="757 Gas Shop" 
    className={`object-contain ${className}`}
    draggable={false}
  />
);

export default Logo;
