
document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup"); 

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault(); 

        
        const formData = new FormData(signupForm);
        const data = {
            pseudo: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
            lastname: formData.get("lastname"),
            firstname: formData.get("firstname"),
        };

        try {
           
            const response = await fetch("http://localhost:5000/user/signup",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data), 
            });

            const responseData = await response.json();

            if (response.ok) {
                localStorage.setItem('userPseudo', data.pseudo);
                localStorage.setItem('userId', responseData.userId);
                window.location.href = '../HTML/page3.html';
            }

        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while signing up.");
        }
    });
});

document.getElementById('loginform').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const pseudo = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pseudo, password }),
        });

        const data = await response.json();
        
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('userPseudo', pseudo);
            localStorage.setItem('userId', data._id); 
            console.log(data._id);
        
           // alert('Login successful!');
            
            
            window.location.href = '../HTML/page3.html';
    
            
          } else {
            alert(data.message || 'Login failed');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred during login.');
        }
      });

