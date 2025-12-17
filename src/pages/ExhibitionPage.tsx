import { Link } from 'react-router-dom';

export default function ExhibitionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gold-500/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/img/VIETNAM_MAP.jpg" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide">VNR202</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Nhóm 7 - FPT University</p>
            </div>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link to="/" className="text-white hover:text-gold-400 transition-colors tracking-wide">TRANG CHỦ</Link>
            <Link to="/noi-dung" className="text-white hover:text-gold-400 transition-colors tracking-wide">NỘI DUNG</Link>
            <Link to="/trien-lam" className="text-gold-400 font-semibold border-b-2 border-gold-400 pb-1 tracking-wide">TRIỂN LÃM</Link>
            <Link to="/on-tap" className="text-white hover:text-gold-400 transition-colors tracking-wide">ÔN TẬP</Link>
            <Link to="/games" className="text-white hover:text-gold-400 transition-colors tracking-wide">GAME</Link>
            <Link to="/tai-lieu" className="text-white hover:text-gold-400 transition-colors tracking-wide">TÀI LIỆU</Link>
          </nav>
          <Link to="/" className="bg-gradient-to-r from-gold-500 to-gold-600 text-black px-6 py-2 rounded-full font-bold hover:from-gold-600 hover:to-gold-700 transition-all">
            🏠 Về trang chủ
          </Link>
        </div>
      </header>

      {/* Exhibition Iframe */}
      <div className="flex-1 pt-[73px]">
        <iframe
          src="https://metasteps.com/viewer/46e5bfbe-34ac-42f7-960a-1a8f9a0e9942"
          title="Triển Lãm Số - Công Cuộc Đổi Mới"
          className="w-full h-full border-0"
          style={{ minHeight: 'calc(100vh - 73px)' }}
          allowFullScreen
        />
      </div>
    </div>
  );
}
