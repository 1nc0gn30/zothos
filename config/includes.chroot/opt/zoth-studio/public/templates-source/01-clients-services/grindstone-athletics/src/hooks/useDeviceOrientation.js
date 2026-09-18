import { useState, useEffect } from 'react';

const useDeviceOrientation = () => {
  const [orientation, setOrientation] = useState({ alpha: 0, beta: 0, gamma: 0 });

  useEffect(() => {
    const handleMotionEvent = (event) => {
      setOrientation({
        alpha: event.rotationRate.alpha, // Rotation around z-axis
        beta: event.rotationRate.beta,   // Rotation around x-axis
        gamma: event.rotationRate.gamma  // Rotation around y-axis
      });
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotionEvent);
    } else {
      console.error('DeviceMotionEvent is not supported by your browser.');
    }

    return () => {
      if (window.DeviceMotionEvent) {
        window.removeEventListener('devicemotion', handleMotionEvent);
      }
    };
  }, []);

  return orientation;
};

export default useDeviceOrientation;
