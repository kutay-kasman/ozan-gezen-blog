import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    engraving?: boolean;
}

export function Card({ children, className = '', hover = false, engraving = false }: CardProps) {
    return (
        <div
            className={`
        paper-card rounded-lg overflow-hidden
        ${hover ? 'transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer' : ''}
        ${engraving ? 'border-engraving' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
}
