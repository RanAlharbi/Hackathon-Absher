import React, { useState } from 'react';
import { QrCode, CheckCircle, XCircle, ScanLine, Link as LinkIcon, Shield } from 'lucide-react';
import { PendingItem, BlockchainResponse } from '../types';
import { api } from '../services/api';

const VerifyCertificate: React.FC = () => {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'CHECKING_DB' | 'CHECKING_CHAIN' | 'VALID' | 'INVALID'>('IDLE');
  const [chainData, setChainData] = useState<BlockchainResponse | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setStatus('CHECKING_DB');
    setChainData(null);
    
    // Step 1: Check Local DB (Simulated)
    setTimeout(async () => {
        if (code === 'VALID123') {
          setStatus('CHECKING_CHAIN');
          
          // Step 2: Call Blockchain Verification API
          try {
             const result = await api.data.verifyBlockchain();
             setChainData(result);
             setStatus('VALID');
          } catch (e) {
             setStatus('INVALID');
          }
        } else {
          setStatus('INVALID');
          // Save to localStorage for Manual Review
          const pendingCerts = JSON.parse(localStorage.getItem('pendingCerts') || '[]');
          const newItem: PendingItem = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'INVALID_CERT',
            content: `Invalid Cert Code Attempt: ${code}`,
            timestamp: new Date().toISOString(),
            status: 'PENDING'
          };
          localStorage.setItem('pendingCerts', JSON.stringify([...pendingCerts, newItem]));
        }
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white rounded-3xl shadow-deep overflow-hidden border border-gray-100">
        <div className="p-10 bg-gov-primary text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                    <QrCode className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold mb-2">التحقق من الوثائق الرقمية</h1>
                <p className="text-blue-100 text-sm max-w-md mx-auto">نظام تحقق مزدوج يربط قاعدة البيانات المركزية مع شبكة البلوك تشين الوطنية</p>
            </div>
        </div>

        <div className="p-10">
            <form onSubmit={handleVerify} className="relative">
                <label className="text-sm font-bold text-gray-700 mb-2 block">رمز الوثيقة</label>
                <div className="relative group">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            setStatus('IDLE');
                        }}
                        placeholder="أدخل الرمز (مثال: VALID123)"
                        className="w-full pl-4 pr-14 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl text-lg focus:bg-white focus:border-gov-primary focus:ring-0 transition-all outline-none font-mono text-gray-800 tracking-wider placeholder:font-sans"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-gov-primary transition-colors">
                        <ScanLine size={24} />
                    </div>
                </div>
                
                <button 
                    type="submit" 
                    disabled={status === 'CHECKING_DB' || status === 'CHECKING_CHAIN' || !code}
                    className="mt-6 w-full bg-gov-secondary hover:bg-gov-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {status === 'CHECKING_DB' ? 'جاري التحقق من السجل...' : status === 'CHECKING_CHAIN' ? 'جاري المصادقة عبر Blockchain...' : 'تحقق الآن'}
                </button>
            </form>

            {/* Status Display */}
            {status !== 'IDLE' && (
                <div className="mt-8 space-y-4">
                    {/* Final Success Result */}
                    {status === 'VALID' && chainData && (
                        <div className="mt-4 p-6 bg-green-50 rounded-2xl border border-green-200 shadow-sm animate-in zoom-in duration-300">
                             <div className="flex flex-col items-center justify-center text-center gap-2">
                                 <CheckCircle className="text-green-600 w-12 h-12 mb-2" />
                                 <h3 className="text-2xl font-extrabold text-green-700">تم التحقق ✔</h3>
                                 <p className="text-sm text-green-800 font-medium">الوثيقة صالحة وموثقة في سجلات البلوك تشين.</p>
                                 <div className="mt-4 w-full bg-white/50 p-3 rounded-lg border border-green-100">
                                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono">
                                        <LinkIcon size={12} />
                                        <span>{chainData.blockchain_hash}</span>
                                    </div>
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* Failure State */}
                    {status === 'INVALID' && (
                        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center animate-in zoom-in duration-300">
                             <div className="flex flex-col items-center justify-center gap-2">
                                <XCircle size={40} className="text-red-500 mb-2" />
                                <h3 className="text-2xl font-extrabold text-red-800">لم يتم العثور ✖</h3>
                                <p className="text-red-600 text-sm">رمز الوثيقة غير موجود في السجلات.</p>
                             </div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;