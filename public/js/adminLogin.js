  function handleLogin(event) {
  event.preventDefault(); // Stop form from submitting automatically

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const messageDiv = document.getElementById('loginMessage');

  if (!username || !password) {
    messageDiv.textContent = 'Please fill in all fields.';
    return false;
  }

  // Optional: Show success message
  messageDiv.style.color = 'lightgreen';
  messageDiv.textContent = 'Login successful! Redirecting...';

  // Delay to show message before redirecting
  setTimeout(() => {
    window.location.href = 'ClubCommunity.html';
  }, 1000);

  return true;
}


    document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); 

  const remember = document.getElementById("remember").checked;

  alert(`Login submitted.\nRemember me: ${remember ? "Yes" : "No"}`);
});

function showRegister() {
  document.getElementById("registerBox").style.display = "block";
  document.getElementById("registerMessage").innerText = "";
}

function showLogin() {
  document.getElementById("registerBox").style.display = "none";
  document.getElementById("registerMessage").innerText = "";
}
 document.getElementById('loginToadmin').addEventListener('click', function () {
      window.location.href = 'admin.html';
    });
