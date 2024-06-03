import { supabase } from './supabaseClient.js';

document.addEventListener("DOMContentLoaded", async function() {
  const user = supabase.auth.user();
  if (!user) {
    alert('You must be logged in to view this page');
    window.location.href = 'login.html'; // Redirect to login if not authenticated
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId');

  if (!gameId) {
    console.error('No gameId specified in URL.');
    return;
  }

  // Fetch game data
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', gameId)
    .single();

  if (error) {
    console.error('Error fetching game:', error);
    return;
  }

  const game = data;
  console.log('Fetched game:', game);

  // Update game details
  document.getElementById('game-title').textContent = game.name || 'N/A';
  document.getElementById('main-image').src = game.picture_url || 'img/default.png';
  document.getElementById('game-description').textContent = game.description || 'No description available.';

  const overallReviews = game.overall_reviews ? game.overall_reviews : 'No overall reviews available';
  document.getElementById('overall-reviews').textContent = overallReviews;

  const recentReviews = game.recent_reviews ? game.recent_reviews : 'No recent reviews available';
  document.getElementById('recent-reviews').textContent = recentReviews;

  document.getElementById('cover-image').src = game.cover_image_url || 'img/default.png';
  document.getElementById('right-description').textContent = game.comments || 'No comments available';

  // Display system requirements
  const requirements = game.specifications ? game.specifications : { minimum: {}, recommended: {} };
  const systemRequirements = document.getElementById('system-requirements');
  systemRequirements.innerHTML = `
    <h4>Minimum:</h4>
    <ul>
      <li>OS: ${requirements.minimum.os || 'N/A'}</li>
      <li>Processor: ${requirements.minimum.processor || 'N/A'}</li>
      <li>Memory: ${requirements.minimum.memory || 'N/A'}</li>
      <li>Graphics: ${requirements.minimum.graphics || 'N/A'}</li>
      <li>Storage: ${requirements.minimum.storage || 'N/A'}</li>
    </ul>
    <h4>Recommended:</h4>
    <ul>
      <li>OS: ${requirements.recommended.os || 'N/A'}</li>
      <li>Processor: ${requirements.recommended.processor || 'N/A'}</li>
      <li>Memory: ${requirements.recommended.memory || 'N/A'}</li>
      <li>Graphics: ${requirements.recommended.graphics || 'N/A'}</li>
      <li>Storage: ${requirements.recommended.storage || 'N/A'}</li>
    </ul>
  `;

  // Display thumbnails and add event listeners for changing main image
  const thumbnailsContainer = document.getElementById('thumbnails');
  thumbnailsContainer.innerHTML = '';  // Clear any existing thumbnails

  if (Array.isArray(game.thumbnails)) {
    game.thumbnails.forEach(url => {
      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Thumbnail';
      img.classList.add('thumbnail');
      img.addEventListener('click', () => {
        document.getElementById('main-image').src = url;
      });
      thumbnailsContainer.appendChild(img);
    });
  } else {
    const noThumbnailsMessage = document.createElement('p');
    noThumbnailsMessage.textContent = 'No thumbnails available';
    thumbnailsContainer.appendChild(noThumbnailsMessage);
  }

  // Fetch and display comments
  const { data: comments, error: commentsError } = await supabase
    .from('comments')
    .select('*')
    .eq('game_id', gameId);

  if (commentsError) {
    console.error('Error fetching comments:', commentsError);
    return;
  }

  const reviewContainer = document.getElementById('review-container');
  reviewContainer.innerHTML = ''; // Clear existing reviews

  comments.forEach(comment => {
    const review = document.createElement('div');
    review.className = 'review';
    review.innerHTML = `
      <div class="reviewer-info">
        <img src="img/user.png" alt="Reviewer">
        <div>
          <h3>Username</h3>
          <span>Recommended</span>
        </div>
      </div>
      <div class="review-content">
        <p>${comment.comment}</p>
      </div>
      <div class="review-feedback">
        <span>${new Date(comment.created_at).toLocaleDateString()}</span>
        <div class="buttons">
          <button>Helpful</button>
          <button>Not Helpful</button>
        </div>
      </div>
    `;
    reviewContainer.appendChild(review);
  });

  // Add functionality to submit a new comment
  document.getElementById('submit-comment').addEventListener('click', async () => {
    const commentText = document.getElementById('new-comment').value;
    if (!commentText) {
      alert('Comment cannot be empty');
      return;
    }

    const user = supabase.auth.user();
    if (!user) {
      alert('You must be logged in to submit a comment');
      return;
    }

    const userId = user.id;

    const { data: newComment, error: newCommentError } = await supabase
      .from('comments')
      .insert([{ game_id: gameId, user_id: userId, comment: commentText }]);

    if (newCommentError) {
      console.error('Error adding comment:', newCommentError);
      return;
    }

    // Clear the comment input field
    document.getElementById('new-comment').value = '';

    // Append the new comment to the list
    const newReview = document.createElement('div');
    newReview.className = 'review';
    newReview.innerHTML = `
      <div class="reviewer-info">
        <img src="img/user.png" alt="Reviewer">
        <div>
          <h3>Username</h3>
          <span>Recommended</span>
        </div>
      </div>
      <div class="review-content">
        <p>${commentText}</p>
      </div>
      <div class="review-feedback">
        <span>${new Date().toLocaleDateString()}</span>
        <div class="buttons">
          <button>Helpful</button>
          <button>Not Helpful</button>
        </div>
      </div>
    `;
    reviewContainer.appendChild(newReview);
  });


});
