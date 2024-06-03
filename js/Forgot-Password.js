document.addEventListener("DOMContentLoaded", function() {
  const loginContainer = document.getElementById('login-container');
  const forgotPasswordContainer = document.getElementById('forgot-password-container');
  const resetPasswordContainer = document.getElementById('reset-password-container');
  const checkEmailContainer = document.getElementById('check-email-container');
  const passwordResetSuccessContainer = document.getElementById('password-reset-success-container');

  document.getElementById('forgot-password-link').addEventListener('click', function(event) {
    event.preventDefault();
    loginContainer.style.display = 'none';
    forgotPasswordContainer.style.display = 'flex';
  });

  document.getElementById('back-to-login').addEventListener('click', function(event) {
    event.preventDefault();
    forgotPasswordContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
  });

  document.getElementById('forgot-password-form').addEventListener('submit', function(event) {
    event.preventDefault();
    forgotPasswordContainer.style.display = 'none';
    checkEmailContainer.style.display = 'flex';
  });

  document.getElementById('open-email-button').addEventListener('click', function() {
    checkEmailContainer.style.display = 'none';
    resetPasswordContainer.style.display = 'flex';
  });

  document.getElementById('reset-password-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const newPassword = document.getElementById('new-password').value;
    const confirmNewPassword = document.getElementById('confirm-new-password').value;

    if (newPassword !== confirmNewPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Kod za resetovanje lozinke
    console.log('New Password:', newPassword);

    // Pretpostavimo da koristimo fetch API za slanje zahtjeva za resetovanje lozinke
    fetch('https://your-api-endpoint.com/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password: newPassword })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // Ako je resetovanje lozinke uspješno, prikaži uspješnu poruku
          resetPasswordContainer.style.display = 'none';
          passwordResetSuccessContainer.style.display = 'flex';
        } else {
          // Prikaz poruke o grešci
          alert('Password reset failed: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
      });
  });

  document.getElementById('back-to-login-success').addEventListener('click', function() {
    passwordResetSuccessContainer.style.display = 'none';
    loginContainer.style.display = 'flex';
  });
});
