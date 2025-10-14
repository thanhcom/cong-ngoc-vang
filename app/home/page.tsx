// app/home/page.tsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import Slide from "../components/Slide";
import { BangGiaRealtimeWrapper } from "./BangGiaClient";
import { createClient } from "@supabase/supabase-js";

export const metadata = {
  title: "Vàng Bạc Công Ngọc - Trang chủ",
  description:
    "Vàng Bạc Công Ngọc cung cấp nhẫn, dây chuyền, vòng tay… chất lượng cao, uy tín tại Hải Phòng.",
  openGraph: {
    title: "Thông tin Vàng Bạc Công Ngọc",
    description: "Sản phẩm vàng bạc chất lượng cao, uy tín tại Hải Phòng.",
    url: "https://yourdomain.com",
    images: [{ url: "/images/logo.png", width: 800, height: 600 }],
  },
};

// Supabase server-side client (chỉ server-side, dùng service_role)
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function HomePage() {
  const { data: bangGia } = await supabaseServer
    .from("bang_gia_vang")
    .select("id, loai_vang, mua_vao, ban_ra, don_vi, updated_at")
    .order("id", { ascending: true });

  return (
    <main>
      <Header />
      <Slide />
      {/* Realtime chỉ chạy client-side */}
      <BangGiaRealtimeWrapper initialData={bangGia || []} />
      <Footer />
    </main>
  );
}
