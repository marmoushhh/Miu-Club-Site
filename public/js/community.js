
      function updateCounters() {
    const userCount = document.querySelectorAll('.panel:first-child .item').length;
    const postCount = document.querySelectorAll('.panel:last-child .item').length;
    document.querySelector('.card:nth-child(1) p').textContent = userCount;
    document.querySelector('.card:nth-child(2) p').textContent = postCount;
    document.querySelector('.panel:first-child h2').innerHTML = `Users (${userCount}) <button class="add-btn">Add User</button>`;
    document.querySelector('.panel:last-child h2').innerHTML = `Posts (${postCount}) <button class="add-btn">Add Post</button>`;
    attachAddEvents();
  }

  // Delete any item
  function attachDeleteEvents() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.onclick = function () {
        this.parentElement.remove();
        updateCounters();
      };
    });
  }

  // Add user functionality
  function addUser() {
    const name = prompt("Enter username (e.g., john_doe):");
    const email = prompt("Enter email (e.g., john@miu.edu.eg):");
    const club = prompt("Enter club (e.g., ACPC):");

    if (name && email && club) {
      const panel = document.querySelector('.panel:first-child');
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `
        <div class="meta">
          <strong>${name}</strong><br>
          ${email}<br>
          <span class="club-tag">${club}</span>
        </div>
        <button class="delete-btn">&#128465;</button>
      `;
      panel.appendChild(div);
      attachDeleteEvents();
      updateCounters();
    }
  }

  // Add post functionality
  function addPost() {
    const author = prompt("Enter author (e.g., john_doe):");
    const club = prompt("Enter club (e.g., ACPC):");
    const content = prompt("Enter post content:");
    const date = prompt("Enter date (e.g., 1/25/2024):");

    if (author && club && content && date) {
      const panel = document.querySelector('.panel:last-child');
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
      panel.appendChild(div);
      attachDeleteEvents();
      updateCounters();
    }
  }

  // Assign Add buttons
  function attachAddEvents() {
    const userBtn = document.querySelector('.panel:first-child .add-btn');
    const postBtn = document.querySelector('.panel:last-child .add-btn');

    if (userBtn) userBtn.onclick = addUser;
    if (postBtn) postBtn.onclick = addPost;
  }


 function toggleChat() {
    document.getElementById('chat-popup').style.display = 'block';
    scrollToBottom();
  }
  
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
  // Init
  attachDeleteEvents();
  attachAddEvents();
    

    <script src="js/main.js"></script>