import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ForecastData } from '../types';
import { TrendingUp, Activity, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AIForecastCard: React.FC = () => {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.data.getForecast();
        setData(result);
      } catch (e) {
        console.error("Failed to fetch forecast");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="animate-pulse h-80 bg-gray-200 rounded-2xl"></div>;
  if (!data) return <div className="h-80 flex items-center justify-center text-red-500 bg-white rounded-2xl border border-red-100">فشل في تحميل البيانات</div>;

  // Mock historical data for the chart based on the forecast
  const chartData = [
    { year: '2022', value: data.forecast_2026 - (data.annual_growth_rate * 4) },
    { year: '2023', value: data.forecast_2026 - (data.annual_growth_rate * 3) },
    { year: '2024', value: data.forecast_2026 - (data.annual_growth_rate * 2) },
    { year: '2025', value: data.forecast_2026 - data.annual_growth_rate },
    { year: '2026', value: data.forecast_2026 },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden hover:shadow-deep transition-shadow duration-300">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <div>
          <h3 className="text-xl font-bold text-gov-primary flex items-center gap-2">
            <TrendingUp className="text-gov-accent" size={24} />
            {data.title}
          </h3>
          <p className="text-gray-500 text-sm mt-1">نموذج الانحدار الخطي لتحليل نمو الطلاب</p>
        </div>
        <div className="px-3 py-1 bg-gov-primary/10 text-gov-primary text-xs font-bold rounded-full border border-gov-primary/20">
          AI MODEL V2.1
        </div>
      </div>
      
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 group hover:border-blue-200 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-blue-600 font-semibold mb-1">دقة النموذج (R-Squared)</div>
                <div className="text-3xl font-extrabold text-gov-primary">{data.model_r_squared.toFixed(4)}</div>
              </div>
              <Activity className="text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="mt-2 w-full bg-blue-100 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${data.model_r_squared * 100}%` }}></div>
            </div>
          </div>
          
          <div className="bg-gov-accent/5 p-5 rounded-xl border border-gov-accent/20 group hover:border-gov-accent/40 transition-all">
            <div className="flex items-start justify-between">
              <div>
                 <div className="text-sm text-gov-accent font-semibold mb-1">توقعات عام 2026</div>
                 <div className="text-3xl font-extrabold text-gov-primary">{data.forecast_2026.toLocaleString()}</div>
              </div>
              <Target className="text-gov-accent group-hover:scale-110 transition-transform" />
            </div>
             <div className="text-xs text-gov-accent mt-2 font-medium flex items-center gap-1">
               <span className="inline-block w-2 h-2 rounded-full bg-gov-accent animate-pulse"></span>
               نمو متوقع بنسبة مستقرة
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 h-64 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A4F87" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1A4F87" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="year" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#6b7280', fontSize: 12}}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#1A4F87', fontWeight: 'bold' }}
                cursor={{ stroke: '#1A4F87', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#1A4F87" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AIForecastCard;