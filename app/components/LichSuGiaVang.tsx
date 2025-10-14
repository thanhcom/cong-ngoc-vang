"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface LichSuGia {
  id: number;
  loai_vang: string;
  mua_vao: number;
  ban_ra: number;
  thay_doi_luc: string;
}

interface Props {
  initialLichSu: LichSuGia[];
  initialDanhSachVang: string[];
  initialLoaiVang: string;
}

export default function LichSuGiaVang({
  initialLichSu,
  initialDanhSachVang,
  initialLoaiVang,
}: Props) {
  const [lichSu, setLichSu] = useState<LichSuGia[]>(initialLichSu);
  const [loaiVang, setLoaiVang] = useState<string>(initialLoaiVang);
  const [danhSachVang] = useState<string[]>(initialDanhSachVang);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<"24h" | "7d" | "30d">("7d");

  // ================= FETCH DỮ LIỆU =================
  const fetchLichSu = useCallback(
    async (loai: string) => {
      setLoading(true);

      const now = new Date();
      const fromDate = new Date();

      if (range === "24h") fromDate.setDate(now.getDate() - 1);
      else if (range === "7d") fromDate.setDate(now.getDate() - 7);
      else if (range === "30d") fromDate.setDate(now.getDate() - 30);

      const { data } = await supabase
        .from("lich_su_bang_gia_vang")
        .select("*")
        .eq("loai_vang", loai)
        .gte("thay_doi_luc", fromDate.toISOString())
        .order("id", { ascending: true });

      setLichSu((data || []).sort((a, b) => a.id - b.id));
      setLoading(false);
    },
    [range]
  );

  useEffect(() => {
    if (loaiVang !== initialLoaiVang || range !== "7d") {
      fetchLichSu(loaiVang);
    }
  }, [loaiVang, range, fetchLichSu, initialLoaiVang]);

  // ================= TOOLTIP =================
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { payload: LichSuGia }[];
    label?: string;
  }) => {
    if (!active || !payload || payload.length === 0 || !label) return null;

    const data = payload[0]?.payload;
    const idx = lichSu.findIndex((d) => d.id === data.id);
    const prev = idx > 0 ? lichSu[idx - 1] : null;

    const formatV = (v?: number) =>
      v == null ? "-" : v.toLocaleString("vi-VN") + " Nghìn VNĐ/Chỉ";

    const formatDelta = (cur?: number, pre?: number) => {
      if (cur == null || pre == null) return "-";
      const diff = Math.round(cur - pre);
      const sign = diff > 0 ? "+" : diff < 0 ? "" : "";
      return `${sign}${diff.toLocaleString("vi-VN")} Nghìn VNĐ/Chỉ`;
    };

    return (
      <div
        style={{
          background: "#ffffff",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 8,
          padding: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          fontSize: 13,
          minWidth: 180,
        }}
      >
        <div style={{ marginBottom: 6, fontWeight: 700 }}>
          {new Date(label).toLocaleString("vi-VN")}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ color: "#b45309", fontWeight: 600 }}>Mua vào</div>
            <div>{formatV(data.mua_vao)}</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              Δ {formatDelta(data.mua_vao, prev?.mua_vao)}
            </div>
          </div>
          <div>
            <div style={{ color: "#dc2626", fontWeight: 600 }}>Bán ra</div>
            <div>{formatV(data.ban_ra)}</div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>
              Δ {formatDelta(data.ban_ra, prev?.ban_ra)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ================= RENDER =================
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10">
      <h2 className="text-2xl font-bold text-center text-yellow-700 mb-6">
        📈 Lịch sử giá vàng
      </h2>

      {/* Bộ lọc */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        <select
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={loaiVang}
          onChange={(e) => setLoaiVang(e.target.value)}
        >
          {danhSachVang.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={range}
          onChange={(e) => setRange(e.target.value as "24h" | "7d" | "30d")}
        >
          <option value="24h">24 giờ qua</option>
          <option value="7d">7 ngày qua</option>
          <option value="30d">30 ngày qua</option>
        </select>
      </div>

      {loading && <p className="text-center text-gray-500">⏳ Đang tải dữ liệu...</p>}
      {!loading && lichSu.length === 0 && loaiVang && (
        <p className="text-center text-gray-400 italic">
          Không có dữ liệu trong khoảng thời gian này.
        </p>
      )}

      {!loading && lichSu.length > 0 && (
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={lichSu}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="thay_doi_luc"
              tickFormatter={(v) =>
                new Date(v).toLocaleString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }
            />
            <YAxis domain={["dataMin - 200", "dataMax + 200"]} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="mua_vao"
              stroke="#f59e0b"
              strokeWidth={3}
              name="Mua vào"
            />
            <Line
              type="monotone"
              dataKey="ban_ra"
              stroke="#ef4444"
              strokeWidth={3}
              name="Bán ra"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
