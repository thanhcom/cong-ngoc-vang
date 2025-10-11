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

export default function BangGiaVangManager() {
  const [rows, setRows] = useState<BangGia[]>([]);
  const [formData, setFormData] = useState<BangGia>({
    loai_vang: "",
    mua_vao: 0,
    ban_ra: 0,
    don_vi: "VNĐ/chỉ",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

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
        })
        .eq("id", editingId);
      setEditingId(null);
    } else {
      await supabase.from("bang_gia_vang").insert([formData]);
    }

    setFormData({ loai_vang: "", mua_vao: 0, ban_ra: 0, don_vi: "VNĐ/chỉ" });
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
          className={`w-full py-2 font-bold rounded-lg transition ${
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
                <td className="py-2 px-4 text-sm text-gray-500">
                  {new Date(r.updated_at!).toLocaleString("vi-VN")}
                </td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    ✏️ Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(r.id!)}
                    className="text-gray-500 hover:text-red-600 font-semibold"
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
