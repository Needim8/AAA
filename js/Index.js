import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://czjrdnmsmqinutrxybsv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6anJkbm1zbXFpbnV0cnh5YnN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcwMjg5ODYsImV4cCI6MjAzMjYwNDk4Nn0.Y-p7c_Gyc_xwrQ-VdiibrSc9sYIVWX-lExSWdSsPkSs';
const supabase = createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", function() {
  loadUserProfile();

  // Example of adding click event to the Buy button
  document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', function() {
      alert('Purchase complete!');
    });
  });

  // Example of adding click event to the Hero button
  document.querySelector('.hero-button').addEventListener('click', function() {
    alert('Redirecting to purchase page!');
  });

  // Scroll functionality for Popular and Trending sections
  document.querySelectorAll('.scroll-button').forEach(button => {
    button.addEventListener('click', function() {
      const direction = this.classList.contains('left') ? -1 : 1;
      const cardsContainer = this.closest('section').querySelector('.popular-cards, .trending-cards');
      cardsContainer.scrollBy({ left: direction * 300, behavior: 'smooth' });
    });
  });

  // Open profile settings page when profile image or name is clicked
  document.querySelector('.profile').addEventListener('click', function() {
    window.location.href = '../Profil Men.html';
  });
  document.querySelector('.profile-img').addEventListener('click', function() {
    window.location.href = '../Profil Men.html';
  });
  document.querySelector('.profile-name').addEventListener('click', function() {
    window.location.href = '../Profil Men.html';
  });
});

async function loadUserProfile() {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    alert('User not logged in');
    window.location.href = 'Login.html';
    return;
  }

  const { data: userProfile, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error.message);
    alert('Error fetching user profile: ' + error.message);
    return;
  }

  if (!userProfile) {
    console.error('No user profile found for user_id:', userId);
    alert('No user profile found');
    return;
  }

  document.getElementById('profile-name').textContent = userProfile.username;
  document.getElementById('profile-img').src = userProfile.profile_image || 'img/default-profile.png';
  document.getElementById('profile-status').textContent = userProfile.status || 'Online';
}
