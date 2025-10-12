"use client";

import { useEffect, useState, useCallback } from "react";
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

export default function LichSuGiaVang() {
  const [lichSu, setLichSu] = useState<LichSuGia[]>([]);
  const [loaiVang, setLoaiVang] = useState<string>("");
  const [danhSachVang, setDanhSachVang] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<"24h" | "7d" | "30d">("7d");

  // 🟡 Lấy danh sách loại vàng, chọn mặc định cái đầu tiên
  useEffect(() => {
    const fetchDanhSachVang = async () => {
      const { data, error } = await supabase
        .from("bang_gia_vang")
        .select("loai_vang")
        .order("id", { ascending: true });

      if (error) {
        console.error("Lỗi khi lấy danh sách vàng:", error.message);
        return;
      }

      if (data && data.length > 0) {
        const list = [...new Set(data.map((d) => d.loai_vang))];
        setDanhSachVang(list);
        setLoaiVang(list[0]); // 👉 chọn mặc định cái đầu tiên
      }
    };

    fetchDanhSachVang();
  }, []);

  // 🟢 Hàm fetch lịch sử có memo hóa để tránh re-render vô ích
  const fetchLichSu = useCallback(
    async (loai: string) => {
      setLoading(true);

      const now = new Date();
      const fromDate = new Date();

      if (range === "24h") fromDate.setDate(now.getDate() - 1);
      else if (range === "7d") fromDate.setDate(now.getDate() - 7);
      else if (range === "30d") fromDate.setDate(now.getDate() - 30);

      const { data, error } = await supabase
        .from("lich_su_bang_gia_vang")
        .select("id, loai_vang, mua_vao, ban_ra, thay_doi_luc")
        .eq("loai_vang", loai)
        .gte("thay_doi_luc", fromDate.toISOString())
        .order("thay_doi_luc", { ascending: true });

      if (error) {
        console.error("Lỗi khi lấy lịch sử:", error.message);
      } else {
        setLichSu(data || []);
      }

      setLoading(false);
    },
    [range]
  );

  // 🟣 Tự động gọi khi đổi loại vàng hoặc range
  useEffect(() => {
    if (loaiVang) fetchLichSu(loaiVang);
  }, [loaiVang, range, fetchLichSu]);

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
          {danhSachVang.length === 0 ? (
            <option value="">Đang tải danh sách...</option>
          ) : (
            danhSachVang.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))
          )}
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

      {loading && (
        <p className="text-center text-gray-500">⏳ Đang tải dữ liệu...</p>
      )}

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
            <YAxis />
            <Tooltip
              labelFormatter={(v) => new Date(v).toLocaleString("vi-VN")}
              formatter={(value: number, name: string) => [
                value.toLocaleString("vi-VN") + " VNĐ/Chỉ",
                name === "mua_vao" ? "Mua vào" : "Bán ra",
              ]}
            />
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
