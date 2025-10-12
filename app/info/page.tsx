import Header from "../components/Header";
import Footer from "../components/Footer";
import Slide from "../components/Slide";

export const metadata = {
  title: "Vàng Bạc Công Ngọc - Niềm tin và chất lượng",
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

export default function InfoPage() {
  return (
    <main className="fade-in-page">
      <Header />
      <Slide />

      {/* Nội dung chính */}
      <section className="py-12 md:py-16 bg-yellow-50">
        <div className="container mx-auto px-4 md:px-12 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-extrabold text-red-700 mb-8">
            Thông tin về Vàng Bạc Công Ngọc
          </h2>

          <p className="mb-6 text-gray-800 text-base md:text-lg">
            💎 Vàng Bạc Công Ngọc được thành lập từ năm XXXX, với hơn XX năm
            kinh nghiệm trong lĩnh vực kinh doanh vàng bạc đá quý. Chúng tôi
            cam kết mang đến những sản phẩm chất lượng cao, tinh xảo và uy tín
            cho khách hàng.
          </p>

          <p className="mb-6 text-gray-800 text-base md:text-lg">
            🏆 Chúng tôi cung cấp đa dạng các sản phẩm như nhẫn, dây chuyền,
            vòng tay, bông tai, được chế tác tỉ mỉ từ vàng, bạc, đá quý cao
            cấp. Mỗi sản phẩm đều được kiểm định chất lượng nghiêm ngặt trước
            khi đến tay khách hàng.
          </p>

          <p className="mb-6 text-gray-800 text-base md:text-lg">
            📍 Địa chỉ cửa hàng: Ngã Tư Vũ Dũng, Xã Lai Khê, Hải Phòng.
            <br />
            📞 Hotline: 0904 588 222
            <br />
            🕒 Giờ mở cửa: 8:00 – 20:00 mỗi ngày
          </p>

          {/* Bản đồ */}
    <div className="mb-6 w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
      <iframe
        title="Bản đồ Vàng Bạc Công Ngọc"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14902.206332870059!2d106.42128821225592!3d20.970515577150685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313583000877bcc7%3A0xaefbf9620c0ab99a!2zRG9hbmggbmdoaeG7h3AgdMawIG5ow6JuIFbDoG5nIGLhuqFjIEPDtG5nIE5n4buNYw!5e0!3m2!1svi!2s!4v1760166002063!5m2!1svi!2s"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>

          <p className="mb-6 text-gray-800 text-base md:text-lg">
            Chúng tôi luôn đặt uy tín và sự hài lòng của khách hàng lên hàng
            đầu, đảm bảo mỗi sản phẩm đều mang lại giá trị và sự hài lòng
            tuyệt đối.
          </p>

          <p className="text-gray-800 text-base md:text-lg">
            💖 Hãy đến và trải nghiệm sự tinh tế, sang trọng và đẳng cấp của
            Vàng Bạc Công Ngọc ngay hôm nay!
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
