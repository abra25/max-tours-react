import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lwenskzlrcnxjlztdusf.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_yI5U50hZ8W6Sm_EOZHo8ew_DgHyenLK'

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)