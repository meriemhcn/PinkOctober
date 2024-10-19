document.addEventListener('DOMContentLoaded', function() {
    const userPseudo = localStorage.getItem('userPseudo');
    document.getElementById('currentUser').textContent = userPseudo;
});