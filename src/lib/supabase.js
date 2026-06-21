import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  'https://xhzepoirzqzedyhkutbg.supabase.co'

const supabaseKey =
  'sb_publishable_bLKAlkJ-lvKaMDz4KShhLQ_g45UzDaO'

export const supabase =
  createClient(
    supabaseUrl,
    supabaseKey
  )