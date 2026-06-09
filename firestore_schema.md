# Hướng dẫn cấu trúc dữ liệu Cloud Firestore cho Portfolio

Tài liệu này hướng dẫn cách cấu hình các Collection (Bảng) và Document (Bản ghi) trong database Cloud Firestore của bạn để kết nối thành công với website Portfolio.

---

## 1. Cấu trúc tổng quan Database
Database Cloud Firestore của bạn cần có một collection (bộ sưu tập) tên là **`portfolio`**. Trong collection này sẽ chứa **2 documents** (tài liệu) chính:

```
firestore-database/
│
└── 📂 portfolio/               <-- Tên Collection (Bắt buộc)
    ├── 📄 settings/            <-- Document ID chứa passcode trang Admin
    └── 📄 main/                <-- Document ID chứa tất cả nội dung Portfolio
```

---

## 2. Chi tiết Document: `portfolio/settings`
Tài liệu này dùng để lưu mã PIN bảo mật cho trang Admin (`/admin`), giúp chỉ có bạn mới có quyền chỉnh sửa portfolio.

- **Document ID:** `settings`
- **Fields (Các trường):**

| Tên trường | Kiểu dữ liệu | Mô tả | Ví dụ |
| :--- | :--- | :--- | :--- |
| `passcode` | `string` | Mật khẩu truy cập trang Admin (tối thiểu 4 ký tự) | `"1234"` |

> 💡 **Mẹo:** Khi bạn kết nối Firestore trống lần đầu tiên, trang Admin sẽ tự động phát hiện chưa có passcode và yêu cầu bạn thiết lập passcode mới. Sau đó, nó sẽ tự tạo document này cho bạn.

---

## 3. Chi tiết Document: `portfolio/main`
Tài liệu này lưu trữ toàn bộ nội dung hiển thị trên Portfolio (Họ tên, Bio, Kỹ năng, Học vấn, Dự án, v.v.).

- **Document ID:** `main`
- **Fields (Các trường):**

### A. Các trường thông tin cơ bản (Basics)
| Tên trường | Kiểu dữ liệu | Mô tả | Ví dụ |
| :--- | :--- | :--- | :--- |
| `name` | `string` | Họ và tên hiển thị | `"Nguyen An"` |
| `imageUrl` | `string` | Link ảnh đại diện (ảnh cá nhân) | `"https://example.com/avatar.jpg"` |
| `email` | `string` | Địa chỉ email liên hệ | `"hello@example.com"` |
| `phone` | `string` | Số điện thoại liên hệ | `"+84 123 456 789"` |
| `github` | `string` | Đường dẫn tới profile GitHub | `"https://github.com/nguyenan"` |
| `linkedin` | `string` | Đường dẫn tới profile LinkedIn | `"https://linkedin.com/in/nguyenan"` |
| `role` | `map` | Vai trò công việc (Song ngữ) | `{ en: "Frontend Engineer", vn: "Kỹ sư Frontend" }` |
| `bio` | `map` | Giới thiệu ngắn về bản thân (Song ngữ) | `{ en: "I build websites...", vn: "Tôi lập trình web..." }` |
| `location` | `map` | Địa điểm sống hiện tại (Song ngữ) | `{ en: "HCMC, Vietnam", vn: "TP. Hồ Chí Minh, Việt Nam" }` |
| `getInTouch` | `map` | Lời nhắn phần liên hệ cuối trang (Song ngữ) | `{ en: "Say hello!", vn: "Hãy liên hệ với tôi!" }` |

*Lưu ý về Kiểu `map` (Song ngữ):*
Mỗi trường song ngữ cần là một object/map có đúng 2 key: `en` (tiếng Anh) và `vn` (tiếng Việt). Ví dụ:
```json
role: {
  "en": "Frontend Developer",
  "vn": "Lập trình viên Frontend"
}
```

---

### B. Trường `skills` (Kỹ năng)
- **Kiểu dữ liệu:** `array` (mảng chứa các `map`)
- **Cấu trúc mỗi phần tử trong mảng:**
  - `label`: `map` (Nhãn của nhóm kỹ năng - song ngữ)
  - `items`: `array` (Danh sách các kỹ năng cụ thể - mảng string)

**Ví dụ:**
```json
skills: [
  {
    "label": { "en": "Frontend", "vn": "Giao diện" },
    "items": ["React", "Next.js", "TypeScript", "Tailwind CSS"]
  },
  {
    "label": { "en": "Backend", "vn": "Hậu trường" },
    "items": ["Node.js", "PostgreSQL", "Firebase"]
  }
]
```

---

