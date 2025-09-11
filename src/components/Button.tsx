import Link from 'next/link';
import { ReactNode } from 'react';

interface ButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function Button({ href, children, className = '' }: ButtonProps) {
  return (
    <Link 
      href={href} 
      className={`group relative px-12 py-4 rounded-xl font-bold text-xl transition-all duration-200 transform hover:scale-105 shadow-2xl font-daydream text-center flex items-center justify-center ${className}`}
      style={{
        backgroundColor: '#6b7280', 
        color: '#ffffff',
        filter: 'drop-shadow(2px 2px 0px #000)',
        textShadow: '0 0 4px #ffffff'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#8d7cc2'; 
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#635d75'; 
      }}
    >
      {children}
    </Link>
  );
}
