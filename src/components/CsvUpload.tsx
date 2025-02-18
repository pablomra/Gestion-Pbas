import React, { useState } from 'react';
import { useCSVReader } from 'react-papaparse';
import { toast } from 'react-hot-toast';
import { Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function CsvUpload() {
  const { CSVReader } = useCSVReader();
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (previewData.length === 0) {
      toast.error('No hay datos para cargar');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from('solicitudes').insert(
        previewData.map((row) => ({
          ...row,
          tipo_monitoreo: JSON.stringify(row.tipo_monitoreo?.split(',') || []),
          ok_arquitecto: row.ok_arquitecto === 'true',
          concurrencia: parseInt(row.concurrencia) || 0,
        }))
      );

      if (error) throw error;

      toast.success('Datos cargados exitosamente');
      setPreviewData([]);
    } catch (error) {
      toast.error('Error al cargar los datos');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <CSVReader
        onUploadAccepted={(results: any) => {
          const [headers, ...data] = results.data;
          const formattedData = data
            .filter((row: any[]) => row.length === headers.length)
            .map((row: any[]) => {
              const obj: any = {};
              headers.forEach((header: string, index: number) => {
                obj[header.trim()] = row[index];
              });
              return obj;
            });
          setPreviewData(formattedData);
          toast.success('Archivo CSV procesado correctamente');
        }}
      >
        {({ getRootProps }: any) => (
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 cursor-pointer"
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">
              Arrastra un archivo CSV aquí o haz clic para seleccionarlo
            </p>
          </div>
        )}
      </CSVReader>

      {previewData.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Vista previa de datos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(previewData[0]).map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {previewData.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value: any, i) => (
                      <td
                        key={i}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Mostrando 5 de {previewData.length} filas
            </p>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {loading ? 'Cargando datos...' : 'Cargar datos'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}