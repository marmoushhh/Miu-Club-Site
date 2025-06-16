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

      // Notification functionality
      function showNotificationTab(tabName) {
        const contents = document.querySelectorAll('.notification-content');
        contents.forEach(content => {
          content.style.display = 'none';
        });
        
        const tabs = document.querySelectorAll('.notification-tab');
        tabs.forEach(tab => {
          tab.classList.remove('active');
        });
        
        document.getElementById(`${tabName}-notifications`).style.display = 'block';
        
        let tabIndex = 0;
        switch(tabName) {
          case 'all': tabIndex = 0; break;
          case 'mentions': tabIndex = 1; break;
          case 'follows': tabIndex = 2; break;
          case 'clubs': tabIndex = 3; break;
        }
        
        tabs[tabIndex].classList.add('active');
      }
      
      function markAsRead(element) {
        const notificationItem = element.parentElement;
        notificationItem.classList.remove('unread');
        element.remove();
        showToast('Notification marked as read');
      }
      
      function markAllAsRead() {
        const unreadNotifications = document.querySelectorAll('.notification-item.unread');
        unreadNotifications.forEach(notification => {
          notification.classList.remove('unread');
          const markReadButton = notification.querySelector('.notification-mark-read');
          if (markReadButton) {
            markReadButton.remove();
          }
        });
        showToast('All notifications marked as read');
      }
      
      function followUser(button, username) {
        if (button.textContent === 'Follow back') {
          button.textContent = 'Following';
          button.classList.remove('primary');
          showToast(`You are now following ${username}`);
        } else {
          button.textContent = 'Follow back';
          button.classList.add('primary');
          showToast(`You unfollowed ${username}`);
        }
      }
      
      function viewProfile(username) {
        alert(`Viewing ${username}'s profile`);
      }
      
      function viewEvent() {
        alert('Viewing event details');
      }
      
      function saveEvent() {
        alert('Event saved to your calendar');
      }
      
      function viewPost() {
        alert('Viewing post');
      }
      
      function viewComment() {
        alert('Viewing comment');
      }
      
      function replyToComment() {
        alert('Reply to comment');
      }
      
      function setReminder() {
        alert('Reminder set for this event');
      }
      
      function viewAlbum() {
        alert('Viewing photo album');
      }
      
      function applyForWorkshop() {
        alert('Application submitted for the workshop');
      }
      
      function viewDetails() {
        alert('Viewing details');
      }
      
      function showSettings() {
        alert('Notification settings would open in a modal');
      }
      
      function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = '#333';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '1000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
          toast.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
          toast.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(toast);
          }, 300);
        }, 3000);
      }