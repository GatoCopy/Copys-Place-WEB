/**
 * COPY'S PLACE - COMMENTS SYSTEM
 * Gestiona el chat de comentarios con reacciones (localStorage)
 */

function initComments() {
  loadComments();
  
  const commentForm = document.getElementById('commentForm');
  if (commentForm) {
    commentForm.addEventListener('submit', handleCommentSubmit);
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function loadComments() {
  const commentsList = document.getElementById('commentsList');
  const comments = JSON.parse(localStorage.getItem('copyplaceComments')) || [];
  
  if (comments.length === 0) {
    commentsList.innerHTML = '<div class="no-comments">💭 Sé el primero en dejar un mensaje...</div>';
    return;
  }
  
  commentsList.innerHTML = '';
  
  // Mostrar del más reciente al más antiguo
  comments.reverse().forEach((comment, index) => {
    const originalIndex = comments.length - 1 - index;
    const commentDiv = document.createElement('div');
    commentDiv.className = 'comment';
    
    const likeCount = comment.likes || 0;
    const dislikeCount = comment.dislikes || 0;
    const userLike = comment.userLike || null;

    commentDiv.innerHTML = `
      <div class="comment-author">@${escapeHtml(comment.name)}</div>
      <div class="comment-date">⏰ ${comment.date}</div>
      <div class="comment-text">${escapeHtml(comment.text).replace(/\n/g, '<br>')}</div>
      <div class="comment-reactions">
        <button class="reaction-btn ${userLike === 'like' ? 'active' : ''}" data-id="${originalIndex}" data-type="like" title="Me gusta">
          ❤️ <span class="reaction-count">${likeCount}</span>
        </button>
        <button class="reaction-btn ${userLike === 'dislike' ? 'active' : ''}" data-id="${originalIndex}" data-type="dislike" title="No me gusta">
          💔 <span class="reaction-count">${dislikeCount}</span>
        </button>
      </div>
    `;
    
    commentsList.appendChild(commentDiv);
  });

  // Agregar listeners a botones de reacción
  document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const id = parseInt(this.dataset.id);
      const type = this.dataset.type;
      handleReaction(id, type);
    });
  });
}

function handleReaction(id, type) {
  const comments = JSON.parse(localStorage.getItem('copyplaceComments')) || [];
  const comment = comments[id];

  if (!comment) return;

  if (!comment.likes) comment.likes = 0;
  if (!comment.dislikes) comment.dislikes = 0;

  if (comment.userLike === type) {
    // Deshacer reacción
    if (type === 'like') comment.likes--;
    else comment.dislikes--;
    comment.userLike = null;
  } else {
    // Cambiar reacción
    if (comment.userLike === 'like') comment.likes--;
    if (comment.userLike === 'dislike') comment.dislikes--;
    
    if (type === 'like') comment.likes++;
    else comment.dislikes++;
    comment.userLike = type;
  }

  localStorage.setItem('copyplaceComments', JSON.stringify(comments));
  loadComments();
}

function handleCommentSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const comment = document.getElementById('comment').value.trim();
  
  if (!name || !comment) {
    alert('Por favor completa todos los campos');
    return;
  }
  
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const newComment = {
    name: name,
    text: comment,
    date: dateStr,
    likes: 0,
    dislikes: 0,
    userLike: null
  };
  
  const comments = JSON.parse(localStorage.getItem('copyplaceComments')) || [];
  comments.push(newComment);
  localStorage.setItem('copyplaceComments', JSON.stringify(comments.slice(-50)));
  
  document.getElementById('commentForm').reset();
  loadComments();
  
  // Scroll al chat
  document.getElementById('comentarios').scrollIntoView({ behavior: 'smooth' });
  
  // Feedback visual
  const btn = document.querySelector('.submit-btn');
  btn.textContent = '¡Enviado! 💬';
  setTimeout(() => {
    btn.textContent = 'Enviar Mensaje';
  }, 2000);
}
