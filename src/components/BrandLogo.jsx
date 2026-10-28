import React from 'react';

export function BrandLogo({ size = 32, className = "" }) {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 rounded-2xl overflow-hidden shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Squircle Base: Pure Matte Black */}
        <rect width="100" height="100" rx="27" fill="#0A0B0E"/>
        <rect width="98" height="98" x="1" y="1" rx="26" stroke="#1E2029" strokeWidth="2" fill="none" />
        
        {/* White 'F' Body: Spine and Top Arm */}
        <path 
          d="M 38 66 L 38 38 Q 38 31 46 31 L 64 31" 
          stroke="#FFFFFF" 
          strokeWidth="12" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none" 
        />

        {/* Green Middle Bar */}
        <path 
          d="M 38 48.5 L 56 48.5" 
          stroke="#00D084" 
          strokeWidth="10" 
          strokeLinecap="round" 
          fill="none" 
        />

        {/* Green Accent Spark Dot at Upper-Right Tip */}
        <circle cx="69.5" cy="25" r="3.8" fill="#00D084" />
      </svg>
    </div>
  );
}
