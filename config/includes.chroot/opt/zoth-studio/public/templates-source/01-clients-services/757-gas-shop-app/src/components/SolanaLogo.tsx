import React from 'react';

interface SolanaLogoProps {
  className?: string;
}

const SolanaLogo: React.FC<SolanaLogoProps> = ({ className = 'h-6 w-6' }) => (
  <img src="/solana-logo.svg" alt="Solana" className={className} />
);

export default SolanaLogo;
