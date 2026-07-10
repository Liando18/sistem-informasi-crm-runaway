import { ReactNode } from 'react';

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
}

export default function ChartCard({ title, subtitle, children, className = '' }: ChartCardProps) {
    return (
        <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
            <div className="p-5 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
            <div className="p-5">
                {children}
            </div>
        </div>
    );
}
