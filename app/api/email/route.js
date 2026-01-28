import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// --- KODE BARU (PASTE INI SEBAGAI GANTINYA) ---
import { CONFIG } from '../../config'; 

const ALLOWED_DOMAINS = CONFIG.allowedDomains; 


export async function POST(request) {
  // Setup koneksi database
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Database config missing' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const body = await request.json();
    const { to, from, subject, text } = body;

    if (!to) return NextResponse.json({ error: 'No recipient' }, { status: 400 });

    const cleanTo = to.toLowerCase().trim();
    
    // Cek apakah domain diizinkan
    const isAllowed = ALLOWED_DOMAINS.some(d => cleanTo.includes(d));

    if (isAllowed) {
      const { error } = await supabase.from('mails').insert({
        address: cleanTo,
        sender: from,
        subject: subject,
        message: text
      });
      if (error) throw error;
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Domain blocked' }, { status: 403 });
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const address = searchParams.get('address');

  // Kirim list domain ke frontend
  if (action === 'domains') {
    return NextResponse.json({ domains: ALLOWED_DOMAINS });
  }

  // Cek isi inbox
  if (action === 'inbox' && address) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnon) return NextResponse.json({ emails: [] });

    const supabase = createClient(supabaseUrl, supabaseAnon);
    
    const { data } = await supabase
      .from('mails')
      .select('*')
      .eq('address', address.toLowerCase())
      .order('created_at', { ascending: false });
    
    return NextResponse.json({ emails: data || [] });
  }

  return NextResponse.json({ error: 'Invalid' });
}
