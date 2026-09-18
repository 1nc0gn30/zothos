import React, { ReactNode } from 'react';
import { soundManager } from '../../utils/soundEffects';

interface CourseCardProps {
  key?: React.Key;
  icon: ReactNode;
  title: string;
  desc: string;
  courses: string[];
}

export function CourseCard({ icon, title, desc, courses }: CourseCardProps) {
  return (
    <div 
      onMouseEnter={() => soundManager.playHover()}
      className="group border border-university-navy/10 p-8 hover:bg-university-navy transition-colors duration-500 rounded-none bg-university-paper/50 h-full flex flex-col shadow-xs hover:shadow-2xl"
    >
      <div className="text-university-crimson group-hover:text-university-gold transition-colors duration-500 mb-6">
        {icon}
      </div>
      <h3 className="font-serif text-2xl font-medium mb-3 text-university-navy group-hover:text-white transition-colors duration-500">{title}</h3>
      <p className="text-university-navy/60 group-hover:text-white/70 mb-8 leading-relaxed font-light transition-colors duration-500 flex-grow">
        {desc}
      </p>
      
      <div className="border-t border-university-navy/10 group-hover:border-white/10 pt-6 transition-colors duration-500">
        <h4 className="text-xs uppercase tracking-widest font-bold mb-4 text-university-navy group-hover:text-white/80 transition-colors duration-500">Core Modules</h4>
        <ul className="space-y-3">
          {courses.map((course, i) => (
            <li key={i} className="text-sm font-medium text-university-navy/80 group-hover:text-white/70 transition-colors duration-500 flex items-start gap-2">
              <span className="text-university-crimson group-hover:text-university-gold mt-1 text-[10px]" aria-hidden="true">■</span>
              {course}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function TestimonialCard({ quote, author, classYear }: { quote: string, author: string, classYear: string }) {
  return (
    <div 
      onMouseEnter={() => soundManager.playHover()}
      className="min-w-[300px] md:min-w-[400px] bg-white p-8 border border-university-navy/10 shadow-md hover:shadow-xl transition-shadow snap-center"
    >
      <div className="font-serif text-6xl text-university-gold/40 leading-none h-8 select-none" aria-hidden="true">"</div>
      <p className="font-serif text-lg md:text-xl text-university-navy italic mb-8 mt-2 leading-relaxed font-light">
        {quote}
      </p>
      <div>
        <div className="font-bold text-university-navy uppercase tracking-widest text-sm">{author}</div>
        <div className="text-university-crimson text-sm mt-1 font-semibold">{classYear}</div>
      </div>
    </div>
  )
}
