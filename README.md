# Bài tập lớn - Toán Rời Rạc 2 - Nhóm 6

**Hamilton Simulator** - Ứng dụng mô phỏng đường đi Hamilton trên đồ thị

## 📋 Giới thiệu

Đây là một ứng dụng web tương tác giúp học tập và mô phỏng các thuật toán tìm đường đi Hamilton trên đồ thị. Ứng dụng cho phép:
- Xây dựng đồ thị tương tác
- Mô phỏng các bước tìm đường đi Hamilton
- Trực quan hóa quá trình tìm kiếm

## 🚀 Hướng dẫn cài đặt và chạy

### 1️⃣ Cài đặt Node.js

#### Windows:
1. Truy cập [nodejs.org](https://nodejs.org)
2. Tải xuống bản LTS (Long Term Support) mới nhất
3. Chạy file cài đặt (.msi) và làm theo hướng dẫn
4. Chọn "Add to PATH" để thêm Node.js vào biến môi trường
5. Hoàn thành cài đặt

Kiểm tra cài đặt thành công:
```bash
node --version
npm --version
```

#### Linux (Ubuntu/Debian):
```bash
# Cập nhật package manager
sudo apt update

# Cài đặt Node.js từ NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra cài đặt
node --version
npm --version
```

### 2️⃣ Cài đặt Dependencies

Sau khi Node.js đã được cài đặt, mở terminal/cmd tại thư mục dự án và chạy:

```bash
npm install
```

Lệnh này sẽ tải xuống tất cả các package cần thiết được liệt kê trong file `package.json`.

### 3️⃣ Chạy ứng dụng ở chế độ Developer

Để khởi động máy chủ phát triển với hot reload:

```bash
npm run dev
```

Ứng dụng sẽ khởi động tại: **http://localhost:3001/**

Bạn có thể mở liên kết này trong trình duyệt web để sử dụng ứng dụng. Khi bạn chỉnh sửa code, trang web sẽ tự động cập nhật mà không cần refresh.

## 📦 Công nghệ sử dụng

- **React 19** - Thư viện UI
- **Vite** - Công cụ build hiện đại
- **Tailwind CSS v4** - Framework CSS
- **Lucide React** - Icon library
- **React Router** - Định tuyến

## 🛠️ Lệnh hữu ích

| Lệnh | Mô tả |
|------|-------|
| `npm run dev` | Chạy ứng dụng ở chế độ phát triển |
| `npm run build` | Build ứng dụng cho production |
| `npm run preview` | Xem trước build production |
| `npm run lint` | Kiểm tra lỗi code |

## 💡 Lưu ý về giao diện

- Ứng dụng hỗ trợ **Dark Mode** và **Light Mode** - nhấp vào nút mặt trời/mặt trăng ở góc trên bên phải để chuyển đổi
- Giao diện được tối ưu hóa cho **tablet và mobile** với sidebar có thể thu gọn
- Trên mobile, click vào biểu tượng menu để mở các sidebar
