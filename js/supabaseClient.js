import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://mcctlegtqexdmwpogzmd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jY3RsZWd0cWV4ZG13cG9nem1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyMjk0MjcsImV4cCI6MjAzMTgwNTQyN30.X041FZuGMvF1EDiVtmnVMDd5xIOqswZADd2qY48XAsg';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    console.log('User is logged in:', session.user);
    localStorage.setItem('user', JSON.stringify(session.user));
  } else {
    console.log('User is logged out');
    localStorage.removeItem('user');
  }
});

export const checkUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.href = 'Login.html';
  }
  return user;
};
