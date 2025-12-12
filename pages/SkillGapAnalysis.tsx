import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { SkillGapData } from '../types';
import { Target, CheckCircle, AlertTriangle, Book, ArrowUpRight, Zap } from 'lucide-react';

const SkillGapAnalysis: React.FC = () => {
  const [data, setData] = useState<SkillGapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating fetching based on logged-in user
    api.data.getSkillGap('1234567890').then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-gov-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!data) return <div className="text-center p-10 text-red-500">فشل تحميل البيانات</div>;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="bg-white border-b border-gray-200 pb-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gov-primary/10 rounded-lg text-gov-primary">
                <Target size={24} />
            </div>
            <h1 className="text-2xl font-extrabold text-gov-primary tracking-tight">تحليل الفجوة المهارية (AI)</h1>
        </div>
        <p className="text-gray-500">مقارنة مهاراتك الحالية مع متطلبات سوق العمل (MHRSD) لتحقيق رؤية 2030</p>
      </header>

      {/* Hero Card - Target Role */}
      <div className="bg-gradient-to-r from-gov-primary to-gov-secondary rounded-2xl p-8 text-white shadow-card flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <div className="text-blue-200 text-xs font-bold uppercase tracking-wider">المسار المهني المستهدف</div>
                <div className="px-2 py-0.5 bg-white/10 rounded text-[10px] text-white font-medium border border-white/10">MHRSD Data</div>
            </div>
            <h2 className="text-3xl font-bold mb-3">{data.target_role}</h2>
            <div className="inline-flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm border border-green-500/30 text-green-300">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                مستوى الطلب: {data.market_demand_level}
            </div>
         </div>

         <div className="text-center relative z-10">
             <div className="relative w-28 h-28 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                     <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                     <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={301.6} strokeDashoffset={301.6 * (1 - data.match_percentage / 100)} className="text-gov-accent transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(40,167,69,0.5)]" strokeLinecap="round" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold">{data.match_percentage}%</span>
                    <span className="text-[10px] opacity-70">المطابقة</span>
                 </div>
             </div>
         </div>
      </div>

      {/* Visual Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Owned Skills - Success Zone */}
          <div className="bg-white rounded-2xl shadow-card border border-green-100 overflow-hidden group hover:shadow-deep transition-all duration-300">
              <div className="bg-gradient-to-l from-green-50 to-white p-5 border-b border-green-100 flex justify-between items-center">
                  <h3 className="font-bold text-green-800 flex items-center gap-2 text-lg">
                      <div className="p-1.5 bg-green-100 rounded-lg"><CheckCircle size={20} className="text-green-600" /></div>
                      نقاط القوة (مكتسبة)
                  </h3>
                  <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">{data.owned_skills.length} مهارات</span>
              </div>
              <div className="p-6">
                  <ul className="space-y-3">
                      {data.owned_skills.map((skill, idx) => (
                          <li key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50/30 transition-colors">
                              <span className="font-bold text-gray-700">{skill}</span>
                              <div className="flex gap-1">
                                  {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-4 bg-green-500 rounded-full opacity-80"></div>)}
                              </div>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>

          {/* Missing Skills - Opportunity Zone */}
          <div className="bg-white rounded-2xl shadow-card border border-orange-100 overflow-hidden group hover:shadow-deep transition-all duration-300">
              <div className="bg-gradient-to-l from-orange-50 to-white p-5 border-b border-orange-100 flex justify-between items-center">
                  <h3 className="font-bold text-orange-800 flex items-center gap-2 text-lg">
                      <div className="p-1.5 bg-orange-100 rounded-lg"><Zap size={20} className="text-orange-600" /></div>
                      فرص التطوير (مطلوبة)
                  </h3>
                  <span className="text-xs font-bold bg-orange-100 text-orange-700 px-3 py-1 rounded-full border border-orange-200">{data.missing_skills.length} فجوات</span>
              </div>
              <div className="p-6">
                  <ul className="space-y-3">
                      {data.missing_skills.map((skill, idx) => (
                          <li key={idx} className="flex items-center gap-4 p-4 bg-orange-50/30 rounded-xl border border-orange-200/60 border-dashed hover:bg-orange-50 transition-colors">
                              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">
                                  {idx + 1}
                              </div>
                              <span className="font-medium text-gray-800">{skill}</span>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
      </div>

      {/* Recommendations */}
      <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Book size={20} className="text-gov-primary" />
                الدورات المقترحة (لسد الفجوة)
            </h2>
            <span className="text-xs font-medium text-gov-accent bg-green-50 px-2 py-1 rounded border border-green-100">مدعومة من صندوق الموارد البشرية</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.recommended_courses.map((course, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-gov-primary hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer flex justify-between items-center relative overflow-hidden">
                      <div className="absolute left-0 top-0 w-1 h-full bg-gov-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-gov-primary transition-colors text-lg">{course.title}</h4>
                          <span className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                            {course.provider}
                          </span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-gov-primary group-hover:text-white transition-colors shadow-sm">
                          <ArrowUpRight size={20} />
                      </div>
                  </div>
              ))}
          </div>
      </section>
    </div>
  );
};

export default SkillGapAnalysis;
