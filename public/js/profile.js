// Chat functionality
      function toggleChat() {
        document.getElementById('chat-popup').style.display = 'block';
        scrollToBottom();
      }

      function closeChat() {
        document.getElementById('chat-popup').style.display = 'none';
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

      // Profile functionality
      function showTab(tabName) {
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
          content.classList.remove('active');
        });
        
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
          tab.classList.remove('active');
        });
        
        document.getElementById(`${tabName}-tab`).classList.add('active');
        const selectedTab = document.querySelector(`.tab:nth-child(${getTabIndex(tabName)})`);
        selectedTab.classList.add('active');
      }
      
      function getTabIndex(tabName) {
        switch(tabName) {
          case 'personal': return 1;
          case 'following': return 2;
          case 'followers': return 3;
          case 'clubs': return 4;
          case 'password': return 5;
          default: return 1;
        }
      }
      
      function togglePersonalInfoForm() {
        const display = document.getElementById('personal-info-display');
        const form = document.getElementById('personal-info-form');
        
        display.style.display = display.style.display === 'none' ? 'block' : 'none';
        form.classList.toggle('active');
      }
      
      function toggleBioForm() {
        const display = document.getElementById('bio-display');
        const form = document.getElementById('bio-form');
        
        display.style.display = display.style.display === 'none' ? 'block' : 'none';
        form.classList.toggle('active');
      }
      
      function toggleEditProfileForm() {
        alert('Edit profile form would open in a modal');
      }
      
      function savePersonalInfo() {
        alert('Personal information updated successfully!');
        togglePersonalInfoForm();
      }
      
      function saveBio() {
        const bioText = document.getElementById('bio').value;
        document.getElementById('bio-display').innerHTML = `<p>${bioText}</p>`;
        alert('Bio updated successfully!');
        toggleBioForm();
      }
      
      function toggleFollow(button) {
        if (button.classList.contains('following')) {
          button.classList.remove('following');
          button.textContent = 'Follow';
        } else {
          button.classList.add('following');
          button.textContent = 'Following';
        }
      }
      
      function toggleJoin(button) {
        if (button.classList.contains('joined')) {
          button.classList.remove('joined');
          button.textContent = 'Join';
        } else {
          button.classList.add('joined');
          button.textContent = 'Joined';
        }
      }
      
      function checkPasswordStrength() {
        const password = document.getElementById('new-password').value;
        const strengthBar = document.getElementById('password-strength-bar');
        const feedback = document.getElementById('password-feedback');
        
        let strength = 0;
        
        if (password.length >= 8) strength += 25;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
        if (password.match(/\d/)) strength += 25;
        if (password.match(/[^a-zA-Z\d]/)) strength += 25;
        
        strengthBar.style.width = `${strength}%`;
        
        if (strength < 25) {
          strengthBar.style.backgroundColor = '#ff4d4d';
          feedback.textContent = 'Very weak password';
          feedback.style.color = '#ff4d4d';
        } else if (strength < 50) {
          strengthBar.style.backgroundColor = '#ffa64d';
          feedback.textContent = 'Weak password';
          feedback.style.color = '#ffa64d';
        } else if (strength < 75) {
          strengthBar.style.backgroundColor = '#ffff4d';
          feedback.textContent = 'Moderate password';
          feedback.style.color = '#cccc00';
        } else if (strength < 100) {
          strengthBar.style.backgroundColor = '#4dff4d';
          feedback.textContent = 'Strong password';
          feedback.style.color = '#4dff4d';
        } else {
          strengthBar.style.backgroundColor = '#4d4dff';
          feedback.textContent = 'Very strong password';
          feedback.style.color = '#4d4dff';
        }
      }
      
      function checkPasswordMatch() {
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const feedback = document.getElementById('password-match-feedback');
        
        if (newPassword === confirmPassword) {
          feedback.textContent = 'Passwords match!';
          feedback.style.color = '#4dff4d';
        } else {
          feedback.textContent = 'Passwords do not match!';
          feedback.style.color = '#ff4d4d';
        }
      }
      
      function changePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        if (!currentPassword || !newPassword || !confirmPassword) {
          alert('Please fill all fields');
          return;
        }
        
        if (newPassword !== confirmPassword) {
          alert('New passwords do not match');
          return;
        }
        
        alert('Password updated successfully!');
        
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        document.getElementById('password-strength-bar').style.width = '0%';
        document.getElementById('password-feedback').textContent = '';
        document.getElementById('password-match-feedback').textContent = '';
      }