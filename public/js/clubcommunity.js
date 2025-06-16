function closeChat() {
  document.getElementById('chat-popup').style.display = 'none';
}

    const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        // Add active to clicked tab
        tab.classList.add('active');

        const target = tab.getAttribute('data-tab');

        // Show corresponding content
        contents.forEach(content => {
          if (content.getAttribute('data-content') === target) {
            content.classList.add('active');
          } else {
            content.classList.remove('active');
          }
        });
      });
    });

    // Enhanced Social Features
    function toggleLike(element) {
      const icon = element.querySelector('.material-icons');
      const count = element.querySelector('.count');
      let currentCount = parseInt(element.dataset.count);
      const isLiked = element.classList.contains('liked');
      
      if (isLiked) {
        // Unlike
        element.classList.remove('liked');
        icon.textContent = 'favorite_border';
        currentCount--;
      } else {
        // Like
        element.classList.add('liked');
        icon.textContent = 'favorite';
        currentCount++;
      }
      
      element.dataset.count = currentCount;
      count.textContent = currentCount;
      count.classList.add('count-animation');
      setTimeout(() => count.classList.remove('count-animation'), 300);
    }

    function toggleRepost(element) {
      const icon = element.querySelector('.material-icons');
      const count = element.querySelector('.count');
      let currentCount = parseInt(element.dataset.count);
      const isReposted = element.classList.contains('reposted');
      
      if (isReposted) {
        // Unrepost
        element.classList.remove('reposted');
        currentCount--;
      } else {
        // Repost
        element.classList.add('reposted');
        currentCount++;
      }
      
      element.dataset.count = currentCount;
      count.textContent = currentCount;
      count.classList.add('count-animation');
      setTimeout(() => count.classList.remove('count-animation'), 300);
    }

    function toggleComments(element) {
      const post = element.closest('.post');
      const commentsSection = post.querySelector('.comments-section');
      const isActive = element.classList.contains('active');
      
      if (isActive) {
        element.classList.remove('active');
        commentsSection.style.display = 'none';
      } else {
        element.classList.add('active');
        commentsSection.style.display = 'block';
        // Focus on input
        setTimeout(() => {
          const input = commentsSection.querySelector('.comment-input');
          input.focus();
        }, 100);
      }
    }

    function postComment(button) {
      const input = button.previousElementSibling;
      const commentList = button.parentElement.nextElementSibling;
      const text = input.value.trim();
      
      if (text) {
        const li = document.createElement('li');
        li.className = 'comment-item';
        
        const avatar = document.createElement('div');
        avatar.className = 'comment-avatar';
        avatar.textContent = 'YU'; // You User
        
        const content = document.createElement('div');
        content.className = 'comment-content';
        
        const author = document.createElement('div');
        author.className = 'comment-author';
        author.textContent = 'You';
        
        const commentText = document.createElement('div');
        commentText.className = 'comment-text';
        commentText.textContent = text;
        
        const time = document.createElement('div');
        time.className = 'comment-time';
        time.textContent = 'Just now';
        
        content.appendChild(author);
        content.appendChild(commentText);
        content.appendChild(time);
        
        li.appendChild(avatar);
        li.appendChild(content);
        
        commentList.appendChild(li);
        input.value = '';
        
        // Update comment count
        const post = button.closest('.post');
        const commentAction = post.querySelector('.comment-action');
        const countElement = commentAction.querySelector('.count');
        let currentCount = parseInt(commentAction.dataset.count);
        currentCount++;
        commentAction.dataset.count = currentCount;
        countElement.textContent = currentCount;
        countElement.classList.add('count-animation');
        setTimeout(() => countElement.classList.remove('count-animation'), 300);
      }
    }

     function sendFile() {
      const fileInput = document.getElementById("file-input");
      const file = fileInput.files[0];
      if (!file) return;

      const msgDiv = document.createElement("div");
      msgDiv.className = "message sent";

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const img = document.createElement("img");
          img.src = e.target.result;
          img.className = "sent-img";
          msgDiv.appendChild(img);
          document.getElementById("chat-box").appendChild(msgDiv);
          scrollToBottom();
        };
        reader.readAsDataURL(file);
      } else {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(file);
        link.download = file.name;
        link.textContent = "📄 " + file.name;
        link.className = "file-link";
        link.target = "_blank";
        msgDiv.appendChild(link);
        document.getElementById("chat-box").appendChild(msgDiv);
        scrollToBottom();
      }

      fileInput.value = "";
    }

