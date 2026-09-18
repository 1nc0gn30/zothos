import React from 'react';

type LottieWatermarkProps = {
  src: string;
  className?: string;
};

export default function LottieWatermark({ src, className = '' }: LottieWatermarkProps) {
  return React.createElement('lottie-player', {
    src,
    background: 'transparent',
    speed: '0.65',
    loop: true,
    autoplay: true,
    'aria-hidden': true,
    class: `lottie-watermark ${className}`,
  });
}
