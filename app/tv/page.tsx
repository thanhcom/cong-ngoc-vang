"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./BangGiaVangCongNgoc.module.css";

interface BangGia {
  id: number;
  loai_vang: string;
  mua_vao: number;
  ban_ra: number;
}

export default function BangGiaVangCongNgoc() {
  const [data, setData] = useState<BangGia[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("bang_gia_vang").select("*");
      if (data) setData(data);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.companyName}>
            DOANH NGHIỆP VÀNG BẠC CÔNG NGỌC
          </div>
          <div>ĐC: Ngã Tư Vũ Dũng, Xã Lai Khê, Hải Phòng</div>
          <div>ĐT: 0904 588 222</div>
        </div>
        <div className={styles.headerCenter}>
          <h1>BẢNG GIÁ VÀNG HÔM NAY</h1>
        </div>
      </header>

      {/* Bảng giá */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>LOẠI VÀNG</th>
            <th>GIÁ MUA</th>
            <th>GIÁ BÁN</th>
            <th>LIÊN HỆ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td className={styles.loaiVang}>{item.loai_vang}</td>
              <td>{item.mua_vao.toLocaleString()}</td>
              <td>{item.ban_ra.toLocaleString()}</td>

              {index === 0 && (
                <td className={styles.lienHe} rowSpan={data.length}>
                  <div className={styles.contactBox}>                    
                    <div>0904 588 222</div>
                    <div>0904 588 222</div>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Chữ chạy */}
      <div className={styles.marquee}>
        <span> VÀNG BẠC CÔNG NGỌC RẤT HÂN HẠNH ĐƯỢC PHỤC VỤ QUÝ KHÁCH - 📞   0904 588 222 </span>
      </div>
    </div>
  );
}