function showPostFileAttachment() {
  const fileInput = document.getElementById("postFile");
  const file = fileInput.files[0];
  const messageDiv = document.getElementById("file-attachment-message");

  if (file) {
    messageDiv.textContent = '📎 "${file.name}" attached successfully.';
    messageDiv.style.display = "block";
  } else {
    messageDiv.textContent = "";
    messageDiv.style.display = "none";
  }
}

    function toggleChat() {
    document.getElementById('chat-popup').style.display = 'block';
    scrollToBottom();
  }

  // Function to create post element from data
  function createPostElement(postData) {
    const postDiv = document.createElement("div");
    postDiv.className = "post";

    const avatarDiv = document.createElement("div");
    avatarDiv.className = "post__avatar";
    const avatarImg = document.createElement("img");
    avatarImg.src = "https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png";
    avatarImg.alt = "User Avatar";
    avatarDiv.appendChild(avatarImg);

    const bodyDiv = document.createElement("div");
    bodyDiv.className = "post__body";

    const headerDiv = document.createElement("div");
    headerDiv.className = "post__header";

    const headerTextDiv = document.createElement("div");
    headerTextDiv.className = "post__headerText";

    const h3 = document.createElement("h3");
    h3.textContent = postData.club;
    const spanSpecial = document.createElement("span");
    spanSpecial.className = "post__headerSpecial";
    spanSpecial.innerHTML = `<span class="material-icons post__badge"> verified </span>@${postData.author}`;

    h3.appendChild(spanSpecial);
    headerTextDiv.appendChild(h3);

    const headerDescDiv = document.createElement("div");
    headerDescDiv.className = "post__headerDescription";

    const p = document.createElement("p");
    p.textContent = postData.content;
    headerDescDiv.appendChild(p);

    headerDiv.appendChild(headerTextDiv);
    headerDiv.appendChild(headerDescDiv);
    bodyDiv.appendChild(headerDiv);

    // Add file if present
    if (postData.file) {
      if (postData.file.type.startsWith("image/")) {
        const img = document.createElement("img");
        img.src = postData.file.data;
        bodyDiv.appendChild(img);
      } else if (postData.file.type.startsWith("video/")) {
        const video = document.createElement("video");
        video.controls = true;
        video.src = postData.file.data;
        video.style.maxWidth = "100%";
        bodyDiv.appendChild(video);
      }
    }

    // Enhanced Footer with social actions
    const footerDiv = document.createElement("div");
    footerDiv.className = "post__footer";

    // Repost action
    const repostAction = document.createElement("div");
    repostAction.className = "social-action repost-action";
    repostAction.onclick = function() { toggleRepost(this); };
    repostAction.dataset.count = postData.reposts || "0";
    
    const repostIcon = document.createElement("span");
    repostIcon.className = "material-icons";
    repostIcon.textContent = "repeat";
    
    const repostCount = document.createElement("span");
    repostCount.className = "count";
    repostCount.textContent = postData.reposts || "0";
    
    repostAction.appendChild(repostIcon);
    repostAction.appendChild(repostCount);
    footerDiv.appendChild(repostAction);

    // Like action
    const likeAction = document.createElement("div");
    likeAction.className = "social-action like-action";
    likeAction.onclick = function() { toggleLike(this); };
    likeAction.dataset.count = postData.likes || "0";
    
    const likeIcon = document.createElement("span");
    likeIcon.className = "material-icons";
    likeIcon.textContent = "favorite_border";
    
    const likeCount = document.createElement("span");
    likeCount.className = "count";
    likeCount.textContent = postData.likes || "0";
    
    likeAction.appendChild(likeIcon);
    likeAction.appendChild(likeCount);
    footerDiv.appendChild(likeAction);

    // Comment action
    const commentAction = document.createElement("div");
    commentAction.className = "social-action comment-action";
    commentAction.onclick = function() { toggleComments(this); };
    commentAction.dataset.count = postData.comments || "0";
    
    const commentIcon = document.createElement("span");
    commentIcon.className = "material-icons";
    commentIcon.textContent = "chat_bubble_outline";
    
    const commentCount = document.createElement("span");
    commentCount.className = "count";
    commentCount.textContent = postData.comments || "0";
    
    commentAction.appendChild(commentIcon);
    commentAction.appendChild(commentCount);
    footerDiv.appendChild(commentAction);

    bodyDiv.appendChild(footerDiv);

    // Enhanced Comment Section
    const commentsSection = document.createElement("div");
    commentsSection.className = "comments-section";

    const commentInputContainer = document.createElement("div");
    commentInputContainer.className = "comment-input-container";

    const commentInput = document.createElement("input");
    commentInput.className = "comment-input";
    commentInput.placeholder = "Write a comment...";

    const commentButton = document.createElement("button");
    commentButton.className = "comment-button";
    commentButton.textContent = "Post";
    commentButton.onclick = function() { postComment(this); };

    commentInputContainer.appendChild(commentInput);
    commentInputContainer.appendChild(commentButton);

    const commentList = document.createElement("ul");
    commentList.className = "comment-list";

    commentsSection.appendChild(commentInputContainer);
    commentsSection.appendChild(commentList);

    bodyDiv.appendChild(commentsSection);

    postDiv.appendChild(avatarDiv);
    postDiv.appendChild(bodyDiv);

    return postDiv;
  }

  // Handle post form submission
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, looking for post form...');
    const postForm = document.getElementById('post-form');
    if (postForm) {
      console.log('Post form found, adding submit listener...');
      postForm.addEventListener('submit', function(e) {
        console.log('Form submitted');
        e.preventDefault();
        
        const formData = new FormData(this);
        const content = formData.get('content');
        const file = formData.get('media');
        
        console.log('Form data:', {
          content: content,
          hasFile: !!file,
          fileName: file ? file.name : null
        });
        
        if (!content && !file) {
          console.log('No content or file provided');
          alert('Please enter some text or attach a file');
          return;
        }
        
        console.log('Sending POST request...');
        fetch('/communities/community/posts', {
          method: 'POST',
          body: formData
        })
        .then(response => {
          console.log('Response received:', response.status);
          if (response.ok) {
            console.log('Post successful, reloading page...');
            window.location.reload();
          } else {
            console.error('Response not ok:', response.status);
            throw new Error('Network response was not ok');
          }
        })
        .catch(error => {
          console.error('Error posting:', error);
          alert('Error posting. Please try again.');
        });
      });
    } else {
      console.log('Post form not found!');
    }
  });
  
  function scrollToBottom() {
      const chatBox = document.getElementById("chat-box");
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    function sendMessage() {
      const input = document.getElementById("message-input");
      const message = input.value.trim();
      if (message === "") return;

      const msgDiv = document.createElement("div");
      msgDiv.className = "message sent";
      msgDiv.textContent = message;
      document.getElementById("chat-box").appendChild(msgDiv);

      input.value = "";
      scrollToBottom();

      setTimeout(() => {
        const reply = document.createElement("div");
        reply.className = "message received";
        reply.textContent = "Eh ya albi";
        document.getElementById("chat-box").appendChild(reply);
        scrollToBottom();
      }, 800);
    }

    // Like/Unlike post
    function likePost(btn, postId) {
        fetch(`/communities/community/posts/${postId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success === false || data.error) {
                console.error('Like request failed:', data);
                return;
            }
            const countElement = btn.querySelector('.count');
            const icon = btn.querySelector('.material-icons');
            // Use backend's returned like count and liked state
            countElement.textContent = data.likes;
            if (data.liked) {
                btn.classList.add('liked');
                icon.textContent = 'favorite';
            } else {
                btn.classList.remove('liked');
                icon.textContent = 'favorite_border';
            }
            countElement.classList.add('count-animation');
            setTimeout(() => countElement.classList.remove('count-animation'), 300);
        })
        .catch(error => console.error('Error:', error));
    }

    // Toggle comments section
    function toggleComments(btn) {
        // Find the closest .card (post container)
        const postCard = btn.closest('.card');
        if (!postCard) {
            console.log('toggleComments: Could not find post card');
            return;
        }
        const commentsSection = postCard.querySelector('.comments-section');
        if (!commentsSection) {
            console.log('toggleComments: Could not find comments section');
            return;
        }
        const isActive = btn.classList.contains('active');
        if (isActive) {
            btn.classList.remove('active');
            commentsSection.style.display = 'none';
        } else {
            btn.classList.add('active');
            commentsSection.style.display = 'block';
            // Focus on input
            setTimeout(() => {
                const input = commentsSection.querySelector('.comment-input');
                if (input) input.focus();
            }, 100);
        }
    }

    // Submit comment
    function submitComment(form, postId) {
        const input = form.querySelector('.comment-input');
        const text = input.value.trim();
        if (!text) return false;
        fetch(`/communities/community/posts/${postId}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment: text }) // FIXED: backend expects { comment }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success === false || data.error) {
                alert(data.error || 'Error posting comment');
                return;
            }
            // Reload the page to show the new comment
            window.location.reload();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error posting comment. Please try again.');
        });
        return false;
    }

    // Custom delete post modal logic
    let postIdToDelete = null;
    function deletePost(postId) {
      if (!confirm('Are you sure you want to delete this post?')) return;
      fetch(`/communities/community/posts/${postId}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          const post = document.querySelector(`[data-post-id="${postId}"]`);
          if (post) post.remove();
        }
      })
      .catch(error => console.error('Error:', error));
    }

    document.addEventListener('DOMContentLoaded', function() {
      // Attach confirm delete handler
      const confirmBtn = document.getElementById('confirmDeletePostBtn');
      if (confirmBtn) {
        confirmBtn.onclick = function() {
          if (!postIdToDelete) return;
          deletePost(postIdToDelete);
          postIdToDelete = null;
        };
      }
    });

    // Edit post
    function editPost(postId) {
      const post = document.querySelector(`[data-post-id="${postId}"]`);
      const content = post.querySelector('.post__content');
      const currentText = content.textContent;
      
      const input = document.createElement('textarea');
      input.value = currentText;
      input.className = 'edit-input';
      
      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save';
      saveBtn.className = 'btn btn-primary';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.className = 'btn btn-secondary';
      
      const editControls = document.createElement('div');
      editControls.className = 'edit-controls';
      editControls.appendChild(saveBtn);
      editControls.appendChild(cancelBtn);
      
      content.innerHTML = '';
      content.appendChild(input);
      content.appendChild(editControls);
      
      input.focus();
      
      saveBtn.onclick = () => {
        const newText = input.value.trim();
        if (!newText) return;
        
        fetch(`/communities/community/posts/${postId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ content: newText })
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            content.textContent = newText;
          }
        })
        .catch(error => console.error('Error:', error));
      };
      
      cancelBtn.onclick = () => {
        content.textContent = currentText;
      };
    }

    // Show file attachment preview
    function showPostFileAttachment() {
      const fileInput = document.getElementById('postFile');
      const file = fileInput.files[0];
      const messageDiv = document.getElementById('file-attachment-message');
      
      if (file) {
        messageDiv.textContent = `📎 "${file.name}" attached successfully.`;
        messageDiv.style.display = 'block';
      } else {
        messageDiv.textContent = '';
        messageDiv.style.display = 'none';
      }
    }
