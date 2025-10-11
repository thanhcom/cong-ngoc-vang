import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Vàng Bạc Công Ngọc",
  description: "Doanh nghiệp tư nhân vàng bạc Công Ngọc - Uy tín, chất lượng hàng đầu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="bg-white text-gray-800">
        {children}
      </body>
    </html>
  );
}
