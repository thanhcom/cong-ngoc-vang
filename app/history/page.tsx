import Header from "../components/Header";
import Footer from "../components/Footer";
import Slide from "../components/Slide";
import LichSuGiaVang from "../components/LichSuGiaVang";

export const metadata = {
  title: "Vàng Bạc Công Ngọc - Lịch sử giá vàng",
  description: "Khám phá lịch sử biến động giá vàng tại Công Ngọc.",
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
