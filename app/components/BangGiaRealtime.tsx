// components/BangGiaRealtime.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface GiaVang {
  id: number;
  loai_vang: string;
  mua_vao: number;
  ban_ra: number;
  don_vi: string;
  updated_at: string;
}

// Hàm hiển thị "time ago"
function timeAgo(dateString: string) {
  const now = new Date();
  const updated = new Date(dateString);
  const diff = Math.floor((now.getTime() - updated.getTime()) / 1000);

  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;

  const days = Math.floor(diff / 86400);
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}

export default function BangGiaRealtime() {
  const [bangGia, setBangGia] = useState<GiaVang[]>([]);
  const [timeNow, setTimeNow] = useState(new Date());

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("bang_gia_vang")
        .select("*")
        .order("id", { ascending: true });
      if (!error && data) setBangGia(data);
    };
    fetchData();
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("realtime:bang_gia_vang")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bang_gia_vang" },
        (payload) => {
          setBangGia((prev) => {
            if (payload.eventType === "UPDATE") {
              return prev.map((r) =>
                r.id === payload.new.id ? (payload.new as GiaVang) : r
              );
            }
            if (payload.eventType === "INSERT") {
              return [...prev, payload.new as GiaVang];
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Cập nhật thời gian "time ago" mỗi giây
  useEffect(() => {
    const interval = setInterval(() => setTimeNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12 md:py-16 bg-yellow-50">
      <div className="container mx-auto px-4 md:px-12 text-center">
        <h3 className="text-3xl md:text-4xl font-extrabold text-red-700 mb-8">
          Bảng giá vàng hôm nay
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-xl rounded-xl overflow-hidden text-base md:text-lg">
            <thead className="bg-red-700 text-white text-lg md:text-3xl font-bold">
              <tr>
                <th className="py-4 px-6">Loại vàng</th>
                <th className="py-4 px-6">Mua vào</th>
                <th className="py-4 px-6">Bán ra</th>
                <th className="py-4 px-6">Cập nhật</th>
              </tr>
            </thead>
            <tbody>
              {bangGia.map((row) => (
                <tr
                  key={row.id}
                  className="border-b transition-colors duration-500 hover:bg-yellow-200"
                >
                  {/* Loại vàng */}
                  <td className="py-5 px-6 text-red-900 text-3xl md:text-3xl font-extrabold tracking-wide shadow-md transition-transform duration-300 hover:scale-105">
                    {row.loai_vang}
                  </td>

                  {/* Mua vào */}
                  <td className="py-5 px-6 text-red-900 text-3xl md:text-3xl font-extrabold tracking-wide shadow-md transition-transform duration-300 hover:scale-105">
                    {row.mua_vao.toLocaleString("vi-VN")} {row.don_vi}
                  </td>

                  {/* Bán ra */}
                  <td className="py-5 px-6 text-red-900 text-3xl md:text-3xl font-extrabold tracking-wide shadow-md transition-transform duration-300 hover:scale-105">
                    {row.ban_ra.toLocaleString("vi-VN")} {row.don_vi}
                  </td>

                  {/* Cập nhật với nhấp nháy khi update */}
                  <td
                    className={`py-5 px-6 text-yellow-400 text-3xl md:text-3xl font-extrabold tracking-wide shadow-md transition-colors duration-500 hover:text-yellow-600 cursor-default ${
                      new Date(row.updated_at).getTime() > Date.now() - 5000
                        ? "animate-pulse"
                        : ""
                    }`}
                    title={new Date(row.updated_at).toLocaleString()}
                  >
                    {timeAgo(row.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
