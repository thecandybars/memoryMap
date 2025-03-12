// src/components/Logo.tsx
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center text-white">
      <img 
        src="/docs/logo.png" 
        alt="Centro Nacional de Memoria Histórica" 
        className="h-12" 
        style={{ width: 'auto' }}
      />
    </div>
  );
};