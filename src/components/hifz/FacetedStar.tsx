import React, { useMemo } from "react";

interface FacetedStarProps {
  x: number;
  y: number;
  size?: number; // Outer tip radius
  score: number; // 100 (radiant), 60 (stable), 30 (dimming), 10 (critical), 0 (unmemorized)
  isHovered?: boolean;
  label?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Generates geometric coordinates for a clean 5-pointed star (★)
 * with internal subtle 3D facet lines, NO lines poking outside.
 */
export function getStarGeometry(R: number, rRatio: number = 0.42) {
  const r = R * rRatio;
  const outerTips: { x: number; y: number }[] = [];
  const innerValleys: { x: number; y: number }[] = [];
  const perimeterPoints: { x: number; y: number }[] = [];

  for (let i = 0; i < 5; i++) {
    const outerAngle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
    const innerAngle = -Math.PI / 2 + Math.PI / 5 + (i * 2 * Math.PI) / 5;

    const ox = Number((R * Math.cos(outerAngle)).toFixed(2));
    const oy = Number((R * Math.sin(outerAngle)).toFixed(2));
    const ix = Number((r * Math.cos(innerAngle)).toFixed(2));
    const iy = Number((r * Math.sin(innerAngle)).toFixed(2));

    outerTips.push({ x: ox, y: oy });
    innerValleys.push({ x: ix, y: iy });

    perimeterPoints.push({ x: ox, y: oy });
    perimeterPoints.push({ x: ix, y: iy });
  }

  const perimeterPath = `M ${perimeterPoints.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;

  // 10 internal faceted triangles (meeting strictly at center 0,0 - never going outside!)
  const facets: { path: string; isLight: boolean }[] = [];
  for (let i = 0; i < 5; i++) {
    const prevValley = innerValleys[(i + 4) % 5];
    const tip = outerTips[i];
    const nextValley = innerValleys[i];

    // Left half facet
    facets.push({
      path: `M 0 0 L ${prevValley.x} ${prevValley.y} L ${tip.x} ${tip.y} Z`,
      isLight: true,
    });
    // Right half facet
    facets.push({
      path: `M 0 0 L ${tip.x} ${tip.y} L ${nextValley.x} ${nextValley.y} Z`,
      isLight: false,
    });
  }

  return { outerTips, innerValleys, perimeterPath, facets };
}

export function FacetedIlluminatedStar({
  x,
  y,
  size = 14,
  score,
  isHovered = false,
  label,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: FacetedStarProps) {
  const isMem = score > 0;
  const currentSize = isHovered ? size * 1.3 : size;

  const geo = useMemo(() => getStarGeometry(currentSize), [currentSize]);

  // Color & Opacity vary strictly according to memory/revision status (memory retention):
  // 1-3 days: 100% (Pure brilliant white, luminous glow, opacity: 1.0)
  // 4-7 days: 60% (Calm soft white, gentle starlight, opacity: 0.65)
  // 8-15 days: 30% (Fading star - dim starlight, opacity: 0.35, breathing pulse)
  // >15 days: 10% (Dark / critical dormant star, opacity: 0.15, warning alert)
  // Unmemorized: 0% (Faint dormant wireframe silhouette, opacity: 0.2)

  let opacity = 0.2;
  let haloRadius = 0;
  let haloOpacity = 0;
  let isPulsing = false;
  let isCritical = false;

  let facetLightColor = "#ffffff";
  let facetShadeColor = "#e2e8f0";
  let strokeColor = "#ffffff";

  if (isMem) {
    if (score >= 90) {
      // 100% Radiant (1-3 days: full brilliant white light)
      opacity = 1.0;
      haloRadius = currentSize * 2.2;
      haloOpacity = 0.75;
      facetLightColor = "#ffffff";
      facetShadeColor = "#f1f5f9";
      strokeColor = "#ffffff";
    } else if (score >= 50) {
      // 60% Stable (4-7 days: soft starlight)
      opacity = 0.65;
      haloRadius = currentSize * 1.5;
      haloOpacity = 0.4;
      facetLightColor = "#e2e8f0";
      facetShadeColor = "#cbd5e1";
      strokeColor = "#e2e8f0";
    } else if (score >= 25) {
      // 30% Dimming (8-15 days: fading star - lower brightness)
      opacity = 0.35;
      haloRadius = currentSize * 1.1;
      haloOpacity = 0.2;
      facetLightColor = "#94a3b8";
      facetShadeColor = "#64748b";
      strokeColor = "#94a3b8";
      isPulsing = true; // Fading starlight pulse
    } else {
      // 10% Critical (15+ days: bare and dark)
      opacity = 0.18;
      haloRadius = 0;
      haloOpacity = 0;
      facetLightColor = "#334155";
      facetShadeColor = "#1e293b";
      strokeColor = "#475569";
      isCritical = true;
    }
  } else {
    // Unmemorized: dormant faint outline
    opacity = 0.22;
    facetLightColor = "#1e293b";
    facetShadeColor = "#0f172a";
    strokeColor = "#334155";
  }

  if (isHovered) {
    opacity = Math.min(1.0, opacity + 0.35);
    haloRadius = currentSize * 2.4;
    haloOpacity = 0.85;
  }

  return (
    <g
      transform={`translate(${x}, ${y})`}
      className={`cursor-pointer select-none group ${isPulsing ? "animate-pulse" : ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* 1. Critical Warning Ping (>15 days without revision) */}
      {isCritical && (
        <circle
          cx="0"
          cy="0"
          r={currentSize * 1.3}
          fill="none"
          stroke="#ef4444"
          strokeWidth="1"
          strokeDasharray="2 3"
          opacity="0.8"
          className="animate-ping origin-center"
          style={{ animationDuration: "2.5s" }}
        />
      )}

      {/* 2. Soft White Radial Light Glow (NO lines poking outside, only clean soft atmospheric halo!) */}
      {isMem && haloRadius > 0 && (
        <circle
          cx="0"
          cy="0"
          r={haloRadius}
          fill="url(#whiteLightSpread)"
          opacity={haloOpacity}
          className="pointer-events-none"
        />
      )}

      {/* 3. The 5-Pointed Star Body (★ - Pure, clean, faceted starlight with NO external lines) */}
      <g opacity={opacity} filter={score >= 60 ? "url(#whiteStarBloom)" : undefined}>
        {/* Faceted inner surface */}
        {geo.facets.map((facet, idx) => (
          <path
            key={`facet-${idx}`}
            d={facet.path}
            fill={facet.isLight ? facetLightColor : facetShadeColor}
            fillOpacity={isMem ? (facet.isLight ? 0.98 : 0.8) : 0.4}
            stroke={strokeColor}
            strokeWidth={0.5}
            strokeOpacity={isMem ? 0.7 : 0.3}
            strokeLinejoin="round"
          />
        ))}

        {/* Clean Outer Perimeter Contour */}
        <path
          d={geo.perimeterPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={isHovered ? 1.4 : 1}
          strokeOpacity={isMem ? 1 : 0.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Subtle Center Heart Starlight (Inner focal point) */}
        {isMem && (
          <circle
            cx="0"
            cy="0"
            r={score >= 90 ? 2 : 1.2}
            fill="#ffffff"
            opacity={score >= 90 ? 1 : 0.7}
          />
        )}
      </g>

      {/* 4. Surah Label Text below star */}
      {label && (
        <text
          x="0"
          y={currentSize + (isMem ? 15 : 12)}
          textAnchor="middle"
          fill={
            score >= 90
              ? "#ffffff"
              : score >= 50
              ? "#e2e8f0"
              : score >= 25
              ? "#94a3b8"
              : isMem
              ? "#64748b"
              : "#475569"
          }
          opacity={isHovered ? 1 : isMem ? Math.max(0.65, opacity) : 0.45}
          fontSize={isHovered ? "11px" : "9.5px"}
          fontFamily="monospace"
          fontWeight={isHovered || score >= 90 ? "bold" : "normal"}
          className="pointer-events-none transition-all"
        >
          {label}
        </text>
      )}

      {/* 5. Warning Tag for Dimming or Critical */}
      {isMem && score <= 30 && (
        <text
          x="0"
          y={-currentSize - 8}
          textAnchor="middle"
          fill={isCritical ? "#f87171" : "#e2e8f0"}
          fontSize="8px"
          fontFamily="monospace"
          fontWeight="bold"
          opacity="0.9"
          className="pointer-events-none"
        >
          {isCritical ? "Dark (15+ days)" : "Dimming (30%)"}
        </text>
      )}
    </g>
  );
}
