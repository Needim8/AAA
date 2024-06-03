document.addEventListener("DOMContentLoaded", function() {
  // Example chart configurations using Chart.js
  const ctx1 = document.getElementById('listBreakdownChart').getContext('2d');
  const ctx2 = document.getElementById('platformChart').getContext('2d');

  const listBreakdownChart = new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: ['Playing', 'Backlog', 'Replay', 'Custom', 'Completed', 'Retired'],
      datasets: [{
        label: 'Games',
        data: [821, 4788, 426, 809, 10799, 141],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  const platformChart = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels: ['PC', 'PlayStation 4', 'PlayStation 5'],
      datasets: [{
        label: 'Hours Played',
        data: [87, 89, 88],
        backgroundColor: [
          'rgba(255, 206, 86, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Handle the "Download Game" button click
  document.querySelector('.download-button').addEventListener('click', function() {
    alert('Starting download...');
  });
});
