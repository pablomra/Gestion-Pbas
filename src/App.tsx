import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { FileSpreadsheet, PlusCircle, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';
import ManualForm from './components/ManualForm';
import CsvUpload from './components/CsvUpload';
import Auth from './components/Auth';

function App() {
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');
  const [session, setSession] = useState(supabase.auth.getSession());

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Gestión de Pruebas de Rendimiento
          </h1>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('manual')}
                className={`${
                  activeTab === 'manual'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center`}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Ingreso Manual
              </button>
              <button
                onClick={() => setActiveTab('csv')}
                className={`${
                  activeTab === 'csv'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm flex items-center justify-center`}
              >
                <FileSpreadsheet className="w-5 h-5 mr-2" />
                Carga CSV
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'manual' ? <ManualForm /> : <CsvUpload />}
          </div>
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;