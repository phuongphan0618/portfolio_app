import type { PortfolioData } from "./portfolio-types"

export const sampleData: PortfolioData = {
  name: "Nguyen An",
  imageUrl: "",
  role: {
    en: "Frontend & AI/ML Engineer",
    vn: "Kỹ sư Frontend & AI/ML",
  },
  bio: {
    en: "I build accessible, pixel-perfect digital experiences for the web. Passionate about AI/ML and creating impactful solutions.",
    vn: "Tôi xây dựng những trải nghiệm số đẹp mắt, dễ tiếp cận cho web. Đam mê AI/ML và tạo ra các giải pháp có ý nghĩa.",
  },
  location: {
    en: "Ho Chi Minh City, Vietnam",
    vn: "Thành phố Hồ Chí Minh, Việt Nam",
  },
  email: "hello@example.com",
  phone: "+84 123 456 789",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  getInTouch: {
    en: "Have a project in mind, or just want to say hi? My inbox is always open — let's create something wonderful together.",
    vn: "Bạn có một dự án trong đầu, hay chỉ muốn chào hỏi? Hộp thư của tôi luôn rộng mở — hãy cùng nhau tạo nên điều tuyệt vời nhé.",
  },
  skills: [
    {
      label: { en: "Frontend", vn: "Giao diện" },
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"],
    },
    {
      label: { en: "Backend", vn: "Hậu trường" },
      items: ["Node.js", "Python", "PostgreSQL", "Firebase", "FastAPI"],
    },
    {
      label: { en: "AI/ML", vn: "AI/ML" },
      items: ["TensorFlow", "PyTorch", "OpenAI API", "LangChain", "HuggingFace"],
    },
    {
      label: { en: "Tools", vn: "Công cụ" },
      items: ["Git", "Docker", "AWS", "Vercel", "Figma"],
    },
  ],
  education: {
    heading: { en: "Education", vn: "Học vấn" },
    school: {
      en: "University of Science",
      vn: "Trường Đại học Khoa học Tự nhiên",
    },
    degree: {
      en: "B.Sc. in Computer Science",
      vn: "Cử nhân Khoa học Máy tính",
    },
    gpa: "3.8 / 4.0",
    period: "2020 — 2024",
  },
  certificates: [
    {
      id: "c1",
      title: { en: "Deep Learning Specialization", vn: "Chuyên ngành Deep Learning" },
      issuer: { en: "DeepLearning.AI", vn: "DeepLearning.AI" },
      date: "2023",
    },
    {
      id: "c2",
      title: { en: "AWS Certified Developer", vn: "Lập trình viên AWS" },
      issuer: { en: "Amazon Web Services", vn: "Amazon Web Services" },
      date: "2023",
    },
    {
      id: "c3",
      title: { en: "Meta Frontend Professional", vn: "Frontend Chuyên nghiệp Meta" },
      issuer: { en: "Meta", vn: "Meta" },
      date: "2022",
    },
  ],
  projects: [
    {
      id: "p1",
      title: { en: "AI Chat Assistant", vn: "Trợ lý Chat AI" },
      description: {
        en: "An intelligent chatbot powered by GPT-4 with custom knowledge base integration.",
        vn: "Một chatbot thông minh dùng GPT-4 tích hợp cơ sở tri thức tùy chỉnh.",
      },
      detail: {
        en: "Built a retrieval-augmented chatbot that ingests company docs, embeds them with OpenAI, and serves grounded answers. Handles 10k+ daily messages with streaming responses and citation links.",
        vn: "Xây dựng chatbot tăng cường truy xuất, nạp tài liệu công ty, nhúng bằng OpenAI và trả lời có căn cứ. Xử lý hơn 10k tin nhắn mỗi ngày với phản hồi theo luồng và trích dẫn nguồn.",
      },
      featured: true,
      tags: ["Next.js", "OpenAI", "TypeScript", "Vercel"],
      github: "https://github.com",
      demo: "https://example.com",
    },
    {
      id: "p2",
      title: { en: "Vision Quality Inspector", vn: "Kiểm định Chất lượng bằng Thị giác" },
      description: {
        en: "Real-time defect detection for manufacturing lines using computer vision.",
        vn: "Phát hiện lỗi theo thời gian thực cho dây chuyền sản xuất bằng thị giác máy tính.",
      },
      detail: {
        en: "Trained a YOLO-based model to flag surface defects from camera streams, cutting manual QA time by 60%. Deployed to edge devices with an ONNX runtime.",
        vn: "Huấn luyện mô hình dựa trên YOLO để phát hiện lỗi bề mặt từ camera, giảm 60% thời gian kiểm tra thủ công. Triển khai trên thiết bị biên với ONNX.",
      },
      featured: false,
      tags: ["Python", "PyTorch", "OpenCV", "Docker"],
      github: "https://github.com",
      demo: "",
    },
    {
      id: "p3",
      title: { en: "Realtime Collab Board", vn: "Bảng Cộng tác Thời gian thực" },
      description: {
        en: "A multiplayer whiteboard with live cursors and offline sync.",
        vn: "Bảng trắng nhiều người dùng với con trỏ trực tiếp và đồng bộ ngoại tuyến.",
      },
      detail: {
        en: "Implemented CRDT-based sync so dozens of users can draw together without conflicts. Presence, undo history, and export to PNG/SVG included.",
        vn: "Triển khai đồng bộ dựa trên CRDT để hàng chục người dùng vẽ cùng lúc mà không xung đột. Có hiển thị hiện diện, lịch sử hoàn tác và xuất PNG/SVG.",
      },
      featured: false,
      tags: ["React", "WebSocket", "Node.js", "PostgreSQL"],
      github: "https://github.com",
      demo: "https://example.com",
    },
  ],
}
