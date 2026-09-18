// FloatingButton.jsx
export default function FloatingButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href="tel:+17576670064"
        className="bg-[#bfa06f] hover:bg-[#967d4e] text-white p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse flex items-center justify-center"
        aria-label="Call Nature Harmony Landscaping"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
    </div>
  );
}
