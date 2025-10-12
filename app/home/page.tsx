import Header from "../components/Header";
import Footer from "../components/Footer";
import Slide from "../components/Slide";
import BangGiaRealtime from "../components/BangGiaRealtime";

export const metadata = {
  title: "Vàng Bạc Công Ngọc - Trang chủ",
  description:
    "Vàng Bạc Công Ngọc cung cấp nhẫn, dây chuyền, vòng tay… chất lượng cao, uy tín tại Hải Phòng.",
  openGraph: {
    title: "Thông tin Vàng Bạc Công Ngọc",
    description: "Sản phẩm vàng bạc chất lượng cao, uy tín tại Hải Phòng.",
    url: "https://yourdomain.com/info",
    images: [
      {
        url: "/images/logo.png",
        width: 800,
        height: 600,
      },
    ],
  },
};

export default function HomePage() {
  
  return (
    <main>
      <Header />
      <Slide />
      <BangGiaRealtime />
      <Footer />
    </main>
  );
}
