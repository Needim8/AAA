import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://mcctlegtqexdmwpogzmd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jY3RsZWd0cWV4ZG13cG9nem1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyMjk0MjcsImV4cCI6MjAzMTgwNTQyN30.X041FZuGMvF1EDiVtmnVMDd5xIOqswZADd2qY48XAsg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function registerUser(event) {
  event.preventDefault();

  const email = document.getElementById('reg-email').value;
  const username = document.getElementById('nickname').value;
  const password = document.getElementById('reg-password').value;

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      console.error('Error registering:', error.message);
      alert(error.message);
      return;
    }

    const user = data.user;

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: user.id,
          username: username,
          created_at: new Date().toISOString()
        }
      ]);

    if (profileError) {
      console.error('Error inserting profile:', profileError.message);
      alert(profileError.message);
    } else {
      alert('Registration successful! Redirecting to login page...');
      window.location.href = 'login.html';
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
}

document.getElementById('register-form').addEventListener('submit', registerUser);
