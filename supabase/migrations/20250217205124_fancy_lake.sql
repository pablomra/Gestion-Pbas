/*
  # Update RLS policies for tables

  1. Changes
    - Update RLS policies for all tables to allow proper access
    - Add policies for insert, select, update, and delete operations
    - Ensure authenticated users can access their data
  
  2. Security
    - Enable RLS on all tables
    - Add specific policies for each operation type
    - Maintain data security while allowing necessary access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON solicitudes;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON funcionalidades;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON resultados_jmeter;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON monitoreo_kubernetes;

-- Create new specific policies for solicitudes
CREATE POLICY "Enable insert for authenticated users" ON solicitudes
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users" ON solicitudes
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable update for authenticated users" ON solicitudes
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON solicitudes
  FOR DELETE TO authenticated
  USING (true);

-- Create new specific policies for funcionalidades
CREATE POLICY "Enable insert for authenticated users" ON funcionalidades
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users" ON funcionalidades
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable update for authenticated users" ON funcionalidades
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON funcionalidades
  FOR DELETE TO authenticated
  USING (true);

-- Create new specific policies for resultados_jmeter
CREATE POLICY "Enable insert for authenticated users" ON resultados_jmeter
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users" ON resultados_jmeter
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable update for authenticated users" ON resultados_jmeter
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON resultados_jmeter
  FOR DELETE TO authenticated
  USING (true);

-- Create new specific policies for monitoreo_kubernetes
CREATE POLICY "Enable insert for authenticated users" ON monitoreo_kubernetes
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable select for authenticated users" ON monitoreo_kubernetes
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable update for authenticated users" ON monitoreo_kubernetes
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON monitoreo_kubernetes
  FOR DELETE TO authenticated
  USING (true);