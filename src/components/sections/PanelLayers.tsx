"use client";

import { useId, useRef } from "react";
import { motion, useInView, type Variants } from "motion/react";

export type PanelDecor = "wood" | "stone";
export type PanelFormat = "plank" | "tile";
export type LayerLabel = { name: string; text: string };

// Isometric slab geometry in viewBox units. Layer thicknesses are exaggerated so thin layers stay visible.
const VIEW_W = 800;
const VIEW_H = 470;
const X0 = 20;
const BOTTOM = 460;
/** Vertical distance added between neighbouring layers when the panel explodes. Leaves room for two-line labels. */
const GAP = 72;
/** Every format ends at the same back-right edge, so labels line up for both products. */
const BACK_EDGE_X = 440;
const LABEL_X = 470;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** A plank is long and narrow; a tile is closer to square, so it gets more depth. */
const GEOMETRY: Record<PanelFormat, { width: number; depthX: number; depthY: number }> = {
  plank: { width: 300, depthX: BACK_EDGE_X - X0 - 300, depthY: -74 },
  tile: { width: 270, depthX: BACK_EDGE_X - X0 - 270, depthY: -95 },
};

const DECOR_SIDES: Record<PanelDecor, { front: string; side: string }> = {
  wood: { front: "#9c6b3f", side: "#87592f" },
  stone: { front: "#a9a59d", side: "#96928a" },
};

type SlabStyle = { top: string; front: string; side: string; stroke?: string };
type Layer = { key: string; thickness: number; style: SlabStyle };

/** Top to bottom, matching the order of the labels. */
function buildLayers(ids: { decor: string; core: string; foam: string }, decor: PanelDecor): Layer[] {
  return [
    {
      key: "uv",
      thickness: 4,
      style: {
        top: "rgba(26,26,26,0.05)",
        front: "rgba(26,26,26,0.14)",
        side: "rgba(26,26,26,0.09)",
        stroke: "rgba(26,26,26,0.45)",
      },
    },
    {
      key: "wear",
      thickness: 8,
      style: {
        top: "rgba(26,26,26,0.03)",
        front: "rgba(26,26,26,0.08)",
        side: "rgba(26,26,26,0.05)",
        stroke: "rgba(26,26,26,0.3)",
      },
    },
    { key: "decor", thickness: 6, style: { top: `url(#${ids.decor})`, ...DECOR_SIDES[decor] } },
    { key: "core", thickness: 40, style: { top: `url(#${ids.core})`, front: "#6d6a64", side: "#5a5752" } },
    { key: "underlay", thickness: 14, style: { top: `url(#${ids.foam})`, front: "#3a3e42", side: "#303336" } },
  ];
}

/** Front-top edge of each layer when the panel is assembled. */
function stackPositions(layers: Layer[]) {
  let y = BOTTOM;
  return [...layers]
    .reverse()
    .map((layer) => {
      y -= layer.thickness;
      return y;
    })
    .reverse();
}

type SlabProps = { y: number; thickness: number; style: SlabStyle; format: PanelFormat };

function Slab({ y, thickness, style, format }: SlabProps) {
  const { width, depthX, depthY } = GEOMETRY[format];
  const right = X0 + width;
  const top = `${X0},${y} ${right},${y} ${right + depthX},${y + depthY} ${X0 + depthX},${y + depthY}`;
  const side = `${right},${y} ${right + depthX},${y + depthY} ${right + depthX},${y + depthY + thickness} ${right},${y + thickness}`;
  const stroke = { stroke: style.stroke, strokeWidth: style.stroke ? 0.75 : 0 };
  return (
    <>
      <polygon points={top} fill={style.top} {...stroke} />
      <polygon points={side} fill={style.side} {...stroke} />
      <rect x={X0} y={y} width={width} height={thickness} fill={style.front} {...stroke} />
    </>
  );
}

const slabVariants: Variants = {
  stacked: { y: 0 },
  exploded: ({ lift, delay }: { lift: number; delay: number }) => ({
    y: lift,
    transition: { duration: 0.9, ease: EASE_OUT, delay },
  }),
};

// Leader lines and labels inherit the "stacked"/"exploded" state from the wrapper and appear as the layers part.
const leaderVariants: Variants = {
  stacked: { opacity: 0 },
  exploded: { opacity: 1, transition: { duration: 0.3, delay: 0.7 } },
};

const labelVariants: Variants = {
  stacked: { opacity: 0, x: -6 },
  exploded: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: EASE_OUT, delay: 0.75 + index * 0.06 },
  }),
};

type PanelLayersProps = {
  /** One label per layer, top to bottom. */
  labels: LayerLabel[];
  /** Accessible name of the label list, e.g. "Warstwy od góry". */
  labelsTitle: string;
  decor?: PanelDecor;
  format?: PanelFormat;
  className?: string;
};

