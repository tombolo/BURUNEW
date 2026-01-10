import React from 'react';

// Custom icon components for dashboard cards
export const UploadIcon: React.FC<{ width?: string; height?: string; className?: string }> = ({ 
    width = '40', 
    height = '40', 
    className 
}) => (
    <svg 
        width={width} 
        height={height} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <rect width="40" height="40" rx="4" fill="#2563EB" fillOpacity="0.1"/>
        <path 
            d="M20 12V28M12 20L20 12L28 20" 
            stroke="#2563EB" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        <path 
            d="M8 28H32" 
            stroke="#2563EB" 
            strokeWidth="2.5" 
            strokeLinecap="round"
        />
    </svg>
);

export const CloudIcon: React.FC<{ width?: string; height?: string; className?: string }> = ({ 
    width = '40', 
    height = '40', 
    className 
}) => (
    <svg 
        width={width} 
        height={height} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <rect width="40" height="40" rx="4" fill="#10B981" fillOpacity="0.1"/>
        <path 
            d="M26 22C27.6569 22 29 23.3431 29 25C29 26.6569 27.6569 28 26 28H14C12.3431 28 11 26.6569 11 25C11 23.3431 12.3431 22 14 22C14.5523 22 15 21.5523 15 21C15 19.3431 16.3431 18 18 18C19.6569 18 21 19.3431 21 21C21 21.5523 21.4477 22 22 22H26Z" 
            fill="#10B981"
        />
        <circle cx="16" cy="24" r="2.5" fill="#10B981" opacity="0.4"/>
        <circle cx="22" cy="26" r="3" fill="#10B981" opacity="0.3"/>
    </svg>
);

export const BuilderIcon: React.FC<{ width?: string; height?: string; className?: string }> = ({ 
    width = '40', 
    height = '40', 
    className 
}) => (
    <svg 
        width={width} 
        height={height} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <rect width="40" height="40" rx="4" fill="#F59E0B" fillOpacity="0.1"/>
        <rect x="10" y="10" width="8" height="8" rx="2" fill="#F59E0B"/>
        <rect x="22" y="10" width="8" height="8" rx="2" fill="#F59E0B"/>
        <rect x="10" y="22" width="8" height="8" rx="2" fill="#F59E0B"/>
        <rect x="22" y="22" width="8" height="8" rx="2" fill="#F59E0B"/>
        <circle cx="14" cy="14" r="1.5" fill="white"/>
        <circle cx="26" cy="14" r="1.5" fill="white"/>
        <circle cx="14" cy="26" r="1.5" fill="white"/>
        <circle cx="26" cy="26" r="1.5" fill="white"/>
        <line x1="18" y1="14" x2="22" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="14" y1="18" x2="14" y2="22" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

export const StrategyIcon: React.FC<{ width?: string; height?: string; className?: string }> = ({ 
    width = '40', 
    height = '40', 
    className 
}) => (
    <svg 
        width={width} 
        height={height} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <rect width="40" height="40" rx="4" fill="#8B5CF6" fillOpacity="0.1"/>
        <path 
            d="M20 8L12 16H16V28H24V16H28L20 8Z" 
            fill="#8B5CF6"
        />
        <circle cx="20" cy="12" r="2" fill="white"/>
        <circle cx="16" cy="20" r="2" fill="white"/>
        <circle cx="24" cy="20" r="2" fill="white"/>
    </svg>
);
