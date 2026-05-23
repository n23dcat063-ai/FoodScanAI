import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'FoodScan AI – Nhận Diện & Phân Tích Dinh Dưỡng Món Ăn',
  description:
    'Phân tích calo và dinh dưỡng từ ảnh món ăn bằng AI. Nhận kết quả tức thì về protein, carbs, chất béo và tổng lượng calo của bất kỳ món ăn nào.',
  keywords: ['nhận diện món ăn', 'tính calo', 'dinh dưỡng AI', 'food recognition', 'calorie counter'],
  authors: [{ name: 'FoodScan AI' }],
  openGraph: {
    title: 'FoodScan AI – Nhận Diện & Phân Tích Dinh Dưỡng',
    description: 'Phân tích calo và dinh dưỡng từ ảnh món ăn bằng trí tuệ nhân tạo',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <div className="app-layout">
          {/* ── Navigation Bar ── */}
          <nav className="navbar" role="navigation" aria-label="Main navigation">
            <a href="/" className="navbar-brand" aria-label="FoodScan AI Home">
              <div className="navbar-logo" aria-hidden="true">🥦</div>
              <div>
                <span className="navbar-title">FoodScan AI</span>
                <span className="navbar-subtitle">Dinh dưỡng thông minh mỗi ngày</span>
              </div>
            </a>
          </nav>

          {/* ── Main Content ── */}
          <main className="main-content" id="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}