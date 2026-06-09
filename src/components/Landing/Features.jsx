import React from 'react';
import { Users, BarChart3, Map } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-cielo" />,
      title: "Agentes Sintéticos",
      desc: "1 millón de perfiles demográficos reales de El Salvador usados como semillas para el LLM.",
      color: "bg-blue-50 border-blue-100"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-naranja" />,
      title: "Análisis de Sentimiento",
      desc: "Categorización automática de reacciones: a favor, neutral, en contra con intensidad.",
      color: "bg-orange-50 border-orange-100"
    },
    {
      icon: <Map className="w-8 h-8 text-rosa" />,
      title: "Visualización Geográfica",
      desc: "Mapas de calor interactivos por los 14 departamentos prediciendo el impacto territorial.",
      color: "bg-pink-50 border-pink-100"
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className={`card p-8 border-2 ${f.color} hover:-translate-y-2 transition-transform duration-300`}>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-carbon mb-3">{f.title}</h3>
              <p className="text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
