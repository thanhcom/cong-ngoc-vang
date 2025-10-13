import { createClient } from "@supabase/supabase-js";
import Header from "../components/Header";
import Slide from "../components/Slide";
import Footer from "../components/Footer";
import LichSuGiaVang from "../components/LichSuGiaVang";
import { BangGiaVang, LichSuGiaVang as LichSuGia } from "../../types/supabase";

const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const metadata = {
  title: "Vàng Bạc Công Ngọc - Lịch sử giá vàng",
  description: "Khám phá lịch sử biến động giá vàng tại Công Ngọc.",
};

export default async function LichSuPage() {
  // Lấy danh sách loại vàng
  const { data: bangGia } = await supabaseServer
    .from("bang_gia_vang")
    .select("loai_vang");

  const danhSachVang: string[] = Array.from(
    new Set(bangGia?.map((d) => d.loai_vang) || [])
  );
  const defaultLoaiVang = danhSachVang[0] || "";

  // Lấy lịch sử 7 ngày đầu tiên
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);

  const { data: lichSuData } = await supabaseServer
    .from("lich_su_bang_gia_vang")
    .select("*")
    .eq("loai_vang", defaultLoaiVang)
    .gte("thay_doi_luc", fromDate.toISOString())
    .order("thay_doi_luc", { ascending: true });

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
