import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { StudentProfile } from '../types';
import { BadgeCheck, Download, GraduationCap, Star, Calendar, Award, MapPin, Mail, Phone, Link as LinkIcon } from 'lucide-react';

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.data.getTranscript('20241156').then(setProfile).finally(() => setLoading(false));
  }, []);

  const handleExportCV = () => {
    alert("تم بدء إنشاء ملف PDF الموثق... سيتم تحميله قريباً.");
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-gov-primary border-t-transparent rounded-full animate-spin"></div></div>;
  if (!profile) return <div className="text-center p-10 text-red-500">فشل تحميل الملف</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-deep border border-gray-100 overflow-hidden relative print:shadow-none">
        <div className="h-40 bg-gradient-to-r from-gov-primary to-gov-secondary relative">
            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px'}}></div>
        </div>
        
        <div className="px-10 pb-10">
          <div className="relative flex flex-col md:flex-row justify-between items-end -mt-16 mb-8 gap-6">
            <div className="flex items-end gap-8">
              <div className="w-32 h-32 bg-white rounded-2xl p-1.5 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-full h-full bg-gov-light rounded-xl flex items-center justify-center text-gov-primary border border-gray-100">
                    <span className="text-4xl font-extrabold">{profile.name.charAt(0)}</span>
                </div>
              </div>
              <div className="mb-2 space-y-1">
                <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
                  {profile.name}
                  <div className="bg-yellow-50 rounded-full px-3 py-1 flex items-center gap-1 border border-yellow-100 shadow-sm">
                    <BadgeCheck className="text-yellow-600 fill-yellow-100 w-5 h-5 animate-pulse" />
                    <span className="text-xs font-bold text-yellow-700">هوية موثقة</span>
                  </div>
                </h1>
                <p className="text-gray-600 text-lg font-medium">{profile.major} | {profile.university}</p>
                <div className="flex gap-4 text-sm text-gray-400 pt-1">
                    <span className="flex items-center gap-1"><MapPin size={14}/> الرياض، المملكة العربية السعودية</span>
                    <span className="flex items-center gap-1"><Mail size={14}/> student@seu.edu.sa</span>
                </div>
              </div>
            </div>
            <button 
                onClick={handleExportCV}
                className="bg-gov-accent hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-500/20 flex items-center gap-2 transition-all active:scale-95 mb-2"
            >
                <Download size={20} />
                تصدير السيرة الذاتية (PDF)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-10">
               <section>
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gov-primary/10 rounded-lg text-gov-primary">
                        <GraduationCap size={24}/>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">السجل الأكاديمي</h2>
                 </div>
                 
                 <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-2 gap-px bg-gray-200">
                        <div className="bg-white p-6">
                            <span className="text-sm text-gray-500 font-medium block mb-1">الجامعة</span>
                            <span className="font-bold text-gray-900 text-lg">{profile.university}</span>
                        </div>
                         <div className="bg-white p-6">
                            <span className="text-sm text-gray-500 font-medium block mb-1">الكلية / التخصص</span>
                            <span className="font-bold text-gray-900 text-lg">{profile.major}</span>
                        </div>
                         <div className="bg-white p-6">
                            <span className="text-sm text-gray-500 font-medium block mb-1">المعدل التراكمي</span>
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold text-3xl text-gov-primary">{profile.gpa}</span>
                                <span className="text-gray-400 font-medium mt-2">/ 5.00</span>
                            </div>
                        </div>
                        <div className="bg-white p-6">
                            <span className="text-sm text-gray-500 font-medium block mb-1">الرقم الجامعي</span>
                            <span className="font-mono font-bold text-gray-900 text-lg tracking-wider">{profile.id}</span>
                        </div>
                    </div>
                 </div>
               </section>

               <section>
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">
                        <Star size={24} className="fill-yellow-600"/>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">أحدث الإنجازات</h2>
                 </div>
                 
                 <div className="space-y-4">
                    {profile.achievements.slice(0, 3).map((ach) => (
                        <div key={ach.id} className="flex items-center gap-5 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                            <div className="bg-yellow-100/50 p-3 rounded-xl text-yellow-700 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                                <Award size={24} />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-gray-900">{ach.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                    <span>{ach.issuer}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="font-mono">{ach.date}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="text-gov-primary font-medium">{ach.category}</span>
                                </div>
                            </div>
                            
                            {ach.verified ? (
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-100">
                                        <BadgeCheck className="text-yellow-600 fill-yellow-100 w-4 h-4" />
                                        موثقة
                                    </div>
                                    {ach.hash && (
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono" title={ach.hash}>
                                            <LinkIcon size={10} />
                                            {ach.hash.substring(0, 8)}...
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">قيد التدقيق</span>
                            )}
                        </div>
                    ))}
                 </div>
               </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-5 pb-2 border-b border-gray-100">المهارات المعتمدة</h2>
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map(skill => (
                            <span key={skill} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold hover:border-gov-primary hover:text-gov-primary transition-colors cursor-default shadow-sm">
                                {skill}
                            </span>
                        ))}
                    </div>
                </section>

                <section className="bg-gov-primary/5 rounded-2xl p-6 border border-gov-primary/10">
                    <h2 className="text-lg font-bold text-gov-primary mb-4">ملخص الحالة</h2>
                    <ul className="space-y-3">
                        <li className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">حالة الطالب</span>
                            <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">منتظم</span>
                        </li>
                        <li className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">المرحلة الدراسية</span>
                            <span className="font-bold text-gray-900">{profile.stage}</span>
                        </li>
                        <li className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">التخرج المتوقع</span>
                            <span className="font-bold text-gray-900">2026</span>
                        </li>
                    </ul>
                </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;