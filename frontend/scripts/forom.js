document.addEventListener('DOMContentLoaded', function() {
    const userPseudo = localStorage.getItem('userPseudo');
    document.getElementById('currentUser').textContent = userPseudo;
});



async function displayPosts() {
    try {
        const response = await fetch('http://localhost:5000/user/get/post');
        const posts = await response.json();
        
        const postsContainer = document.querySelector('.posts-container');
        
        for (const post of posts) {
            let userPseudo = "Unknown User";
            
            if (post.posterId) {
                try {
                    const userResponse = await fetch(`http://localhost:5000/user/get/pseudo/${post.posterId}`);
                    const userData = await userResponse.json();
                    userPseudo = userData.pseudo;

                } catch (err) {
                    console.error('Error fetching user:', err);
                }
            }
            
            const postElement = document.createElement('div');
            postElement.className = 'post-card';
            postElement.innerHTML = `
                <div class="post-header">
                    <span class="post-author">@${userPseudo}</span>
                </div>
                <div class="post-content">${post.message}</div>
                <div class="post-footer">
                   
                    <div class="post-actions">
                        <button class="reaction-btn">💬</button>
                        <button class="reaction-btn">❤️</button>
                    </div>
                </div>
            `;
            
            postsContainer.appendChild(postElement);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}
document.querySelector('.send-button').addEventListener('click', async function() {
    const message = document.querySelector('.textarea').value;
    console.log(message);
    const pseudo = localStorage.getItem('userPseudo'); 
    console.log(pseudo);
 
    if (!message.trim()) {
        alert('Please enter a message');
        return;
    }
 
    try {
        const response = await fetch('http://localhost:5000/user/create/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pseudo: pseudo,
                message: message
            })
        });
 
        const data = await response.json();
        
        if (response.ok) {
            document.querySelector('.textarea').value = '';
            
            displayPosts();
        } else {
            alert(data);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error creating post');
    }
 });
document.addEventListener('DOMContentLoaded', displayPosts);