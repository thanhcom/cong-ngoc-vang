import Header from "../components/Header";
import Footer from "../components/Footer";
import Slide from "../components/Slide";
import LichSuGiaVang from "../components/LichSuGiaVang";

export const metadata = {
  title: "Vàng Bạc Công Ngọc - Trang chủ",
  description: "Khám phá bộ sưu tập hình ảnh vàng bạc, nhẫn, dây chuyền… chất lượng cao tại Hải Phòng.",
};

export default function HomePage() {
  
  return (
    <main>
      <Header />
      <Slide />
      <LichSuGiaVang />
      <Footer />
    </main>
  );
}
