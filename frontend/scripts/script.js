document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.querySelector("form"); 

    signupForm.addEventListener("submit", async function (event) {
        event.preventDefault(); 

        
        const formData = new FormData(signupForm);
        const data = {
            pseudo: formData.get("pseudo"),
            email: formData.get("email"),
            password: formData.get("password"),
            firstname: formData.get("firstname"),
            lastname: formData.get("lastname"),
        };

        try {
           
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data), 
            });

           
            const result = await response.json();
            alert(result); 

        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while signing up.");
        }
    });
});

document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const pseudo = document.getElementById('pseudo').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pseudo, password }),
        });

        const data = await response.json();

        if (response.ok) {
           
            alert("Login successful! Token: " + data.token);
        } else {
            
            alert("Error: " + data.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert("An error occurred. Please try again.");
    }
});

