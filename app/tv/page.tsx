"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./BangGiaVang.module.css";

interface BangGia {
  id: number;
  loai_vang: string;
  mua_vao: number;
  ban_ra: number;
}

export default function BangGiaVangCongNgoc() {
  const [data, setData] = useState<BangGia[]>([]);
  const [highlightId, setHighlightId] = useState<number | null>(null);

  useEffect(() => {
    // Lấy dữ liệu lần đầu, sắp xếp theo id
    const fetchData = async () => {
      const { data } = await supabase
        .from("bang_gia_vang")
        .select("*")
        .order("id", { ascending: true });

      if (data) setData(data);
    };

    fetchData();

    // Subscribe realtime
    const subscription = supabase
      .channel("realtime-bang-gia")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bang_gia_vang" },
        (payload) => {
          setData((current) => {
            let newData = [...current];
            const newItem = payload.new as BangGia;
            const oldItem = payload.old as BangGia;

            switch (payload.eventType) {
              case "INSERT":
                newData.push(newItem);
                setHighlightId(newItem.id);
                break;
              case "UPDATE":
                newData = current.map((item) =>
                  item.id === newItem.id ? newItem : item
                );
                setHighlightId(newItem.id);
                break;
              case "DELETE":
                newData = current.filter((item) => item.id !== oldItem.id);
                break;
            }

            // Sắp xếp lại theo id
            newData.sort((a, b) => a.id - b.id);

            // Xóa highlight sau 1s
            if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
              setTimeout(() => setHighlightId(null), 1000);
            }

            return newData;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
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
            <tr
              key={item.id}
              className={item.id === highlightId ? styles.highlightRow : ""}
            >
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
        <span>
          VÀNG BẠC CÔNG NGỌC RẤT HÂN HẠNH ĐƯỢC PHỤC VỤ QUÝ KHÁCH - 📞 0904 588 222
        </span>
      </div>
    </div>
  );
}
