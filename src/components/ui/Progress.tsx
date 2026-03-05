import React from 'react';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  target?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className = '', value, target = 95, ...props }, ref) => (
    <div
      ref={ref}
      className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 border border-black ${className}`}
      {...props}
    >
      {/* Target Marker */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-10"
        style={{ left: `${target}%` }}
      />
      {/* Fill Bar */}
      <div
        className={`h-full w-full flex-1 transition-all duration-500 ease-in-out ${
          value >= target ? 'bg-[#E63946]' : 'bg-black'
        }`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </div>
  )
);
Progress.displayName = "Progress";

export { Progress };
