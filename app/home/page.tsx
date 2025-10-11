"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// 👉 Kết nối Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface GiaVang {
  id: number;
  loai_vang: string;
  mua_vao: number;
  ban_ra: number;
  don_vi: string;
  updated_at: string;
}

// Hàm tính "time ago" kiểu Facebook
function timeAgo(dateString: string) {
  const now = new Date();
  const updated = new Date(dateString);
  const diff = Math.floor((now.getTime() - updated.getTime()) / 1000); // tính giây

  if (diff < 60) return `${diff} giây trước`;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;

  const days = Math.floor(diff / 86400);
  if (days < 7) return `${days} ngày trước`;
  if (days < 30) return `${Math.floor(days / 7)} tuần trước`;
  if (days < 365) return `${Math.floor(days / 30)} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}

export default function Home() {
  const [bangGia, setBangGia] = useState<GiaVang[]>([]);
  const [timeNow, setTimeNow] = useState<Date>(new Date());

  // Lấy dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("bang_gia_vang")
        .select("*")
        .order("id", { ascending: true });
      if (!error && data) setBangGia(data);
    };
    fetchData();
  }, []);

  // Lắng nghe realtime Supabase
  useEffect(() => {
    const channel = supabase
      .channel("realtime:bang_gia_vang")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bang_gia_vang" },
        (payload) => {
          setBangGia((prev) => {
            if (payload.eventType === "UPDATE") {
              return prev.map((r) =>
                r.id === payload.new.id ? (payload.new as GiaVang) : r
              );
            }
            if (payload.eventType === "INSERT") {
              return [...prev, payload.new as GiaVang];
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Auto update thời gian mỗi giây
  useEffect(() => {
    const interval = setInterval(() => setTimeNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Slide auto chạy
  useEffect(() => {
    if (typeof window === "undefined") return;
    const slides = document.querySelectorAll(
      ".slide"
    ) as NodeListOf<HTMLElement>;
    let index = 0;
    let prevIndex = slides.length - 1;

    const showSlide = (n: number) => {
      slides.forEach((slide, i) => {
        slide.classList.remove("active-slide", "prev-slide");
        if (i === n) slide.classList.add("active-slide");
        else if (i === prevIndex) slide.classList.add("prev-slide");
      });
      prevIndex = n;
    };

    const next = document.getElementById("next");
    const prev = document.getElementById("prev");

    next?.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      showSlide(index);
    });
    prev?.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      showSlide(index);
    });

    const auto = setInterval(() => {
      index = (index + 1) % slides.length;
      showSlide(index);
    }, 5000);

    return () => clearInterval(auto);
  }, []);

  return (
    <main className="fade-in-page">
      {/* Header */}
      <header className="bg-red-700 text-yellow-300 py-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex flex-wrap justify-between items-center px-4 md:px-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-wide">
            💎 Vàng Bạc Công Ngọc
          </h1>
          <nav className="w-full md:w-auto flex justify-center md:justify-end mt-3 md:mt-0 space-x-4 md:space-x-6 text-sm md:text-base">
            <a href="#" className="hover:text-white transition">
              Trang chủ
            </a>
            <a href="#" className="hover:text-white transition">
              Sản phẩm
            </a>
            <a href="#" className="hover:text-white transition">
              Giới thiệu
            </a>
            <a href="#" className="hover:text-white transition">
              Liên hệ
            </a>
          </nav>
        </div>
      </header>

      {/* Slide */}
      <section className="relative overflow-hidden h-[200px] md:h-[280px] bg-red-700 text-yellow-300">
        <div className="absolute inset-0">
          {[
            {
              title: "Tinh tế – Uy tín – Chất lượng",
              desc: "Vàng Bạc Công Ngọc – Niềm tin vững chắc của mọi nhà",
            },
            {
              title: "Trang sức sang trọng",
              desc: "Mang đến vẻ đẹp tinh khôi và quý phái cho phái đẹp",
            },
            {
              title: "Đẳng cấp và tinh xảo",
              desc: "Mỗi sản phẩm là một tác phẩm nghệ thuật độc đáo",
            },
          ].map((s, i) => (
            <div
              key={i}
              className={`slide ${i === 0 ? "active-slide" : ""} bg-cover bg-center`}
              style={{ backgroundImage: `url('${s.img}')` }}
            >
              <div className="bg-black/40 w-full h-full absolute inset-0"></div>
              <div className="relative z-10 text-center px-4 md:px-10">
                <h2 className="text-3xl md:text-5xl font-bold mb-3">{s.title}</h2>
                <p className="text-base md:text-lg mb-6">{s.desc}</p>
                {i === 0 && (
                  <a
                    href="#"
                    className="bg-yellow-400 text-red-800 px-5 py-2 md:px-6 md:py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-300 transition"
                  >
                    Khám phá ngay
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          id="prev"
          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 md:p-3 transition"
        >
          ‹
        </button>
        <button
          id="next"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 md:p-3 transition"
        >
          ›
        </button>
      </section>

      {/* Bảng giá */}
      <section className="py-12 md:py-16 bg-yellow-50">
        <div className="container mx-auto px-4 md:px-12 text-center">
          <h3 className="text-3xl md:text-4xl font-extrabold text-red-700 mb-8">
            Bảng giá vàng hôm nay
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-xl rounded-xl overflow-hidden text-base md:text-lg">
              <thead className="bg-red-700 text-white text-lg md:text-xl font-bold">
                <tr>
                  <th className="py-4 px-6">Loại vàng</th>
                  <th className="py-4 px-6">Mua vào</th>
                  <th className="py-4 px-6">Bán ra</th>
                  <th className="py-4 px-6">Cập nhật</th>
                </tr>
              </thead>
              <tbody className="text-gray-900 font-semibold">
                {bangGia.map((row) => (
                  <tr key={row.id} className="border-b hover:bg-yellow-100">
                    <td className="py-4 px-6">{row.loai_vang}</td>
                    <td className="py-4 px-6">
                      {row.mua_vao.toLocaleString("vi-VN")} {row.don_vi}
                    </td>
                    <td className="py-4 px-6">
                      {row.ban_ra.toLocaleString("vi-VN")} {row.don_vi}
                    </td>
                    <td
                      className="py-4 px-6 text-yellow-400 hover:text-yellow-600 transition cursor-default"
                      title={new Date(row.updated_at).toLocaleString()}
                    >
                      {timeAgo(row.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-800 text-white py-8">
        <div className="container mx-auto px-4 md:px-12 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm md:text-base font-semibold text-yellow-300">
              © 2025 Vàng Bạc Công Ngọc
            </p>
            <p className="text-xs md:text-sm text-yellow-300">
              Dev By Thành Trang Electronic
            </p>
          </div>

          <div className="text-center md:text-left space-y-1">
            <p className="font-semibold text-yellow-300">
              💎 Doanh nghiệp tư nhân Vàng Bạc Công Ngọc
            </p>
            <p className="font-semibold text-yellow-300">
              📞 Hotline:{" "}
              <a href="tel:0904588222" className="hover:underline">
                0904 588 222
              </a>
            </p>
            <p className="font-semibold text-yellow-300">
              🏠 Địa chỉ: Ngã Tư Vũ Dũng, Xã Lai Khê, Hải Phòng
            </p>
          </div>

          <div className="flex justify-center md:justify-end space-x-4">
            {/* Facebook */}
            <a
              href="https://www.facebook.com/vang.bac.cong.ngoc.177478"
              className="flex items-center space-x-1 font-semibold transition transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="#1877F2"
              >
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.093 4.388 23.093 10.125 24v-8.438H7.078v-3.489h3.047V9.797c0-3.012 1.792-4.687 4.533-4.687 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.49 0-1.953.931-1.953 1.888v2.26h3.328l-.532 3.49h-2.796V24C19.612 23.093 24 18.093 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </a>

            {/* Zalo */}
            <a
              href="https://zalo.me/0904588222"
              className="flex items-center space-x-1 font-semibold transition transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
                alt="Zalo"
                width="22"
                height="22"
              />
              <span>Zalo</span>
            </a>

            {/* TikTok */}
            <a
              href="#"
              className="flex items-center space-x-1 font-semibold transition transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#25F4EE"
                  d="M9 19.5a6 6 0 0 1 0-12v3a3 3 0 0 0 0 6 3 3 0 0 0 3-3V2h3a4 4 0 0 0 4 4v3a7 7 0 0 1-7-7v12a6 6 0 0 1-6 6Z"
                />
                <path
                  fill="#FE2C55"
                  d="M21 9a7 7 0 0 1-7-7v4a4 4 0 0 0 4 4v2a6 6 0 0 1-6-6v10a6 6 0 0 1-12 0v-2a9 9 0 0 0 18 0Z"
                />
              </svg>
              <span>TikTok</span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
