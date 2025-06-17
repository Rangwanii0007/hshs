// Sample ad watching timer logic
let adTimer;
let earnings = 0;

function startAdTimer(adLink, reward) {
  // Redirect to ad link in new tab
  window.open(adLink, '_blank');
  
  // Start 10-second countdown
  let seconds = 10;
  adTimer = setInterval(() => {
    seconds--;
    document.getElementById('countdown').textContent = seconds;
    if(seconds <= 0) {
      clearInterval(adTimer);
      creditEarnings(reward);
    }
  }, 1000);
}

function creditEarnings(amount) {
  earnings += amount;
  document.getElementById('balance').textContent = earnings.toFixed(2);
  // Send to backend to update user balance
  fetch('/api/update-balance', {
    method: 'POST',
    body: JSON.stringify({amount: amount}),
    headers: {'Content-Type': 'application/json'}
  });
}

// Withdrawal form handling
function showWithdrawalOption(option) {
  // Hide all forms first
  document.querySelectorAll('.withdrawal-form').forEach(form => {
    form.style.display = 'none';
  });
  
  // Show selected form
  document.getElementById(`${option}-form`).style.display = 'block';
}

function submitWithdrawal() {
  const formData = {
    method: document.querySelector('.withdrawal-form[style*="block"]').id.replace('-form', ''),
    details: {}
  };
  
  // Collect form data
  const inputs = document.querySelectorAll('.withdrawal-form[style*="block"] input');
  inputs.forEach(input => {
    formData.details[input.name] = input.value;
  });
  
  // Send to backend
  fetch('/api/withdraw', {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {'Content-Type': 'application/json'}
  })
  .then(response => {
    showNotification('Withdrawal request submitted successfully!');
  });
}

// Sample notification data
const notifications = [
  {user: "JohnDoe", amount: 70, type: "earned"},
  {user: "JaneSmith", amount: 150, type: "earned"},
  {user: "MikeJohnson", amount: 2500, type: "withdrawn"},
  {user: "SarahWilliams", amount: 3500, type: "withdrawn"}
];

function displayRandomNotifications() {
  const notificationContainer = document.getElementById('notifications');
  
  // Show 1 notification every 5-10 seconds
  setInterval(() => {
    const randomNotif = notifications[Math.floor(Math.random() * notifications.length)];
    const message = randomNotif.type === 'earned' 
      ? `${randomNotif.user} just earned $${randomNotif.amount}!` 
      : `${randomNotif.user} just withdrew $${randomNotif.amount}!`;
    
    const notifElement = document.createElement('div');
    notifElement.className = 'notification';
    notifElement.textContent = message;
    notificationContainer.prepend(notifElement);
    
    // Remove after animation
    setTimeout(() => {
      notifElement.remove();
    }, 5000);
  }, Math.random() * 5000 + 5000);
}