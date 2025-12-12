import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ShieldCheck, Home, FileText, UserCheck, Menu, BarChart2, Award, Briefcase } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  role: UserRole;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ role, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path 
    ? "bg-white/10 text-white shadow-inner" 
    : "text-gray-200 hover:bg-white/5 hover:text-white";

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="bg-gov-primary text-white shadow-deep sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-all">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-wide leading-tight">Sync</span>
                <span className="text-xs text-gov-accent font-medium tracking-wider">بوابة الدخول الموحدة</span>
              </div>
            </Link>
            <div className="hidden md:block md:mr-12">
              <div className="flex items-baseline space-x-2 space-x-reverse">
                <Link to="/dashboard" className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/dashboard')}`}>
                  <div className="flex items-center gap-2"><Home size={18}/> لوحة المعلومات</div>
                </Link>
                
                {role === UserRole.STUDENT && (
                  <>
                    <Link to="/profile" className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/profile')}`}>
                      <div className="flex items-center gap-2"><FileText size={18}/> الملف المهني</div>
                    </Link>
                    <Link to="/achievements" className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/achievements')}`}>
                      <div className="flex items-center gap-2"><Award size={18}/> معرض الإنجازات</div>
                    </Link>
                    <Link to="/skill-gap" className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/skill-gap')}`}>
                      <div className="flex items-center gap-2"><BarChart2 size={18}/> تحليل المهارات</div>
                    </Link>
                  </>
                )}

                <Link to="/verify" className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/verify')}`}>
                  <div className="flex items-center gap-2"><ShieldCheck size={18}/> التحقق من الشهادات</div>
                </Link>

                {role === UserRole.HR && (
                  <>
                    <Link to="/hr-dashboard" className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/hr-dashboard')}`}>
                      <div className="flex items-center gap-2"><Briefcase size={18}/> مركز التوظيف الذكي</div>
                    </Link>
                    <Link to="/review" className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive('/review')}`}>
                      <div className="flex items-center gap-2"><UserCheck size={18}/> المراجعة اليدوية</div>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-100 border border-red-500/30 px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300"
            >
              <LogOut size={18} /> تسجيل الخروج
            </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-gov-secondary focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gov-secondary">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">لوحة المعلومات</Link>
            {role === UserRole.STUDENT && (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">الملف المهني</Link>
                  <Link to="/achievements" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">معرض الإنجازات</Link>
                  <Link to="/skill-gap" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">تحليل المهارات</Link>
                </>
            )}
            <Link to="/verify" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">التحقق من الشهادات</Link>
            {role === UserRole.HR && (
                <>
                  <Link to="/hr-dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">مركز التوظيف الذكي</Link>
                  <Link to="/review" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10">المراجعة اليدوية</Link>
                </>
            )}
            <button onClick={handleLogout} className="w-full text-right block px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-red-900/50">تسجيل الخروج</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