### C. Trường `education` (Học vấn)
- **Kiểu dữ liệu:** `map`
- **Cấu trúc:**
  - `heading`: `map` (Tiêu đề phần học vấn - song ngữ)
  - `school`: `map` (Tên trường học - song ngữ)
  - `degree`: `map` (Bằng cấp - song ngữ)
  - `gpa`: `string` (Điểm trung bình tích lũy)
  - `period`: `string` (Thời gian học)

**Ví dụ:**
```json
education: {
  "heading": { "en": "Education", "vn": "Học vấn" },
  "school": { "en": "University of Science", "vn": "Trường ĐH Khoa học Tự nhiên" },
  "degree": { "en": "B.Sc. in Computer Science", "vn": "Cử nhân Khoa học Máy tính" },
  "gpa": "3.8 / 4.0",
  "period": "2020 — 2024"
}
```

---

### D. Trường `certificates` (Chứng chỉ)
- **Kiểu dữ liệu:** `array` (mảng chứa các `map`)
- **Cấu trúc mỗi phần tử trong mảng:**
  - `id`: `string` (Mã định danh duy nhất cho chứng chỉ)
  - `title`: `map` (Tên chứng chỉ - song ngữ)
  - `issuer`: `map` (Nơi cấp - song ngữ)
  - `date`: `string` (Năm cấp)

**Ví dụ:**
```json
certificates: [
  {
    "id": "cert-1",
    "title": { "en": "AWS Certified Developer", "vn": "Lập trình viên AWS" },
    "issuer": { "en": "Amazon Web Services", "vn": "Amazon Web Services" },
    "date": "2023"
  }
]
```

---

### E. Trường `projects` (Dự án)
- **Kiểu dữ liệu:** `array` (mảng chứa các `map`)
- **Cấu trúc mỗi phần tử trong mảng:**
  - `id`: `string` (Mã định danh duy nhất cho dự án)
  - `title`: `map` (Tên dự án - song ngữ)
  - `description`: `map` (Mô tả ngắn hiển thị trên thẻ card - song ngữ)
  - `detail`: `map` (Mô tả chi tiết hiển thị trong khung chat pop-up - song ngữ)
  - `featured`: `boolean` (Đặt làm dự án nổi bật: `true` / `false`)
  - `tags`: `array` (Danh sách các công nghệ sử dụng - mảng string)
  - `github`: `string` (Link mã nguồn trên GitHub)
  - `demo`: `string` (Link chạy thử sản phẩm)

**Ví dụ:**
```json
projects: [
  {
    "id": "proj-1",
    "title": { "en": "AI Chat Assistant", "vn": "Trợ lý Chat AI" },
    "description": { "en": "An intelligent chatbot...", "vn": "Một chatbot thông minh..." },
    "detail": { "en": "Long detail about implementation...", "vn": "Chi tiết quá trình thực hiện..." },
    "featured": true,
    "tags": ["Next.js", "OpenAI", "TypeScript"],
    "github": "https://github.com/nguyenan/ai-chat",
    "demo": "https://ai-chat.example.com"
  }
]
```

---

## 4. Hướng dẫn thiết lập phân quyền (Security Rules) trong Firestore
Để ứng dụng có thể đọc dữ liệu và trang Admin có thể đọc/ghi dữ liệu, hãy vào tab **Rules** trên Firebase console và cấu hình như sau:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Cho phép mọi người đọc dữ liệu Portfolio
    // Chỉ cho phép ghi (thêm/sửa) nếu passcode hợp lệ hoặc thông qua giao diện Admin đã xác thực cục bộ
    match /portfolio/{document} {
      allow read: if true;
      allow write: if true; // Bạn có thể tinh chỉnh điều kiện bảo mật nâng cao nếu cần thiết.
    }
  }
}
```

---

## 5. Mẹo nhập dữ liệu nhanh
Bạn không cần phải tự tạo thủ công từng trường phức tạp này trên Firestore Console!
1. Điền thông tin Firebase vào file `.env.local` theo file mẫu `.env.local.example`.
2. Khởi chạy dự án ở chế độ phát triển (`npm run dev`).
3. Truy cập vào trang quản trị `/admin` (ví dụ: `http://localhost:3000/admin`).
4. Nhập passcode mới của bạn để khởi tạo trang quản trị.
5. Tại đây, website đã tự động tải cấu trúc mẫu từ `lib/sample-data.ts`. Bạn chỉ cần nhấn nút **Save changes** (Lưu thay đổi) ở dưới cùng.
6. Hệ thống sẽ tự tạo các Collection `portfolio`, Document `main` và `settings` trên Firestore của bạn với đầy đủ cấu trúc chuẩn. Sau đó bạn có thể sửa trực tiếp trên trang `/admin` này hoặc sửa trên Firestore Console đều được!
