import React from 'react';
import { ModulationType } from '../../types';

interface WaveformThumbnailProps {
  type: ModulationType;
  color?: string;
  height?: number;
}

export const WaveformThumbnail: React.FC<WaveformThumbnailProps> = ({
  type,
  color = '#06b6d4',
  height = 56
}) => {
  // Generate SVG path for a clean representative waveform
  const points = 60;
  const pathD = React.useMemo(() => {
    let d = '';
    const midY = height / 2;
    const amp = height * 0.38;

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * 200;
      const t = (i / points) * Math.PI * 4;
      let y = midY;

      if (type === 'AM-DSB') {
        // Double sideband with amplitude envelope
        const envelope = 0.5 + 0.45 * Math.cos(t * 0.5);
        y = midY + amp * envelope * Math.sin(t * 3);
      } else if (type === 'AM-SSB') {
        // Single sideband: phase rotated progressive wave
        const env = 0.65 + 0.3 * Math.cos(t * 0.75);
        y = midY + amp * env * Math.sin(t * 2.5 + 0.3);
      } else if (type === 'WBFM') {
        // Wideband frequency modulation: varying frequency density
        const freqDev = 2.2 * Math.sin(t * 0.8);
        y = midY + amp * 0.9 * Math.sin(t * 2.2 + freqDev);
      }

      d += (i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)}` : ` L ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return d;
  }, [type, height]);

  return (
    <div className="w-full relative overflow-hidden rounded-lg bg-slate-950/70 border border-slate-800/80 p-1 flex items-center justify-center">
      <svg
        viewBox={`0 0 200 ${height}`}
        className="w-full h-auto overflow-visible"
        style={{ maxHeight: `${height}px` }}
      >
        <defs>
          <linearGradient id={`grad-${type}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {/* Subtle zero reference line */}
        <line x1="0" y1={height / 2} x2="200" y2={height / 2} stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />
        {/* Waveform line */}
        <path
          d={pathD}
          fill="none"
          stroke={`url(#grad-${type})`}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
