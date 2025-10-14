.container {
  background-color: #b50000;
  color: yellow;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* ===== HEADER ===== */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #cc0000;
  padding: 10px 30px;
}

.headerLeft {
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  line-height: 1.4;
  font-weight: bold;
}

.companyName {
  font-size: 1.2rem;
}

.headerCenter h1 {
  color: yellow;
  font-size: 2rem;
  font-weight: 900;
  text-align: center;
}

/* ===== BẢNG ===== */
.table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  background-color: red;
  flex: 1;
}

.table th,
.table td {
  border: 2px solid black;
  padding: 15px;
  font-size: 1.8rem; /* ← giống cỡ chữ số điện thoại */
  font-weight: 900;
  color: white;
  font-family: "Arial", sans-serif;
}

.table th {
  background-color: #a80000;
  color: yellow;
}

.loaiVang {
  color: yellow;
  font-weight: 900;
}

.lienHe {
  color: #ffffff;
  font-weight: 900;
  font-size: 1.8rem; /* giữ nguyên cho đồng bộ */
  background-color: #002e91;
  border-left: 3px solid black;
  white-space: pre-line;
}

/* ===== CHỮ CHẠY ===== */
.marquee {
  background-color: #cc0000;
  color: yellow;
  font-weight: bold;
  padding: 10px 0;
  overflow: hidden;
  white-space: nowrap;
  font-size: 1.4rem;
}

.marquee span {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 15s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

/* Tự co giãn full màn hình */
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
