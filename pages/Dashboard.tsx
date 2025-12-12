import React from 'react';
import AIForecastCard from '../components/AIForecastCard';
import { BookOpen, Award, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <header className="flex items-end justify-between border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gov-primary tracking-tight">لوحة المعلومات</h1>
          <p className="text-gray-500 mt-2 text-lg">نظرة عامة على الأداء الاستراتيجي</p>
        </div>
        <div className="flex gap-3">
            <span className="px-4 py-1.5 bg-gov-accent/10 text-gov-accent text-sm font-bold rounded-full border border-gov-accent/20 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-gov-accent animate-pulse"></span>
                النظام متصل
            </span>
        </div>
      </header>

      {/* Main AI Forecast Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gov-primary rounded-full"></span>
            التخطيط الاستراتيجي (AI Forecast)
        </h2>
        <AIForecastCard />
      </section>

      {/* Quick Links / Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/profile" className="group bg-gradient-to-br from-gov-primary to-gov-secondary p-1 rounded-2xl shadow-card hover:shadow-deep transition-all">
              <div className="bg-white rounded-xl p-6 h-full flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-50 text-gov-primary rounded-xl group-hover:bg-gov-primary group-hover:text-white transition-colors">
                          <BookOpen size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-gray-900">الملف المهني الموثق</h3>
                          <p className="text-sm text-gray-500">استعراض وتصدير السيرة الذاتية</p>
                      </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gov-primary group-hover:text-white transition-colors">
                      <ArrowLeft size={20} />
                  </div>
              </div>
          </Link>
          
          <Link to="/verify" className="group bg-gradient-to-br from-gov-accent to-green-600 p-1 rounded-2xl shadow-card hover:shadow-deep transition-all">
              <div className="bg-white rounded-xl p-6 h-full flex items-center justify-between">
                  <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-50 text-gov-accent rounded-xl group-hover:bg-gov-accent group-hover:text-white transition-colors">
                          <Award size={24} />
                      </div>
                      <div>
                          <h3 className="font-bold text-gray-900">التحقق من الشهادات</h3>
                          <p className="text-sm text-gray-500">خدمة التحقق الفوري عبر Blockchain</p>
                      </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gov-accent group-hover:text-white transition-colors">
                      <ArrowLeft size={20} />
                  </div>
              </div>
          </Link>
      </div>
    </div>
  );
};

export default Dashboard;