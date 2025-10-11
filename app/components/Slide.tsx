"use client";
import { useEffect, useState } from "react";

const slidesData = [
  {
    title: "Tinh tế – Uy tín – Chất lượng",
    desc: "Vàng Bạc Công Ngọc – Niềm tin vững chắc của mọi nhà",
    img: "/images/slide1.jpg",
  },
  {
    title: "Trang sức sang trọng",
    desc: "Mang đến vẻ đẹp tinh khôi và quý phái cho phái đẹp",
    img: "/images/slide2.jpg",
  },
  {
    title: "Đẳng cấp và tinh xảo",
    desc: "Mỗi sản phẩm là một tác phẩm nghệ thuật độc đáo",
    img: "/images/slide3.jpg",
  },
];

export default function Slide() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slidesData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden h-[150px] md:h-[220px] bg-red-700 text-yellow-300">
      {slidesData.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{ backgroundImage: `url('${s.img}')` }}
        >
          <div className="bg-black/40 w-full h-full absolute inset-0"></div>
          <div className="relative z-10 text-center px-4 md:px-10 top-1/4">
            <h2 className="text-3xl md:text-5xl font-bold mb-3">{s.title}</h2>
            <p className="text-base md:text-lg mb-6">{s.desc}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
