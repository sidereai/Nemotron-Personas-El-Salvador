import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DemographicBreakdown({ byAge, bySex, byEducation }) {
  
  const formatData = (source) => {
    return Object.keys(source || {}).map(key => ({
      name: key,
      'A Favor': source[key].a_favor,
      'Neutral': source[key].neutral,
      'En Contra': source[key].en_contra,
    }));
  };

  const ageData = formatData(byAge);
  const sexData = formatData(bySex);
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-xl">
          <p className="font-bold text-carbon mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm font-mono">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-6 md:p-8">
      <h3 className="text-xl font-bold text-carbon mb-6">Desglose Demográfico</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* By Age */}
        <div>
          <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider text-center">Por Rango de Edad</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Bar dataKey="A Favor" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Neutral" stackId="a" fill="#94A3B8" />
                <Bar dataKey="En Contra" stackId="a" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By Sex */}
        <div>
          <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider text-center">Por Sexo</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sexData} layout="vertical" margin={{ top: 0, right: 0, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12, fontWeight: 'bold' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} />
                <Bar dataKey="A Favor" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Neutral" stackId="a" fill="#94A3B8" />
                <Bar dataKey="En Contra" stackId="a" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
