import React from 'react';
import { AnchorCode, AnchorScores } from '../types';
import { ANCHORS_DATA } from '../data/anchors';

interface RadarChartProps {
  scores: AnchorScores;
  className?: string;
}

const ORDERED_CODES: AnchorCode[] = ['TF', 'GM', 'AU', 'SE', 'EC', 'SV', 'CH', 'LS'];

export const RadarChart: React.FC<RadarChartProps> = ({ scores, className = '' }) => {
  const center = 50;
  const maxRadius = 40; // max SVG radius units
  const gridLevels = [1.0, 0.75, 0.5, 0.25];

  // Calculate coordinates for an angle index (0..7) and radius factor (0..1)
  const getCoordinates = (index: number, factor: number) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / 8;
    const r = maxRadius * factor;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points for grid level
  const getGridPolygonPoints = (factor: number) => {
    return ORDERED_CODES.map((_, i) => {
      const { x, y } = getCoordinates(i, factor);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(' ');
  };

  // Generate polygon points for actual scores
  const scorePolygonPoints = ORDERED_CODES.map((code, i) => {
    const score = scores[code] || 0;
    const factor = Math.max(0.1, Math.min(1.0, score / 100));
    const { x, y } = getCoordinates(i, factor);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  return (
    <div className={`relative w-full aspect-square max-w-[450px] mx-auto ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background Concentric Polygon Grids */}
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={getGridPolygonPoints(level)}
            fill="none"
            stroke="#e1e3db"
            strokeWidth="0.5"
            strokeDasharray={level === 0.25 || level === 0.75 ? "1 1" : undefined}
          />
        ))}

        {/* 8 Axis Lines from center */}
        {ORDERED_CODES.map((_, i) => {
          const { x, y } = getCoordinates(i, 1.0);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x.toFixed(2)}
              y2={y.toFixed(2)}
              stroke="#e1e3db"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Filled Data Polygon */}
        <polygon
          points={scorePolygonPoints}
          fill="#35662e"
          fillOpacity="0.2"
          stroke="#35662e"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Data Points and Dots */}
        {ORDERED_CODES.map((code, i) => {
          const score = scores[code] || 0;
          const factor = Math.max(0.1, Math.min(1.0, score / 100));
          const { x, y } = getCoordinates(i, factor);
          const anchor = ANCHORS_DATA[code];

          return (
            <g key={code}>
              <circle
                cx={x.toFixed(2)}
                cy={y.toFixed(2)}
                r="1.8"
                fill={anchor.color}
                stroke="#ffffff"
                strokeWidth="0.6"
              />
            </g>
          );
        })}

        {/* Axis Labels & Values */}
        {ORDERED_CODES.map((code, i) => {
          const anchor = ANCHORS_DATA[code];
          const score = scores[code] || 0;

          // Push label position slightly outside 1.0 factor for clean spacing
          const { x, y } = getCoordinates(i, 1.18);

          return (
            <text
              key={code}
              x={x.toFixed(2)}
              y={y.toFixed(2)}
              fill="#42493e"
              fontSize="3.2"
              fontFamily="Inter, sans-serif"
              fontWeight="600"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {code} ({score})
            </text>
          );
        })}
      </svg>
    </div>
  );
};
