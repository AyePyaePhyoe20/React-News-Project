import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bgimzklltiqbafufgbmj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaW16a2xsdGlxYmFmdWZnYm1qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc0MTc2MDYsImV4cCI6MTk5Mjk5MzYwNn0.blnbkNXy6pQXI-7A6zuDb0sA6r2MYgMzJKFvXdaarAE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
