// app/lich-su/page.tsx
export const dynamic = "force-dynamic"; // ⚡ ép fetch mới mỗi lần request

import { createClient } from "@supabase/supabase-js";
import Header from "../components/Header";
import Slide from "../components/Slide";
import Footer from "../components/Footer";
import LichSuGiaVang from "../components/LichSuGiaVang";
import { LichSuGiaVang as LichSuGia } from "../../types/supabase";

// Supabase server-side client (chạy trên server)
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const metadata = {
  title: "Vàng Bạc Công Ngọc - Lịch sử giá vàng",
  description:
    "Khám phá lịch sử biến động giá vàng tại Công Ngọc.",
  openGraph: {
    title: "Lịch sử giá vàng tại Công Ngọc",
    description: "Theo dõi biến động giá vàng theo thời gian thực tại Vàng Bạc Công Ngọc.",
    url: "https://vangbaccongngoc.com/history",
    images: [
      {
        url: "https://vangbaccongngoc.com/img/5.jpeg",
        width: 800,
        height: 600,
      },
    ],
  },
};

export default async function LichSuPage() {
  // ================= DANH SÁCH LOẠI VÀNG =================
  const { data: bangGia, error: errorBangGia } = await supabaseServer
    .from("bang_gia_vang")
    .select("id, loai_vang")
    .order("id", { ascending: true });

  if (errorBangGia) {
    console.error("Lỗi lấy danh sách vàng:", errorBangGia.message);
  }

  const danhSachVang: string[] = bangGia?.map((d) => d.loai_vang) || [];

  // Đặt default loại vàng rõ ràng
  const defaultLoaiVang =
    danhSachVang.find((v) => v === "Nhẫn Tròn Công Ngọc 99,99") ||
    danhSachVang[0] ||
    "";

  // ================= LẤY LỊCH SỬ 7 NGÀY =================
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);

  const { data: lichSuData, error: errorLichSu } = await supabaseServer
    .from("lich_su_bang_gia_vang")
    .select("*")
    .eq("loai_vang", defaultLoaiVang)
    .gte("thay_doi_luc", fromDate.toISOString())
    .order("id", { ascending: true });

  if (errorLichSu) {
    console.error("Lỗi lấy lịch sử:", errorLichSu.message);
  }

  const lichSu: LichSuGia[] = (lichSuData || []) as LichSuGia[];

  return (
    <main>
      <Header />
      <Slide />
      <LichSuGiaVang
        initialLichSu={lichSu}
        initialDanhSachVang={danhSachVang}
        initialLoaiVang={defaultLoaiVang}
      />
      <Footer />
    </main>
  );
}