/** Exploded view of an SPC panel: the layers separate when the drawing scrolls into view, then their labels appear. */
export function PanelLayers({ labels, labelsTitle, decor = "wood", format = "plank", className = "" }: PanelLayersProps) {
  const ref = useRef<HTMLDivElement>(null);
  const exploded = useInView(ref, { once: true, amount: 0.5 });
  // Several drawings can share a page, so pattern ids must be unique (and safe inside url(#…)).
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ids = { decor: `${uid}-decor`, core: `${uid}-core`, foam: `${uid}-foam` };
  const layers = buildLayers(ids, decor);
  const positions = stackPositions(layers);
  const { depthY } = GEOMETRY[format];
  const last = layers.length - 1;
  const lift = (index: number) => -(last - index) * GAP;
  // Vertical centre of each layer's back-right edge, where its leader line starts.
  const edgeY = (index: number) => positions[index] + depthY + layers[index].thickness / 2;

  return (
    <motion.div
      ref={ref}
      initial="stacked"
      animate={exploded ? "exploded" : "stacked"}
      className={`relative ${className}`}
    >
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden className="block w-full">
        <defs>
          {decor === "wood" ? (
            <pattern id={ids.decor} width="80" height="10" patternUnits="userSpaceOnUse">
              <rect width="80" height="10" fill="#c8955e" />
              <path d="M0 2.5H80M0 7H46M52 8.5H80" stroke="#a87545" strokeWidth="1" opacity="0.6" />
            </pattern>
          ) : (
            <pattern id={ids.decor} width="120" height="60" patternUnits="userSpaceOnUse">
              <rect width="120" height="60" fill="#d9d6cf" />
              <path d="M0 20C20 10 40 30 60 18S100 8 120 22" fill="none" stroke="#aaa59b" strokeWidth="1.2" />
              <path d="M0 46C30 38 50 56 80 44S110 40 120 48" fill="none" stroke="#bdb8ae" strokeWidth="0.8" />
              <circle cx="30" cy="34" r="0.8" fill="#b3aea4" />
              <circle cx="92" cy="30" r="0.7" fill="#b3aea4" />
            </pattern>
          )}
          <pattern id={ids.core} width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="12" height="12" fill="#8a877f" />
            <circle cx="3" cy="4" r="0.9" fill="#a39f96" />
            <circle cx="9" cy="9" r="0.8" fill="#a39f96" />
            <circle cx="8" cy="2" r="0.6" fill="#6f6c66" />
          </pattern>
          <pattern id={ids.foam} width="6" height="6" patternUnits="userSpaceOnUse">
            <rect width="6" height="6" fill="#464b50" />
            <circle cx="3" cy="3" r="0.8" fill="#575d63" />
          </pattern>
        </defs>

        {/* Drawn bottom-up so each layer covers the top face of the one beneath it. */}
        {layers
          .map((layer, index) => ({ layer, index }))
          .reverse()
          .map(({ layer, index }) => (
            <motion.g
              key={layer.key}
              variants={slabVariants}
              custom={{ lift: lift(index), delay: 0.1 + (last - index) * 0.06 }}
            >
              <Slab y={positions[index]} thickness={layer.thickness} style={layer.style} format={format} />
              <motion.g variants={leaderVariants}>
                <line
                  x1={BACK_EDGE_X + 6}
                  x2={LABEL_X - 8}
                  y1={edgeY(index)}
                  y2={edgeY(index)}
                  className="stroke-oak"
                  strokeWidth="1"
                />
                <circle cx={BACK_EDGE_X + 6} cy={edgeY(index)} r="2.5" className="fill-oak" />
              </motion.g>
            </motion.g>
          ))}
      </svg>

      {/* HTML labels keep a readable font size however small the drawing gets. */}
      <ol aria-label={labelsTitle} className="pointer-events-none">
        {labels.map((label, index) => (
          <motion.li
            key={label.name}
            variants={labelVariants}
            custom={index}
            className="absolute -translate-y-1/2 pr-1"
            style={{
              left: `${(LABEL_X / VIEW_W) * 100}%`,
              width: `${((VIEW_W - LABEL_X) / VIEW_W) * 100}%`,
              top: `${((edgeY(index) + lift(index)) / VIEW_H) * 100}%`,
            }}
          >
            <p className="text-[11px] leading-tight font-medium text-ink sm:text-sm">{label.name}</p>
            {/* On phones only the names fit between the layers; screen readers still get the text. */}
            <p className="mt-0.5 text-xs leading-snug text-muted sr-only sm:not-sr-only">{label.text}</p>
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}
