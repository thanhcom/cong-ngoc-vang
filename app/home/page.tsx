// app/page.tsx
import Header from "../components/Header";
import Footer from "../components/Footer";
import Slide from "../components/Slide";
import BangGiaRealtime from "../components/BangGiaRealtime";
import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import { Database } from "../../types/supabase"; // 👈 Thêm dòng này

export const metadata = {
  title: "Vàng Bạc Công Ngọc - Trang chủ",
  description:
    "Vàng Bạc Công Ngọc cung cấp nhẫn, dây chuyền, vòng tay… chất lượng cao, uy tín tại Hải Phòng.",
  openGraph: {
    title: "Thông tin Vàng Bạc Công Ngọc",
    description: "Sản phẩm vàng bạc chất lượng cao, uy tín tại Hải Phòng.",
    url: "https://yourdomain.com/info",
    images: [{ url: "/images/logo.png", width: 800, height: 600 }],
  },
};

// 🧠 Supabase Server-side client (để SEO đọc được dữ liệu)
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function HomePage() {
  

  const { data: bangGia } = await supabaseServer
    .from("bang_gia_vang")
    .select("*")
    .order("id", { ascending: true });

  return (
    
    <main>
      <Header />
      <Slide />
      {/* 👇 truyền dữ liệu ban đầu vào realtime client */}
       <BangGiaRealtime initialData={bangGia || []} /> 
      <Footer />
    </main>
  );
}
