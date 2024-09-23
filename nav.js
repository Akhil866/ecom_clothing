const createNav = () => {
    let nav = document.querySelector('.navbar');

    nav.innerHTML = `
    <div class="nav">
        <img src="img/dark-logo.png" class="brand-logo" alt="">
        <div class="nav-items">
            <div class="search">
                <input type="text" class="search-box" placeholder="search brand, product">
                <button class="search-btn">search</button>
            </div>
            <a href="#">
                <img src="img/user.png" id="user-img" alt="">
                <div class="login-logout-popup hide">
                    <p class="account-info">Log in as, <span id="user-name"></span></p>
                    <button class="btn" id="user-btn">Log out</button>
                </div>
            </a>
            <a href="#"><img src="img/cart.png" alt=""></a>
        </div>
    </div>
    <ul class="links-container">
        <li class="link-item"><a href="#" class="link">home</a></li>
        <li class="link-item"><a href="#" class="link">women</a></li>
        <li class="link-item"><a href="#" class="link">men</a></li>
        <li class="link-item"><a href="#" class="link">kids</a></li>
        <li class="link-item"><a href="#" class="link">accessories</a></li>
    </ul>
    `;
}

createNav();

// nav popup
const userImageBUtton = document.querySelector('#user-img');
const userPopup = document.querySelector('.login-logout-popup');
const userNameElement = document.querySelector('#user-name');
const actionBtn = document.querySelector('#user-btn');

userImageBUtton.addEventListener('click', () => {
    userPopup.classList.toggle('hide');
});

window.onload = () => {
    let user = JSON.parse(sessionStorage.user || null);
    if (user != null) {
        // user is logged in
        userNameElement.textContent = user.name;
        actionBtn.innerHTML = 'Log out';
        actionBtn.addEventListener('click', () => {
            sessionStorage.clear();
            location.reload();
        });
    } else {
        // user is logged out
        userNameElement.innerHTML = 'Log in to place an order';
        actionBtn.innerHTML = 'Log in';
        actionBtn.addEventListener('click', () => {
            location.href = '/login';
        });
    }
}
