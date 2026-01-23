"use client";

// import { HeatmapLayer as GoogleHeatmapLayer } from "react-google-maps";

interface HeatmapLayerProps {
  data: Array<{
    location: any;
    weight?: number;
  }>;
}

export default function HeatmapLayer({ data }: HeatmapLayerProps) {
  if (data.length === 0) return null;

  return <></>;
  // <HeatmapLayer
  //   data={data}
  //   radius={20}
  //   opacity={0.6}
  //   gradient={[
  //     "rgba(0, 255, 255, 0)",
  //     "rgba(0, 255, 255, 1)",
  //     "rgba(0, 191, 255, 1)",
  //     "rgba(0, 127, 255, 1)",
  //     "rgba(0, 63, 255, 1)",
  //     "rgba(0, 0, 255, 1)",
  //     "rgba(0, 0, 223, 1)",
  //     "rgba(0, 0, 191, 1)",
  //     "rgba(0, 0, 159, 1)",
  //     "rgba(0, 0, 127, 1)",
  //     "rgba(63, 0, 91, 1)",
  //     "rgba(127, 0, 63, 1)",
  //     "rgba(191, 0, 31, 1)",
  //     "rgba(255, 0, 0, 1)",
  //   ]}
  // />
}
