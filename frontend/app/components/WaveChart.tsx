
"use client";
import React from "react";

type Point = { x: number; y: number };
type DataPoint = { label: string; value: number };

/* Helpers */

// Convert array of points to a smooth SVG path using Catmull-Rom to Bezier
function catmullRom2bezier(points: Point[]) {
  if (points.length < 2) return "";
  const cr = (p0: any, p1: any, p2: any, p3: any) => {
    const v0 = (p2.x - p0.x) / 6;
    const v1 = (p3.x - p1.x) / 6;
    const v0y = (p2.y - p0.y) / 6;
    const v1y = (p3.y - p1.y) / 6;
    return {
      c1: { x: p1.x + v0, y: p1.y + v0y },
      c2: { x: p2.x - v1, y: p2.y - v1y },
    };
  };

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const { c1, c2 } = cr(p0, p1, p2, p3);
    d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function WaveChart({
  data,
  vw = 900,
  vh = 320,
  color = "#4f46e5",
}: {
  data: DataPoint[];
  vw?: number; // internal viewport width
  vh?: number; // internal viewport height
  color?: string;
}) {
  // Internal viewport (fixed). SVG will scale responsively via CSS.
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const innerW = Math.max(0, vw - padding.left - padding.right);
  const innerH = Math.max(0, vh - padding.top - padding.bottom);
  const max = Math.max(1, ...data.map((d) => d.value));
  const step = data.length > 1 ? innerW / (data.length - 1) : innerW;

  // build points in internal coordinate space
  const points = data.map((d, i) => {
    const x = padding.left + i * step;
    const y = padding.top + innerH - (d.value / max) * innerH;
    return { x, y, label: d.label, value: d.value };
  });

  const linePath = catmullRom2bezier(points.map((p) => ({ x: p.x, y: p.y })));
  const areaPath = linePath
    ? linePath + ` L ${padding.left + innerW} ${padding.top + innerH} L ${padding.left} ${padding.top + innerH} Z`
    : "";

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Overview chart"
    >
      <defs>
        <linearGradient id="waveGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>

        <marker id="arrowUp" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <path d="M2 7 L5 2 L8 7 Z" fill="#10b981" />
        </marker>

        <marker id="arrowDown" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <path d="M2 3 L5 8 L8 3 Z" fill="#ef4444" />
        </marker>

        <marker id="arrowRight" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <path d="M2 3 L8 5 L2 7 Z" fill="#6b7280" />
        </marker>
      </defs>

      {/* grid */}
      <g>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padding.top + innerH - t * innerH;
          return <line key={t} x1={padding.left} x2={padding.left + innerW} y1={y} y2={y} stroke="#e6e6e6" strokeWidth={1} />;
        })}
      </g>

      {/* area */}
      {areaPath && <path d={areaPath} fill="url(#waveGrad)" stroke="none" />}

      {/* line */}
      {linePath && <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />}

      {/* points and arrows */}
      <g>
        {points.map((p, i) => {
          const prev = points[i - 1];
          let trend: "up" | "down" | "same" = "same";
          if (prev) {
            if (p.value > prev.value) trend = "up";
            else if (p.value < prev.value) trend = "down";
            else trend = "same";
          }
          const marker = trend === "up" ? "url(#arrowUp)" : trend === "down" ? "url(#arrowDown)" : "url(#arrowRight)";
          return (
            <g key={p.label}>
              <circle cx={p.x} cy={p.y} r={5} fill="#fff" stroke={color} strokeWidth={2} />
              <line x1={p.x} x2={p.x} y1={p.y - 18} y2={p.y - 6} stroke="transparent" markerEnd={marker} />
              <text x={p.x} y={p.y - 22} textAnchor="middle" fontSize={12} fill="#111827">
                {p.value}
              </text>
              <text x={p.x} y={padding.top + innerH + 22} textAnchor="middle" fontSize={12} fill="#6b7280">
                {p.label}
              </text>
            </g>
          );
        })}
      </g>

      {/* y axis labels */}
      <text x={padding.left - 8} y={padding.top + innerH} textAnchor="end" fontSize={12} fill="#6b7280">
        0
      </text>
      <text x={padding.left - 8} y={padding.top + 12} textAnchor="end" fontSize={12} fill="#6b7280">
        {max}
      </text>
    </svg>
  );
}