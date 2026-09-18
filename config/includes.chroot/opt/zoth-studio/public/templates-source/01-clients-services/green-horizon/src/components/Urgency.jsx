import { useEffect, useState, useCallback } from 'react';

function Countdown({ targetDate }) {
  const getTimeRemaining = useCallback(() => {
    const total = Date.parse(targetDate) - Date.now();
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return { total, days, hours, minutes };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, [getTimeRemaining]);

  if (timeLeft.total <= 0) return null;

  return (
    <div className="flex justify-center gap-6 text-white mb-6">
      <div className="text-center">
        <div className="text-3xl font-bold">{timeLeft.days}</div>
        <div className="text-sm uppercase tracking-wider">Days</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{timeLeft.hours}</div>
        <div className="text-sm uppercase tracking-wider">Hours</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{timeLeft.minutes}</div>
        <div className="text-sm uppercase tracking-wider">Minutes</div>
      </div>
    </div>
  );
}

export default function Urgency() {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 5);

  return (
    <section className="bg-gradient-to-r from-teal-700 to-teal-900 text-white py-16 px-6" id="offer">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-serif font-medium mb-4">Spring Refresh Special</h2>
        <p className="text-lg sm:text-xl mb-6">
          Book your landscaping project before this offer ends and get <span className="font-bold text-[#f0d99c]">20% OFF</span> any service over $500.
        </p>

        <Countdown targetDate={deadline} />

        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="bg-white/10 px-4 py-2 rounded-lg">
            <p className="text-2xl font-bold text-white">Only 12</p>
            <p className="text-sm">Spots Left This Month</p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg">
            <p className="text-2xl font-bold text-[#f0d99c]">FREE</p>
            <p className="text-sm">Design Consultation</p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-lg">
            <p className="text-2xl font-bold text-white">Same Week</p>
            <p className="text-sm">Service Available</p>
          </div>
        </div>

        <a
          href="#contact"
          className="bg-[#bfa06f] hover:bg-[#967d4e] text-white font-bold px-8 py-4 rounded-full text-lg shadow-md transition-colors"
        >
          Claim Your Discount Now
        </a>
      </div>
    </section>
  );
}
