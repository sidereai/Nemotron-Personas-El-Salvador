import React from 'react';
import { Shuffle, Database, AlertTriangle } from 'lucide-react';

export default function Methodology() {
  const cards = [
    {
      icon: <Database className="w-8 h-8 text-naranja" />,
      title: "Origen de los Datos",
      desc: "Utilizamos el dataset de código abierto Nemotron-Personas-El-Salvador, que contiene más de 1 millón de perfiles demográficos altamente detallados. Estos perfiles actúan como 'semillas' de contexto para que el modelo de Inteligencia Artificial asuma su rol, edad y ubicación.",
      color: "bg-orange-50 border-orange-100"
    },
    {
      icon: <Shuffle className="w-8 h-8 text-cielo" />,
      title: "Muestreo Estratificado (Shuffle)",
      desc: "No elegimos perfiles totalmente al azar. Primero calculamos la densidad poblacional real del país y luego extraemos una cuota exacta usando el algoritmo de Fisher-Yates. Esto garantiza que cada muestra sea representativa y proporcional a nivel nacional, incluso con pocos perfiles.",
      color: "bg-blue-50 border-blue-100"
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-rosa" />,
      title: "Limitaciones y Escala Real",
      desc: "Esta versión demostrativa utiliza un modelo de inteligencia artificial Flash para analizar hasta 100 perfiles garantizando velocidad. Para evaluaciones críticas, tenemos disponible un modelo de inteligencia artificial de pensamiento profundo capaz de procesar muestras masivas (desde >100 hasta 100K+ perfiles). Si requiere este nivel de escala y precisión estadística, ",
      cta: {
        text: "consúltenos directamente.",
        link: "https://wa.me/50362200921"
      },
      color: "bg-pink-50 border-pink-100"
    }
  ];

  return (
    <div id="metodologia" className="py-20 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-carbon mb-4">Transparencia y Metodología</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Descubre cómo funciona el motor del simulador y cómo garantizamos la representatividad en las predicciones.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((f, i) => (
            <div key={i} className={`card p-8 border-2 ${f.color} hover:-translate-y-2 transition-transform duration-300`}>
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-carbon mb-3">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {f.desc}
                {f.cta && (
                  <a href={f.cta.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-[#25D366] hover:text-[#20b858] transition-colors mt-1">
                    {f.cta.text}
                  </a>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
