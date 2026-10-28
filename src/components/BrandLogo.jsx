import React from 'react';

export function BrandLogo({ size = 32, className = "" }) {
  return (
    <div 
      className={`relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Squircle Background: Matte Obsidian */}
        <rect width="100" height="100" rx="26" fill="#090a0f" />
        <rect width="98" height="98" x="1" y="1" rx="25" stroke="#222738" strokeWidth="2" fill="none" />
        
        {/* Dynamic Minimalist Monogram: Ascending Finance 'F' */}
        {/* Left vertical anchor bar */}
        <rect x="24" y="24" width="12" height="52" rx="6" fill="#FFFFFF" />
        
        {/* Upper horizontal arm / ascending wedge */}
        <path
          d="M32 24H66C70.4183 24 74 27.5817 74 32C74 36.4183 70.4183 40 66 40H32V24Z"
          fill="#FFFFFF"
        />
        
        {/* Middle accent arm pointing up & forward */}
        <path
          d="M32 46H56C59.3137 46 62 48.6863 62 52C62 55.3137 59.3137 58 56 58H32V46Z"
          fill="#10B981"
        />

        {/* Growth spark dot in top right */}
        <circle cx="76" cy="24" r="5" fill="#10B981" />
      </svg>
    </div>
  );
}
