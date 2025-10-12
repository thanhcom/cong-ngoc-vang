"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface BangGia {
  id?: number;
  loai_vang: string;
  mua_vao: number;
  ban_ra: number;
  don_vi?: string;
  updated_at?: string;
}

// Hàm tính time ago kiểu Facebook
function timeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = (now.getTime() - past.getTime()) / 1000; // giây

  if (diff < 60) return `${Math.floor(diff)} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  if (diff < 31104000) return `${Math.floor(diff / 2592000)} tháng trước`;
  return `${Math.floor(diff / 31104000)} năm trước`;
}

export default function BangGiaVangManager() {
  const [rows, setRows] = useState<BangGia[]>([]);
  const [formData, setFormData] = useState<BangGia>({
    loai_vang: "",
    mua_vao: 0,
    ban_ra: 0,
    don_vi: "Nghìn VNĐ/chỉ",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [, setTick] = useState(0); // dùng để rerender mỗi giây

  // 🔹 Load dữ liệu + realtime
  useEffect(() => {
    loadData();

    const channel = supabase
      .channel("realtime-banggia")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bang_gia_vang" },
        () => loadData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔹 Timer để rerender mỗi giây
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const { data } = await supabase
      .from("bang_gia_vang")
      .select("*")
      .order("updated_at", { ascending: false });
    setRows(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await supabase
        .from("bang_gia_vang")
        .update({
          loai_vang: formData.loai_vang,
          mua_vao: formData.mua_vao,
          ban_ra: formData.ban_ra,
          don_vi: formData.don_vi,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);
      setEditingId(null);
    } else {
      await supabase
        .from("bang_gia_vang")
        .insert([{ ...formData, updated_at: new Date().toISOString() }]);
    }

    setFormData({ loai_vang: "", mua_vao: 0, ban_ra: 0, don_vi: "Nghìn VNĐ/chỉ" });
  };

  const handleEdit = (row: BangGia) => {
    setEditingId(row.id!);
    setFormData(row);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa không?")) {
      await supabase.from("bang_gia_vang").delete().eq("id", id);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-red-700 text-center">
        💎 Quản lý Bảng giá vàng - Công Ngọc
      </h2>

      {/* ===== FORM ===== */}
      <form
        onSubmit={handleSubmit}
        className="bg-red-50 p-5 rounded-2xl shadow-lg border border-red-200 mb-6 space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Loại vàng"
            value={formData.loai_vang}
            onChange={(e) =>
              setFormData({ ...formData, loai_vang: e.target.value })
            }
            required
            className="border border-red-300 p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
          />
          <input
            type="number"
            placeholder="Mua vào"
            value={formData.mua_vao}
            onChange={(e) =>
              setFormData({ ...formData, mua_vao: Number(e.target.value) })
            }
            required
            className="border border-red-300 p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
          />
          <input
            type="number"
            placeholder="Bán ra"
            value={formData.ban_ra}
            onChange={(e) =>
              setFormData({ ...formData, ban_ra: Number(e.target.value) })
            }
            required
            className="border border-red-300 p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
          />
          <input
            type="text"
            placeholder="Đơn vị"
            value={formData.don_vi}
            onChange={(e) =>
              setFormData({ ...formData, don_vi: e.target.value })
            }
            className="border border-red-300 p-2 rounded focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 font-bold rounded-lg transition cursor-pointer ${
            editingId
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white"
          }`}
        >
          {editingId ? "💾 Lưu cập nhật" : "➕ Thêm mới"}
        </button>
      </form>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto shadow-lg rounded-xl border border-red-200">
        <table className="min-w-full text-center">
          <thead>
            <tr className="bg-gradient-to-r from-red-600 to-red-700 text-white">
              <th className="py-3 px-4">Loại vàng</th>
              <th className="py-3 px-4">Mua vào</th>
              <th className="py-3 px-4">Bán ra</th>
              <th className="py-3 px-4">Cập nhật</th>
              <th className="py-3 px-4">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-b hover:bg-red-50 transition-colors"
              >
                <td className="py-2 px-4 font-semibold text-red-700">
                  {r.loai_vang}
                </td>
                <td className="py-2 px-4 text-gray-700">
                  {r.mua_vao.toLocaleString()} {r.don_vi}
                </td>
                <td className="py-2 px-4 text-gray-700">
                  {r.ban_ra.toLocaleString()} {r.don_vi}
                </td>
                <td className="py-2 px-4 text-sm text-yellow-500 font-semibold">
                  {r.updated_at ? timeAgo(r.updated_at) : "-"}
                </td>
                <td className="py-2 px-4 flex justify-center space-x-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="text-red-600 font-semibold cursor-pointer"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(r.id!)}
                    className="text-gray-500 font-semibold cursor-pointer"
                  >
                    🗑️ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
