// app/home/BangGiaClient.tsx
"use client"; // bắt buộc

import dynamic from "next/dynamic";

export const BangGiaRealtimeWrapper = dynamic(
  () => import("../components/BangGiaRealtime"),
  { ssr: false }
);
