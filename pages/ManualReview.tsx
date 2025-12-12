import React, { useEffect, useState } from 'react';
import { PendingItem } from '../types';
import { Check, X, RefreshCw, ClipboardList, Clock } from 'lucide-react';

const ManualReview: React.FC = () => {
  const [items, setItems] = useState<PendingItem[]>([]);

  const loadItems = () => {
    const data = JSON.parse(localStorage.getItem('pendingCerts') || '[]');
    setItems(data.filter((i: PendingItem) => i.status === 'PENDING'));
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleDecision = (id: string, status: 'APPROVED' | 'REJECTED') => {
    const allItems = JSON.parse(localStorage.getItem('pendingCerts') || '[]');
    const updatedItems = allItems.map((item: PendingItem) => {
      if (item.id === id) {
        return { ...item, status };
      }
      return item;
    });
    localStorage.setItem('pendingCerts', JSON.stringify(updatedItems));
    loadItems();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
       <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-700 rounded-xl">
                    <ClipboardList size={28} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">مركز المراجعة اليدوية</h1>
                    <p className="text-gray-500 text-sm">إدارة الاستثناءات والطلبات المعلقة من النظام الآلي</p>
                </div>
            </div>
            <button 
                onClick={loadItems} 
                className="p-3 hover:bg-gray-50 rounded-xl text-gray-600 transition-colors border border-transparent hover:border-gray-200"
                title="تحديث القائمة"
            >
                <RefreshCw size={20} />
            </button>
       </div>

       {items.length === 0 ? (
           <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
               <div className="inline-flex p-6 bg-green-50 rounded-full text-green-500 mb-6 ring-4 ring-green-50/50">
                   <Check size={40} />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد طلبات معلقة</h3>
               <p className="text-gray-500 max-w-sm mx-auto">جميع السجلات والشهادات تمت معالجتها بنجاح. النظام يعمل بكفاءة كاملة.</p>
           </div>
       ) : (
           <div className="bg-white rounded-2xl shadow-card border border-gray-200 overflow-hidden">
               <div className="overflow-x-auto">
                   <table className="min-w-full divide-y divide-gray-100">
                       <thead className="bg-gray-50">
                           <tr>
                               <th className="px-8 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">نوع الطلب</th>
                               <th className="px-8 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">تفاصيل السجل</th>
                               <th className="px-8 py-5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">وقت التسجيل</th>
                               <th className="px-8 py-5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">الإجراء المطلوب</th>
                           </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-100">
                           {items.map((item) => (
                               <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                   <td className="px-8 py-6 whitespace-nowrap">
                                       <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-lg ${
                                           item.type === 'LOGIN_FAILURE' 
                                           ? 'bg-red-50 text-red-700 border border-red-100' 
                                           : 'bg-orange-50 text-orange-700 border border-orange-100'
                                       }`}>
                                           {item.type === 'LOGIN_FAILURE' ? 'فشل دخول أمني' : 'شهادة غير صالحة'}
                                       </span>
                                   </td>
                                   <td className="px-8 py-6">
                                       <div className="text-sm text-gray-900 font-bold mb-1">{item.content}</div>
                                       <div className="text-xs text-gray-400 font-mono">ID: {item.id}</div>
                                   </td>
                                   <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500">
                                       <div className="flex items-center gap-2">
                                           <Clock size={14} />
                                           {new Date(item.timestamp).toLocaleString('ar-SA')}
                                       </div>
                                   </td>
                                   <td className="px-8 py-6 whitespace-nowrap text-center">
                                       <div className="flex justify-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                           <button 
                                               onClick={() => handleDecision(item.id, 'APPROVED')}
                                               className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-600 hover:text-white transition-all shadow-sm"
                                               title="قبول / معالجة"
                                           >
                                               <Check size={18} />
                                           </button>
                                           <button 
                                               onClick={() => handleDecision(item.id, 'REJECTED')}
                                               className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                title="رفض"
                                           >
                                               <X size={18} />
                                           </button>
                                       </div>
                                   </td>
                               </tr>
                           ))}
                       </tbody>
                   </table>
               </div>
           </div>
       )}
    </div>
  );
};

export default ManualReview;
