// Add an event listener to the form's submit event
const values = {}
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    // Get input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    if(!localStorage.getItem("tokenid")){

        try {
      
          const response = await fetch("http://localhost:3000/users/login", {
      
              method: "POST",
      
              headers: {
      
                  "Content-Type": "application/json"
      
              },
      
              body: JSON.stringify({ email, password })
      
          }).then(res => res.json())
      
          const token = response.token
      
          localStorage.setItem("tokenid",token);
      
        } catch (error) {
      
            console.error("Error during login:", error);
      
            // document.getElementById("error-message").textContent = "An error occurred during login.";
      
        }
      
      }else{      
        window.location.href = "books.html"; 
    }
    
})

