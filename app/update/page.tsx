"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

interface BangGia {
  id?: number;
  loai_vang: string;
  mua_vao: number;
  ban_ra: number;
  don_vi?: string; // giữ để hiển thị giao diện
  updated_at?: string;
}

// 🔹 Hàm tính "time ago"
function timeAgo(dateString: string) {
  const now = new Date();
  const past = new Date(dateString);
  const diff = (now.getTime() - past.getTime()) / 1000;

  if (diff < 60) return `${Math.floor(diff)} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;
  if (diff < 31104000) return `${Math.floor(diff / 2592000)} tháng trước`;
  return `${Math.floor(diff / 31104000)} năm trước`;
}

export default function BangGiaVangManager() {
  useEffect(() => {
    document.title = "💎 Quản lý Bảng giá vàng - Công Ngọc";
  }, []);

  const [rows, setRows] = useState<BangGia[]>([]);
  const [formData, setFormData] = useState<BangGia>({
    loai_vang: "",
    mua_vao: 0,
    ban_ra: 0,
    don_vi: "Nghìn VNĐ/chỉ", // chỉ để hiển thị
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [, setTick] = useState(0);

  // 🔹 Load + realtime
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

  // 🔹 Cập nhật "time ago"
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const { data, error } = await supabase
      .from("bang_gia_vang")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("❌ Lỗi load dữ liệu:", error.message);
      alert("Không thể tải dữ liệu: " + error.message);
    } else {
      // Gán đơn vị mặc định để hiển thị
      const withDonVi = (data || []).map((r) => ({
        ...r,
        don_vi: "Nghìn VNĐ/chỉ",
      }));
      setRows(withDonVi);
    }
  };

  // 🔹 Thêm / Cập nhật
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        const { error } = await supabase
          .from("bang_gia_vang")
          .update({
            loai_vang: formData.loai_vang,
            mua_vao: formData.mua_vao,
            ban_ra: formData.ban_ra,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        alert("✅ Cập nhật thành công!");
        setEditingId(null);
      } else {
        const { error } = await supabase.from("bang_gia_vang").insert([
          {
            loai_vang: formData.loai_vang,
            mua_vao: formData.mua_vao,
            ban_ra: formData.ban_ra,
            updated_at: new Date().toISOString(),
          },
        ]);

        if (error) throw error;
        alert("✅ Thêm mới thành công!");
      }

      setFormData({
        loai_vang: "",
        mua_vao: 0,
        ban_ra: 0,
        don_vi: "Nghìn VNĐ/chỉ",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("❌ Lỗi Supabase:", err.message);
        alert("❌ Lỗi khi lưu dữ liệu: " + err.message);
      } else {
        console.error("❌ Lỗi Supabase không xác định:", err);
        alert("❌ Có lỗi xảy ra, vui lòng thử lại.");
      }
    }
  };

  // 🔹 Sửa
  const handleEdit = (row: BangGia) => {
    setEditingId(row.id!);
    setFormData({ ...row });
  };

  // 🔹 Xóa
  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa không?")) {
      const { error } = await supabase.from("bang_gia_vang").delete().eq("id", id);
      if (error) {
        console.error("❌ Lỗi xóa:", error.message);
        alert("Lỗi khi xóa: " + error.message);
      } else {
        alert("🗑️ Đã xóa thành công!");
      }
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
