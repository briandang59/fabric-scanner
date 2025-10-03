import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <h2>Không tìm thấy trang</h2>
      <p>
        Quay lại <Link href="/">trang chủ</Link>.
      </p>
    </div>
  );
}
