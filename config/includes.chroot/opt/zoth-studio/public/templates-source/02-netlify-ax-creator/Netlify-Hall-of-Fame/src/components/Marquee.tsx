export default function Marquee() {
  const text = "100WEBSITESIN30DAYS CHALLENGE COMPLETE // MISSION ACCOMPLISHED // THANK YOU NETLIFY // SHIPPED IN THE FLOW STATE // ";
  
  return (
    <div className="w-full bg-netlify/10 border-y border-netlify/30 py-2.5 overflow-hidden sticky top-0 z-50 backdrop-blur-md">
      <div className="marquee font-mono text-xs md:text-sm tracking-[0.2em] text-netlify">
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
      </div>
    </div>
  );
}
