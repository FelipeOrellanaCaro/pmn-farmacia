import { createClient } from '@supabase/supabase-js'

// Cliente Supabase. La "publishable key" (anon) está pensada para ser pública
// desde el navegador; la seguridad real depende de las políticas RLS definidas
// en docs/esquema-supabase.sql.
const supabaseUrl = 'https://xoluntxgzjcyyjmeoera.supabase.co'
const supabaseKey = 'sb_publishable_66g09vrhj7uwk5XfDvoMhg_InWeDgV7'

export const supabase = createClient(supabaseUrl, supabaseKey)
