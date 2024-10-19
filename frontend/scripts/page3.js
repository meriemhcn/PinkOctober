
 document.querySelector('.profile-field input[value="0"]').parentElement.addEventListener('click', () => showFollowList('followers'));
 document.querySelector('.profile-field input[value="0"]:last-of-type').parentElement.addEventListener('click', () => showFollowList('following'));

async function loadUserProfile() {
    try {
        const userId = localStorage.getItem('userPseudo');
        const response = await fetch(`http://localhost:5000/user/get/user/${userId}`);
        const data = await response.json();
        console.log(data);
        const user = data; 
        const followersField = document.querySelector('.profile-field:nth-of-type(3) input');
        const followingField = document.querySelector('.profile-field:nth-of-type(4) input');
        
        document.querySelector('input[value="Nora BELHADI"]').value = user.lastName || '';
        document.querySelector('input[value="Nora"]').value = user.pseudo || '';
        document.querySelector('textarea').value = user.bio || '....';
        
        followersField.value = user.followers?.length || 0;
        followingField.value = user.following?.length || 0;
        followersField.parentElement.onclick = () => showFollowList('followers', user.followers);
        followingField.parentElement.onclick = () => showFollowList('following', user.following);
    } catch (error) {
        console.error('Error loading profile:', error);
    }
 }



 function showFollowList(type, list) {
    console.log(`Showing ${type} list:`, list);
    const dialog = document.getElementById('followDialog');
    const listContainer = document.querySelector('.follow-list');
    
    listContainer.innerHTML = '';
    
    list?.forEach(user => {
        listContainer.innerHTML += `
            <div class="follow-item">
                <img src="../images/profileicon.png" alt="Profile">
                <span>@${user.pseudo || user}</span>
                <button>+</button>
            </div>
        `;
    });
    
    dialog.style.display = 'block';
}
document.getElementById('closeFollowBtn').onclick = () => {
    document.getElementById('followDialog').style.display = 'none';
};
 document.addEventListener('DOMContentLoaded', function() {
            const searchInput = document.getElementById('searchInput');
            const userList = document.getElementById('userList');
            const loadingSpinner = document.getElementById('loadingSpinner');
            const errorMessage = document.getElementById('errorMessage');

            let allUsers = []; // Stocke tous les utilisateurs

            // Fonction pour charger tous les utilisateurs
            async function loadUsers() {
                try {
                    loadingSpinner.style.display = 'block';
                    errorMessage.style.display = 'none';
                    userList.innerHTML = '';

                    const response = await fetch('http://localhost:5000/user/utilisateurs');
                    if (!response.ok) {
                        ///throw new Error('Erreur lors de la récupération des utilisateurs');
                    }

                    const users = await response.json();
                    console.log(users);
                    allUsers = users; 
                    displayUsers(users); 
                } catch (error) {
                    console.error('Erreur:', error);
                    /*errorMessage.textContent = 'Erreur lors du chargement des utilisateurs';*/
                    errorMessage.style.display = 'block';
                } finally {
                    loadingSpinner.style.display = 'none';
                }
            }

            // Fonction pour afficher les utilisateurs
            function displayUsers(users) {
                userList.innerHTML = '';
                
                if (users.length === 0) {
                    errorMessage.textContent = 'Aucun utilisateur trouvé';
                    errorMessage.style.display = 'block';
                    return;
                }

                users.forEach(user => {
                    const userElement = document.createElement('div');
                    userElement.className = 'user-item';
                    userElement.innerHTML = `
                        <div class="user-info">
                            <div class="user-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="user-details">
                                <span class="user-pseudo">@${user.pseudo}</span>
                                <span class="user-name">${user.firstName} ${user.lastName}</span>
                            </div>
                        </div>
                        <button class="add-button" data-user-id="${user._id}">+</button>
                    `;
                    userList.appendChild(userElement);
                });

                
                document.querySelectorAll('.add-button').forEach(button => {
                    button.addEventListener('click', function() {
                        const userId = this.dataset.userId;
                        
                        console.log('Suivre utilisateur:', userId);
                    });
                });
            }

          
            function filterUsers(searchTerm) {
                const filteredUsers = allUsers.filter(user => 
                    user.username.toLowerCase().includes(searchTerm.toLowerCase())
                );
                displayUsers(filteredUsers);
            }

          
            searchInput.addEventListener('input', function(e) {
                filterUsers(e.target.value);
            });

          
            loadUsers();
        });
        
document.addEventListener('DOMContentLoaded', function() {
    
    const searchInput = document.querySelector('#searchInput');
    const userList = document.querySelector('#userList');
    const loadingSpinner = document.querySelector('#loadingSpinner');
    const errorMessage = document.querySelector('#errorMessage');

    // Vérification que les éléments existent
    if (!searchInput || !userList || !loadingSpinner || !errorMessage) {
        console.error('Certains éléments nécessaires sont manquants dans le DOM');
        return; 
    }

    let allUsers = []; 

    
    async function loadUsers() {
        try {
            loadingSpinner.style.display = 'block';
            errorMessage.style.display = 'none';
            userList.innerHTML = '';

            const response = await fetch('/utilisateurs');
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des utilisateurs');
            }

            const users = await response.json();
            allUsers = users;
            displayUsers(users);
        } catch (error) {
            console.error('Erreur:', error);
            
            errorMessage.style.display = 'block';
        } finally {
            loadingSpinner.style.display = 'none';
        }
    }

    
    function displayUsers(users) {
        userList.innerHTML = '';
        
        if (users.length === 0) {
            errorMessage.textContent = 'Aucun utilisateur trouvé';
            errorMessage.style.display = 'block';
            return;
        }

        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'user-item';
            userElement.innerHTML = `
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <span>@${user.username}</span>
                </div>
                <button class="add-button" data-user-id="${user._id}">+</button>
            `;
            userList.appendChild(userElement);
        });

  
        document.querySelectorAll('.add-button').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.dataset.userId;
                console.log('Suivre utilisateur:', userId);
            });
        });
    }


    function filterUsers(searchTerm) {
        const filteredUsers = allUsers.filter(user => 
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayUsers(filteredUsers);
    }

    searchInput.addEventListener('input', function(e) {
        filterUsers(e.target.value);
    });


    loadUsers();
});

 document.addEventListener('DOMContentLoaded', loadUserProfile);