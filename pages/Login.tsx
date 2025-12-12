import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Fingerprint, Lock, ChevronLeft, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [nationalId, setNationalId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleNafathCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.auth.validateId(nationalId);
      
      if (response.is_valid) {
        setStep(2);
      } else {
        await logFailure("INVALID_ID_LUHN", `Failed Luhn check for ID: ${nationalId}`);
        setError('رقم الهوية غير صحيح، يرجى التأكد والمحاولة مرة أخرى.');
      }
    } catch (err) {
      setError('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock Credential Check
    await new Promise(r => setTimeout(r, 800)); // Simulate delay

    let role: UserRole | null = null;
    if (username === 'student' && password === '1234') role = UserRole.STUDENT;
    else if (username === 'hr' && password === '1234') role = UserRole.HR;

    if (role) {
      onLogin(role);
      navigate('/dashboard');
    } else {
      await logFailure("LOGIN_FAILURE", `Failed login attempt for user: ${username}`);
      setError('بيانات الدخول غير صحيحة.');
    }
    setIsLoading(false);
  };

  const logFailure = async (type: string, content: string) => {
    const pendingCerts = JSON.parse(localStorage.getItem('pendingCerts') || '[]');
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: type,
      content: content,
      timestamp: new Date().toISOString(),
      status: 'PENDING'
    };
    localStorage.setItem('pendingCerts', JSON.stringify([...pendingCerts, newItem]));
  };

  return (
    <div className="min-h-screen bg-gov-light flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-[50vh] bg-gov-primary rounded-b-[40%] shadow-2xl z-0"></div>
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl z-0"></div>
      <div className="absolute top-40 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl z-0"></div>

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-deep overflow-hidden border border-gray-100">
        <div className="bg-gov-primary p-10 text-center relative overflow-hidden">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-2xl mb-6 backdrop-blur-md shadow-inner border border-white/20">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Sync</h1>
            <p className="text-blue-100 text-sm font-medium tracking-wide opacity-90">بوابة الدخول الموحدة</p>
          </div>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <form onSubmit={handleNafathCheck} className="space-y-6">
              <div className="text-center mb-8">
                 <h2 className="text-xl font-bold text-gray-800">تسجيل الدخول</h2>
                 <p className="text-gray-500 text-sm mt-2">التحقق من الهوية الرقمية عبر نفاذ</p>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">رقم الهوية الوطنية</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Fingerprint className="h-5 w-5 text-gray-400 group-focus-within:text-gov-primary transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))} // Numbers only
                    className="block w-full pr-11 pl-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gov-primary/20 focus:border-gov-primary transition-all outline-none font-medium text-gray-900 placeholder-gray-400"
                    placeholder="1xxxxxxxxx"
                    maxLength={10}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-start gap-3 border border-red-100">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-gov-accent hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    جاري التحقق...
                  </>
                ) : (
                  'تسجيل الدخول عبر نفاذ الوطني'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleFinalLogin} className="space-y-6 animate-in slide-in-from-right duration-300">
               <div className="text-center mb-8">
                 <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-3">
                   <Shield size={24} />
                 </div>
                 <h2 className="text-xl font-bold text-gray-800">إكمال المصادقة</h2>
                 <p className="text-gray-500 text-sm mt-1">تم التحقق من الهوية بنجاح</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">اسم المستخدم</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gov-primary/20 focus:border-gov-primary transition-all outline-none"
                    placeholder="student / hr"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700">كلمة المرور</label>
                  <div className="relative group">
                     <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gov-primary transition-colors" />
                     </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pr-11 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gov-primary/20 focus:border-gov-primary transition-all outline-none"
                      placeholder="••••"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl flex items-start gap-3 border border-red-100">
                  <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-4 pt-2">
                 <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 px-4 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <ChevronLeft size={16} />
                  رجوع
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gov-primary hover:bg-gov-secondary transition-all disabled:opacity-70 transform active:scale-[0.98]"
                >
                  {isLoading ? 'جاري الدخول...' : 'متابعة الدخول'}
                </button>
              </div>
            </form>
          )}
        </div>
        
        <div className="bg-gray-50 px-8 py-5 border-t border-gray-100 flex justify-center">
           <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
             {/* Simple visual placeholder for logos */}
             <div className="h-6 w-20 bg-gray-300 rounded"></div>
             <div className="h-4 w-[1px] bg-gray-300 mx-2"></div>
             <div className="h-6 w-16 bg-gray-300 rounded"></div>
           </div>
        </div>
      </div>
      
      <p className="mt-8 text-gov-primary/60 text-xs font-medium">جميع الحقوق محفوظة © 2024 Sync Platform</p>
    </div>
  );
};

export default Login;
