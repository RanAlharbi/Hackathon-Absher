import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Candidate, PredictiveScore, StudentMetrics } from '../types';
import { Search, Filter, Fingerprint, Download, Users, Briefcase, Zap, ShieldCheck, CheckCircle, X, Activity, Medal, TrendingUp } from 'lucide-react';

const HRManager: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [predictiveData, setPredictiveData] = useState<Record<string, PredictiveScore>>({});
  
  // Modals
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditCandidate, setAuditCandidate] = useState<Candidate | null>(null);
  
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  const [metricsCandidate, setMetricsCandidate] = useState<Candidate | null>(null);
  const [currentMetrics, setCurrentMetrics] = useState<StudentMetrics | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const list = await api.hr.getStudents();
        setCandidates(list);
        
        const scores: Record<string, PredictiveScore> = {};
        for (const c of list) {
            scores[c.id] = await api.hr.getPredictiveScore(c.id);
        }
        setPredictiveData(scores);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAudit = (candidate: Candidate) => {
    setAuditCandidate(candidate);
    setAuditModalOpen(true);
  };

  const handlePerformanceAnalysis = async (candidate: Candidate) => {
    setMetricsCandidate(candidate);
    setPerformanceModalOpen(true);
    setCurrentMetrics(null);
    const metrics = await api.hr.getStudentMetrics(candidate.id);
    setCurrentMetrics(metrics);
  };

  const handleInstantCV = (name: string) => {
    alert(`جاري توليد السيرة الذاتية الموثقة للمرشح: ${name} ...`);
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-gov-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Strategic Header */}
      <header className="bg-white p-8 rounded-3xl shadow-deep border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gov-primary to-gov-accent"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-gov-primary rounded-2xl shadow-sm">
                    <Briefcase size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">مركز قرارات التوظيف الذكي</h1>
                    <p className="text-gray-500 mt-1">لوحة تحكم مدعومة بالذكاء الاصطناعي لاكتشاف المواهب الوطنية</p>
                </div>
            </div>
            
            <div className="flex gap-4">
                 <div className="bg-gray-50 px-5 py-3 rounded-xl border border-gray-100 text-center">
                     <div className="text-xs text-gray-500 font-bold mb-1">المرشحين</div>
                     <div className="text-2xl font-black text-gov-primary">{candidates.length}</div>
                 </div>
                 <div className="bg-green-50 px-5 py-3 rounded-xl border border-green-100 text-center">
                     <div className="text-xs text-green-600 font-bold mb-1">معدل التوافق</div>
                     <div className="text-2xl font-black text-green-700">92%</div>
                 </div>
            </div>
        </div>
      </header>

      {/* Candidates Table */}
      <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Users size={20} className="text-gov-secondary" />
                قائمة الكفاءات المرشحة
            </h2>
            <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-gov-primary hover:bg-gray-50 rounded-lg transition-all"><Search size={20} /></button>
                <button className="p-2 text-gray-400 hover:text-gov-primary hover:bg-gray-50 rounded-lg transition-all"><Filter size={20} /></button>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50/50">
                    <tr className="text-right text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4">المرشح</th>
                        <th className="px-6 py-4">المؤهل الأكاديمي</th>
                        <th className="px-6 py-4 text-center">AI Predictive Score</th>
                        <th className="px-6 py-4 text-center">التدقيق</th>
                        <th className="px-6 py-4 text-center">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {candidates.map(candidate => {
                        const scoreData = predictiveData[candidate.id];
                        return (
                            <tr key={candidate.id} className="hover:bg-blue-50/20 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gov-light flex items-center justify-center text-gov-primary font-bold border border-gray-200">
                                            {candidate.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{candidate.name}</div>
                                            <div className="text-xs text-gray-400 font-mono">{candidate.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-800">{candidate.major}</div>
                                    <div className="text-xs text-gray-500">{candidate.university}</div>
                                    <div className="text-xs font-bold text-gov-primary mt-1">معدل: {candidate.gpa}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {scoreData ? (
                                        <div className="flex flex-col items-center group/score cursor-help relative">
                                            {/* Radial Gauge Simulation */}
                                            <div className="relative w-12 h-12 flex items-center justify-center">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="24" cy="24" r="20" stroke="#e5e7eb" strokeWidth="4" fill="transparent" />
                                                    <circle 
                                                        cx="24" cy="24" r="20" 
                                                        stroke={scoreData.score > 90 ? "#28A745" : "#F59E0B"} 
                                                        strokeWidth="4" 
                                                        fill="transparent" 
                                                        strokeDasharray={125.6} 
                                                        strokeDashoffset={125.6 * (1 - scoreData.score / 100)} 
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <span className="absolute text-[10px] font-bold text-gray-700">{scoreData.score}%</span>
                                            </div>
                                            <span className={`text-[10px] font-bold mt-1 ${scoreData.score > 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                {scoreData.score > 90 ? 'ممتاز' : 'جيد'}
                                            </span>
                                            
                                            {/* Tooltip */}
                                            <div className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs p-3 rounded-lg w-48 shadow-xl opacity-0 group-hover/score:opacity-100 transition-opacity z-10 pointer-events-none">
                                                <div className="font-bold text-yellow-400 mb-1">تحليل الذكاء الاصطناعي:</div>
                                                {scoreData.description}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center text-xs text-gray-400">جاري التحليل...</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center space-x-2 space-x-reverse">
                                    <button 
                                        onClick={() => handleAudit(candidate)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gov-primary hover:text-white transition-all text-xs font-bold"
                                        title="سجل التدقيق"
                                    >
                                        <Fingerprint size={16} />
                                    </button>
                                     <button 
                                        onClick={() => handlePerformanceAnalysis(candidate)}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-xs font-bold"
                                        title="تحليل الأداء (Metrics)"
                                    >
                                        <Activity size={16} />
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleInstantCV(candidate.name)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gov-accent text-white rounded-xl shadow-lg shadow-green-900/10 hover:bg-green-700 transition-all active:scale-95 text-xs font-bold"
                                    >
                                        <Download size={16} />
                                        Instant CV
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>

      {/* 1. Blockchain Audit Modal */}
      {auditModalOpen && auditCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-gray-900 p-6 flex justify-between items-start">
                    <div>
                        <h3 className="text-white text-xl font-bold flex items-center gap-2">
                            <ShieldCheck className="text-green-400" />
                            سجل التدقيق الرقمي
                        </h3>
                        <p className="text-gray-400 text-sm mt-1">موثق عبر National EduChain</p>
                    </div>
                    <button onClick={() => setAuditModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gov-primary font-bold text-xl shadow-sm border border-gray-200">
                            {auditCandidate.name.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900">{auditCandidate.name}</div>
                            <div className="text-sm text-gray-500">{auditCandidate.id}</div>
                        </div>
                        <div className="mr-auto">
                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                <CheckCircle size={12} />
                                Verified
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">معرف الكتلة (Block Hash)</label>
                            <div className="bg-gray-900 text-green-400 font-mono text-xs p-3 rounded-lg break-all border border-green-900/30 shadow-inner">
                                {auditCandidate.last_verified_hash}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">وقت التوثيق</label>
                                <div className="text-sm font-bold text-gray-800">2024-05-15 10:30 AM</div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">جهة التوثيق</label>
                                <div className="text-sm font-bold text-gray-800">وزارة التعليم</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-6 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400">هذا السجل غير قابل للتعديل ومحمي بتقنية البلوك تشين.</p>
                </div>
            </div>
        </div>
      )}

      {/* 2. Performance Analysis Modal (Actionable Improvement Metric) */}
      {performanceModalOpen && metricsCandidate && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="h-full w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-left duration-500 overflow-y-auto">
                  <div className="p-8 space-y-8">
                       <div className="flex justify-between items-center">
                           <h2 className="text-2xl font-extrabold text-gov-primary flex items-center gap-2">
                               <TrendingUp className="text-gov-accent" />
                               مؤشر التحسين المستمر
                           </h2>
                           <button onClick={() => setPerformanceModalOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors">
                               <X size={20} />
                           </button>
                       </div>

                       {currentMetrics ? (
                           <div className="space-y-8">
                               {/* Profile Header */}
                               <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                                    <div className="w-16 h-16 bg-gov-light rounded-2xl flex items-center justify-center text-gov-primary text-2xl font-bold border border-gray-200">
                                        {metricsCandidate.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg text-gray-900 leading-tight">{metricsCandidate.name}</div>
                                        <div className="text-sm text-gov-accent font-bold mt-1 bg-green-50 inline-block px-2 py-0.5 rounded-lg border border-green-100">
                                            {currentMetrics.classification}
                                        </div>
                                    </div>
                               </div>

                               {/* Readiness Gauge */}
                               <div className="bg-gradient-to-br from-gov-primary to-gov-secondary rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
                                   <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                   <div className="relative z-10">
                                       <div className="text-sm font-medium text-blue-200 mb-4">{currentMetrics.improvement_metric}</div>
                                       <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.2)" strokeWidth="12" fill="transparent" />
                                                <circle 
                                                    cx="80" cy="80" r="70" 
                                                    stroke="#28A745" 
                                                    strokeWidth="12" 
                                                    fill="transparent" 
                                                    strokeDasharray={439.8} 
                                                    strokeDashoffset={439.8 * (1 - currentMetrics.readiness_score / 100)} 
                                                    strokeLinecap="round"
                                                    className="drop-shadow-[0_0_10px_rgba(40,167,69,0.8)]"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-5xl font-extrabold tracking-tighter">{currentMetrics.readiness_score}%</span>
                                                <span className="text-xs font-medium uppercase tracking-widest opacity-80 mt-1">الجاهزية</span>
                                            </div>
                                       </div>
                                       <p className="text-sm text-blue-100 mt-4 leading-relaxed bg-white/10 p-3 rounded-xl border border-white/10">
                                           {currentMetrics.metric_description}
                                       </p>
                                   </div>
                               </div>

                               {/* Labels */}
                               <div className="space-y-4">
                                   <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">التصنيفات الاستراتيجية</h3>
                                   <div className="flex flex-wrap gap-2">
                                       {currentMetrics.labels.map((label, i) => (
                                           <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-700">
                                               <Medal size={16} className="text-yellow-500" />
                                               {label}
                                           </div>
                                       ))}
                                   </div>
                               </div>

                               <button className="w-full bg-gov-accent hover:bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2">
                                   <Download size={20} />
                                   تصدير التقرير التحليلي
                               </button>
                           </div>
                       ) : (
                           <div className="flex flex-col items-center justify-center h-64">
                               <div className="w-12 h-12 border-4 border-gov-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                               <span className="text-gray-500 text-sm">جاري تحليل البيانات...</span>
                           </div>
                       )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default HRManager;