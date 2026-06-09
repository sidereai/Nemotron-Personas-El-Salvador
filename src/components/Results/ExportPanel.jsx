import React from 'react';
import { Download, FileJson, FileSpreadsheet } from 'lucide-react';

export default function ExportPanel({ results, policy }) {
  
  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ policy, timestamp: new Date().toISOString(), results }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `pulsosv_simulacion_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const downloadCSV = () => {
    // Generate CSV Header
    let csv = "UUID,Edad,Sexo,Departamento,Municipio,Educacion,Ocupacion,Sentimiento,Intensidad,Razon,Reaccion\n";
    
    // Rows
    results.forEach(r => {
      if (!r.parsed || r.error) return;
      const p = r.profile;
      const a = r.parsed;
      
      // Escape quotes in text
      const cleanReaccion = a.reaccion.replace(/"/g, '""');
      const cleanRazon = a.razon_principal.replace(/"/g, '""');
      
      csv += `${p.uuid},${p.age},${p.sex},${p.department},${p.municipality},${p.education_level},"${p.occupation}",${a.sentimiento},${a.intensidad},"${cleanRazon}","${cleanReaccion}"\n`;
    });

    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `pulsosv_simulacion_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="card p-6 md:p-8 mt-8 bg-gradient-to-br from-carbon to-[#1E293B] text-nube">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <Download className="w-5 h-5 text-cielo" /> Exportar Resultados
          </h3>
          <p className="text-gray-400 text-sm max-w-md">
            Descarga los datos crudos de la simulación para análisis externo en Excel, Pandas o herramientas de BI.
          </p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={downloadCSV}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-xl border border-white/20 transition-all flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-verde-light" /> CSV
          </button>
          <button 
            onClick={downloadJSON}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-xl border border-white/20 transition-all flex items-center gap-2"
          >
            <FileJson className="w-4 h-4 text-naranja-light" /> JSON
          </button>
        </div>
      </div>
    </div>
  );
}
