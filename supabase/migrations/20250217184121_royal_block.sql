/*
  # Performance Testing Management Database Schema

  1. New Tables
    - `solicitudes`: Main table for test requests
    - `funcionalidades`: Features being tested
    - `resultados_jmeter`: JMeter test results
    - `monitoreo_kubernetes`: Kubernetes monitoring data

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users

  3. Indexes
    - Added indexes for frequently queried columns
    - Added foreign key constraints
*/

-- Create enum types for fixed values
CREATE TYPE estado_prueba_type AS ENUM ('pendiente', 'en_progreso', 'completada', 'cancelada');
CREATE TYPE tipo_funcionalidad AS ENUM ('nueva', 'modificada');

-- Solicitudes table
CREATE TABLE IF NOT EXISTS solicitudes (
  id_solicitud UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha_pap TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ok_arquitecto BOOLEAN DEFAULT false,
  estado_prueba estado_prueba_type DEFAULT 'pendiente',
  fecha_prueba TIMESTAMP WITH TIME ZONE,
  ticket_asociado TEXT,
  concurrencia INTEGER,
  tipo_monitoreo JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Funcionalidades table
CREATE TABLE IF NOT EXISTS funcionalidades (
  id_funcionalidad UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_solicitud UUID REFERENCES solicitudes(id_solicitud) ON DELETE CASCADE,
  nombre_funcionalidad TEXT NOT NULL,
  tipo tipo_funcionalidad NOT NULL,
  detalle_cambio TEXT,
  urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ResultadosJMeter table
CREATE TABLE IF NOT EXISTS resultados_jmeter (
  id_resultado UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_solicitud UUID REFERENCES solicitudes(id_solicitud) ON DELETE CASCADE,
  label TEXT NOT NULL,
  num_samples INTEGER NOT NULL,
  average DECIMAL(10,2),
  median DECIMAL(10,2),
  percentil_90 DECIMAL(10,2),
  percentil_95 DECIMAL(10,2),
  percentil_99 DECIMAL(10,2),
  min_time DECIMAL(10,2),
  max_time DECIMAL(10,2),
  error_percentage DECIMAL(5,2),
  throughput_sec DECIMAL(10,2),
  received_kb_sec DECIMAL(10,2),
  sent_kb_sec DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- MonitoreoKubernetes table
CREATE TABLE IF NOT EXISTS monitoreo_kubernetes (
  id_monitoreo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_solicitud UUID REFERENCES solicitudes(id_solicitud) ON DELETE CASCADE,
  id_prueba TEXT,
  cluster TEXT NOT NULL,
  nombre_pieza TEXT NOT NULL,
  namespace TEXT NOT NULL,
  tag_pod TEXT,
  hpa_min_inicio INTEGER,
  hpa_max_inicio INTEGER,
  hpa_min INTEGER,
  hpa_max INTEGER,
  cpu_min DECIMAL(10,2),
  cpu_max DECIMAL(10,2),
  mem_min DECIMAL(10,2),
  mem_max DECIMAL(10,2),
  escalo BOOLEAN DEFAULT false,
  valor_escala INTEGER,
  recursos_limits JSONB,
  recursos_requests JSONB,
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;
ALTER TABLE funcionalidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE resultados_jmeter ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoreo_kubernetes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations for authenticated users" ON solicitudes
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON funcionalidades
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON resultados_jmeter
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow all operations for authenticated users" ON monitoreo_kubernetes
  FOR ALL TO authenticated USING (true);

-- Create indexes
CREATE INDEX idx_solicitudes_estado ON solicitudes(estado_prueba);
CREATE INDEX idx_solicitudes_fecha ON solicitudes(fecha_prueba);
CREATE INDEX idx_funcionalidades_solicitud ON funcionalidades(id_solicitud);
CREATE INDEX idx_resultados_solicitud ON resultados_jmeter(id_solicitud);
CREATE INDEX idx_monitoreo_solicitud ON monitoreo_kubernetes(id_solicitud);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for solicitudes
CREATE TRIGGER update_solicitudes_updated_at
    BEFORE UPDATE ON solicitudes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();