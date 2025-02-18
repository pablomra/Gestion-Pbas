import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface FormData {
  fecha_pap: string;
  ok_arquitecto: boolean;
  estado_prueba: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
  fecha_prueba: string;
  ticket_asociado: string;
  concurrencia: number;
  tipo_monitoreo: string[];
}

const initialFormData: FormData = {
  fecha_pap: '',
  ok_arquitecto: false,
  estado_prueba: 'pendiente',
  fecha_prueba: '',
  ticket_asociado: '',
  concurrencia: 0,
  tipo_monitoreo: [],
};

export default function ManualForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('solicitudes').insert([
        {
          ...formData,
          tipo_monitoreo: JSON.stringify(formData.tipo_monitoreo),
        },
      ]);

      if (error) throw error;

      toast.success('Solicitud creada exitosamente');
      setFormData(initialFormData);
    } catch (error) {
      toast.error('Error al crear la solicitud');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha PAP
          </label>
          <input
            type="datetime-local"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.fecha_pap}
            onChange={(e) =>
              setFormData({ ...formData, fecha_pap: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            OK Arquitecto
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.ok_arquitecto ? 'true' : 'false'}
            onChange={(e) =>
              setFormData({ ...formData, ok_arquitecto: e.target.value === 'true' })
            }
          >
            <option value="false">No</option>
            <option value="true">Sí</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estado Prueba
          </label>
          <select
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.estado_prueba}
            onChange={(e) =>
              setFormData({
                ...formData,
                estado_prueba: e.target.value as FormData['estado_prueba'],
              })
            }
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_progreso">En Progreso</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha Prueba
          </label>
          <input
            type="datetime-local"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.fecha_prueba}
            onChange={(e) =>
              setFormData({ ...formData, fecha_prueba: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ticket Asociado
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.ticket_asociado}
            onChange={(e) =>
              setFormData({ ...formData, ticket_asociado: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Concurrencia
          </label>
          <input
            type="number"
            min="0"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={formData.concurrencia}
            onChange={(e) =>
              setFormData({
                ...formData,
                concurrencia: parseInt(e.target.value) || 0,
              })
            }
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Monitoreo
          </label>
          <div className="mt-2 space-y-2">
            {['ICP', 'AWS', 'GCP', 'CICS', 'WND', 'LNX', 'BDO', 'BDC'].map((tipo) => (
              <label key={tipo} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  checked={formData.tipo_monitoreo.includes(tipo)}
                  onChange={(e) => {
                    const newTipos = e.target.checked
                      ? [...formData.tipo_monitoreo, tipo]
                      : formData.tipo_monitoreo.filter((t) => t !== tipo);
                    setFormData({ ...formData, tipo_monitoreo: newTipos });
                  }}
                />
                <span className="ml-2 text-sm text-gray-700">{tipo}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar Solicitud'}
        </button>
      </div>
    </form>
  );
}