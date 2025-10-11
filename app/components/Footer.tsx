"use client";
import Link from "next/link";

export default function Footer() {
  return (
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
  );
}
