import { supabase } from './supabaseClient.js';

document.addEventListener("DOMContentLoaded", async function() {
  const user = supabase.auth.user();
  if (!user) {
    alert('You must be logged in to view this page');
    window.location.href = 'login.html'; // Redirect to login if not authenticated
    return;
  }

  // Carousel functionality
  const prevButtons = document.querySelectorAll('.prev');
  const nextButtons = document.querySelectorAll('.next');
  const carousels = document.querySelectorAll('.carousel');

  prevButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      carousels[index].scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    });
  });

  nextButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      carousels[index].scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    });
  });
});
