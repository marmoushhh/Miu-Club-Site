function updateCounters() {
      const userItems = document.querySelectorAll('#users-panel .item').length;
      const postItems = document.querySelectorAll('#posts-panel .item').length;

      document.querySelector('#total-users-card p').textContent = userItems;
      document.querySelector('#total-posts-card p').textContent = postItems;

      document.querySelector('#users-panel h2').innerHTML =
        `Users (${userItems}) <button class="add-btn" id="add-user-btn">Add User</button>`;
      document.querySelector('#posts-panel h2').innerHTML =
        `Posts (${postItems}) <button class="add-btn" id="add-post-btn">Add Post</button>`;

      attachEventListeners(); // rebind add buttons
    }

    function attachDeleteEvents() {
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = () => {
          btn.parentElement.remove();
          updateCounters();
        };
      });
    }

    function addUser() {
      const username = prompt("Enter username:");
      const email = prompt("Enter email:");
      const club = prompt("Enter club name:");

      if (username && email && club) {
        // Add to DOM
        const userPanel = document.getElementById('users-panel');
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
          <div class="meta">
            <strong>${username}</strong><br>
            ${email}<br>
            <span class="club-tag">${club}</span>
          </div>
          <button class="delete-btn">&#128465;</button>
        `;
        userPanel.appendChild(div);

        attachDeleteEvents();
        updateCounters();
      }
    }

    function removeUser() {
      const username = prompt("Enter username to remove:");

      if (!username) return;

      // Remove from admin panel (if found)
      const items = document.querySelectorAll('#users-panel .item');
      items.forEach(item => {
        if (item.innerText.includes(username)) {
          item.remove();
        }
      });

      updateCounters();
    }

    function getInitials(name) {
      const parts = name.trim().split(/[\s_]+/);
      return parts.map(p => p.charAt(0).toUpperCase()).join('').slice(0, 2);
    }

    function openAddPostModal() {
      document.getElementById('addPostModal').style.display = 'block';
    }

    function closeAddPostModal() {
      document.getElementById('addPostModal').style.display = 'none';
      document.getElementById('addPostForm').reset();
      document.getElementById('filePreview').style.display = 'none';
    }

    function addPost() {
      openAddPostModal();
    }

    // File preview functionality
    document.getElementById('postFile').addEventListener('change', function(e) {
      const file = e.target.files[0];
      const preview = document.getElementById('filePreview');
      
      if (file) {
        preview.textContent = `✅ Selected: ${file.name}`;
        preview.style.display = 'block';
      } else {
        preview.style.display = 'none';
      }
    });

    // Handle form submission
    document.getElementById('addPostForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const author = document.getElementById('postAuthor').value;
      const club = document.getElementById('postClub').value;
      const content = document.getElementById('postContent').value;
      const date = document.getElementById('postDate').value;
      const fileInput = document.getElementById('postFile');
      const file = fileInput.files[0];

      // Add to admin panel
      const postPanel = document.getElementById('posts-panel');
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `
        <div class="meta">
          <strong>${author}</strong> <span class="club-tag">${club}</span><br>
          ${content}<br>
          <small>${date}</small>
        </div>
        <button class="delete-btn">&#128465;</button>
      `;
      postPanel.appendChild(div);

      attachDeleteEvents();
      updateCounters();
      closeAddPostModal();
    });

    function attachEventListeners() {
      document.getElementById('add-user-btn').onclick = addUser;
      document.getElementById('add-post-btn').onclick = addPost;
       document.getElementById('remove-user-btn').onclick = removeUser;
      attachDeleteEvents();
    }

    // Initial bindings
    attachEventListeners();

    // Close modal when clicking outside
    window.onclick = function(event) {
      const modal = document.getElementById('addPostModal');
      if (event.target === modal) {
        closeAddPostModal();
      }
    };