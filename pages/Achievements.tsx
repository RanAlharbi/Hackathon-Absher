import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { StudentProfile, Achievement } from '../types';
import { Award, Trash2, Download, BadgeCheck, FileText, Briefcase, GraduationCap, Handshake, Link as LinkIcon, Share2 } from 'lucide-react';

const Achievements: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.data.getTranscript('20241156').then(setProfile).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-gov-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!profile) return <div className="text-center p-10 text-red-500">فشل تحميل البيانات</div>;

  // Group achievements by TYPE
  const groupedByType = profile.achievements.reduce((acc, curr) => {
    const type = curr.type || 'أخرى';
    (acc[type] = acc[type] || []).push(curr);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const getIconForType = (type: string) => {
      if (type.includes("احترافية")) return <Award size={20} className="text-white" />;
      if (type.includes("تدريب")) return <Briefcase size={20} className="text-white" />;
      if (type.includes("تطوع")) return <Handshake size={20} className="text-white" />;
      return <FileText size={20} className="text-white" />;
  };

  const getColorForType = (type: string) => {
      if (type.includes("احترافية")) return "bg-purple-600 shadow-purple-200";
      if (type.includes("تدريب")) return "bg-blue-600 shadow-blue-200";
      if (type.includes("تطوع")) return "bg-emerald-500 shadow-emerald-200";
      return "bg-gray-500 shadow-gray-200";
  };

  const handleExport = (id: number) => {
      alert("جاري تصدير الوثيقة رقم " + id + " كملف PDF موثق...");
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gov-primary tracking-tight flex items-center gap-3">
             <div className="bg-blue-50 p-2 rounded-xl">
                <GraduationCap className="text-gov-primary" size={32} />
             </div>
             معرض الإنجازات المصور
          </h1>
          <p className="text-gray-500 mt-2 text-lg">سجل رقمي موثق ومقسم حسب نوع المهارة والخبرة</p>
        </div>
      </header>

      <div className="space-y-12">
        {Object.entries(groupedByType).map(([type, items]) => (
            <section key={type} className="space-y-4">
                <div className="flex items-center gap-3 px-2">
                    <div className={`p-2 rounded-lg shadow-lg ${getColorForType(type)}`}>
                        {getIconForType(type)}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{type}</h2>
                    <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5 rounded-full font-bold border border-gray-200">{items.length}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                        <div key={item.id} className="group bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden hover:shadow-deep hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                            {/* Card Image Area */}
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                <img 
                                    src={item.image_url} 
                                    alt={item.title} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                
                                {/* Floating Badge Type */}
                                <div className={`absolute top-4 right-4 ${getColorForType(item.type)} p-2 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-90`}>
                                    {getIconForType(item.type)}
                                </div>

                                {/* Status Badge */}
                                <div className="absolute bottom-4 right-4">
                                    {item.verified ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-green-700 backdrop-blur-md shadow-sm">
                                            <BadgeCheck size={14} className="fill-green-100" /> موثقة
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-900/50 text-white backdrop-blur-md">
                                            قيد التدقيق
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="mb-4">
                                    <div className="text-xs font-bold text-gov-primary mb-1 uppercase tracking-wider">{item.category}</div>
                                    <h3 className="font-bold text-lg text-gray-900 leading-snug">{item.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{item.issuer}</p>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
                                    <div className="text-xs text-gray-400 font-mono flex items-center gap-1">
                                        <span>{item.date}</span>
                                        {item.hash && (
                                            <>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <LinkIcon size={10} />
                                                <span title={item.hash}>{item.hash.substring(0,6)}...</span>
                                            </>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleExport(item.id)}
                                            className="p-2 text-gov-primary bg-blue-50 rounded-lg hover:bg-gov-primary hover:text-white transition-colors"
                                            title="تحميل"
                                        >
                                            <Download size={16} />
                                        </button>
                                        <button className="p-2 text-gray-400 bg-gray-50 rounded-lg hover:bg-gray-200 hover:text-gray-600 transition-colors" title="مشاركة">
                                            <Share2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        ))}
      </div>
    </div>
  );
};

export default Achievements;