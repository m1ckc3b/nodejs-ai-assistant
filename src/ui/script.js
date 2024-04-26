function sendMessage() {
  var userInput = document.getElementById("user-input").value;
  if (userInput.trim() === "") return;
  
  var chatMessages = document.getElementById("chat-messages");
  var userMessage = document.createElement("div");
  userMessage.className = "message user-message";
  userMessage.innerHTML = userInput;
  chatMessages.appendChild(userMessage);
  
  // Simulate bot response (replace with actual response from server)
  setTimeout(function() {
      var botMessage = document.createElement("div");
      botMessage.className = "message bot-message";
      botMessage.innerHTML = "I'm just a demo, but I'm glad you asked!";
      chatMessages.appendChild(botMessage);
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 500);
  
  document.getElementById("user-input").value = "";
  chatMessages.scrollTop = chatMessages.scrollHeight;
}