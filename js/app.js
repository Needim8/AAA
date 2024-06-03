import { supabase } from './supabaseClient.js';

document.addEventListener("DOMContentLoaded", async function() {
  // Handle Login and Register buttons
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');

  if (loginButton) {
    loginButton.addEventListener('click', function() {
      window.location.href = 'Login.html';
    });
  }

  if (registerButton) {
    registerButton.addEventListener('click', function() {
      window.location.href = 'registration.html';
    });
  }

  // Additional functionality if user is logged in
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error.message);
    return;
  }
  if (user) {
    // User is logged in, hide login/register buttons and show profile
    if (loginButton) loginButton.style.display = 'none';
    if (registerButton) registerButton.style.display = 'none';

    // Replace with your profile and notification setup
    const headerIcons = document.querySelector('.header-icons');
    if (headerIcons) {
      headerIcons.innerHTML = `
        <i class="fas fa-bell"></i>
        <i class="fas fa-envelope"></i>
        <i class="fas fa-user-friends"></i>
        <i class="fas fa-cog"></i>
        <div class="profile">
          <img src="img/default-profile.png" alt="User Profile" class="profile-img" id="profile-img" onclick="window.location.href='Profil Men.html'">
          <span class="profile-name" id="profile-name">User</span>
          <span class="profile-status" id="profile-status">Online</span>
        </div>
      `;
    }

    // Load user profile picture and name
    loadUserProfile(user);
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

  // Fetch categories on DOMContentLoaded
  fetchCategories();
});

async function loadUserProfile(user) {
  const userId = user.id;
  if (!userId) {
    return;
  }

  const { data: userProfiles, error: userProfileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId);

  if (userProfileError) {
    console.error('Error fetching user profile:', userProfileError.message);
    return;
  }

  if (userProfiles.length === 1) {
    const userProfile = userProfiles[0];
    document.querySelector('.profile-img').src = userProfile.profile_image || 'img/default-profile.png';
    document.querySelector('.profile-name').textContent = userProfile.username;
  }
}

async function updateProfilePicture(event) {
  event.preventDefault();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error.message);
    alert('Error getting user: ' + error.message);
    return;
  }
  const userId = user.id;
  const name = document.getElementById('name').value;
  const fileInput = document.getElementById('profile-image-upload');
  const file = fileInput.files[0];

  if (file) {
    const { data, error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(`public/${userId}/${file.name}`, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading profile picture:', uploadError.message);
      alert('Error uploading profile picture: ' + uploadError.message);
      return;
    }

    const profileImageUrl = supabase.storage.from('avatars').getPublicUrl(`public/${userId}/${file.name}`).publicURL;

    const { error: avatarError } = await supabase
      .from('avatars')
      .upsert({ user_id: userId, avatar_url: profileImageUrl });

    if (avatarError) {
      console.error('Error updating avatar:', avatarError.message);
      alert('Error updating avatar: ' + avatarError.message);
      return;
    }

    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ username: name, profile_image: profileImageUrl })
      .eq('user_id', userId);

    if (profileError) {
      console.error('Error updating profile picture:', profileError.message);
      alert('Error updating profile picture: ' + profileError.message);
    } else {
      alert('Profile picture updated successfully');
      await loadUserProfile(user); // Reload profile to display updated information
    }
  } else {
    const { error: profileError } = await supabase
      .from('user_profiles')
      .update({ username: name })
      .eq('user_id', userId);

    if (profileError) {
      console.error('Error updating profile:', profileError.message);
      alert('Error updating profile: ' + profileError.message);
    } else {
      alert('Profile updated successfully');
      await loadUserProfile(user); // Reload profile to display updated information
    }
  }
}

async function updatePersonalInfo(event) {
  event.preventDefault();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error.message);
    alert('Error getting user: ' + error.message);
    return;
  }
  const userId = user.id;
  const email = document.getElementById('email').value;
  const country = document.getElementById('country').value;
  const dob = document.getElementById('dob').value;

  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({ email, country, dob })
    .eq('user_id', userId);

  if (updateError) {
    console.error('Error updating personal information:', updateError.message);
    alert('Error updating personal information: ' + updateError.message);
  } else {
    alert('Personal information updated successfully');
    await loadUserProfile(user); // Reload profile to display updated information
  }
}

async function updateAccountSecurity(event) {
  event.preventDefault();

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error.message);
    alert('Error getting user: ' + error.message);
    return;
  }
  const userId = user.id;
  const newPassword = document.getElementById('new-password').value;

  const { data, error: updateError } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (updateError) {
    console.error('Error updating account security:', updateError.message);
    alert('Error updating account security: ' + updateError.message);
  } else {
    alert('Account security updated successfully');
  }
}

// Fetch categories from Supabase
async function fetchCategories() {
  try {
    const { data: categories, error } = await supabase.from('categories').select('*');
    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    const categoriesContainer = document.querySelector('.categories-cards');
    if (categoriesContainer) {
      categoriesContainer.innerHTML = '';

      categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.classList.add('category-card');
        categoryCard.innerHTML = `
          <img src="${category.image_url}" alt="${category.name}">
          <h3>${category.name}</h3>
        `;
        categoriesContainer.appendChild(categoryCard);

        // Add click event to navigate to ViewAll.html with selected category
        categoryCard.addEventListener('click', () => {
          const categoryName = category.name;
          localStorage.setItem('selectedCategory', categoryName);
          window.location.href = `ViewAll.html?category=${categoryName}`;
        });
      });
    } else {
      console.error('Categories container not found');
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Fetch categories on DOMContentLoaded
document.addEventListener('DOMContentLoaded', fetchCategories);
