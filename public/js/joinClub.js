document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('joinClubForm');
    const messageDiv = document.getElementById('joinClubMessage');
    if (!form) return;
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        messageDiv.textContent = '';
        const club = document.getElementById('club').value;
        const note = document.getElementById('note').value;
        try {
            const res = await fetch('/join-requests/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ club, note })
            });
            const data = await res.json();
            if (res.ok) {
                messageDiv.textContent = data.message;
                messageDiv.style.color = 'green';
                form.reset();
            } else {
                messageDiv.textContent = data.message;
                messageDiv.style.color = 'red';
            }
        } catch (err) {
            messageDiv.textContent = 'Error submitting request.';
            messageDiv.style.color = 'red';
        }
    });
}); 