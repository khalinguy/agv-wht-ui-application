// Select DOM items
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-nav');
const menuBranding = document.querySelector('.menu-branding');
const navItems = document.querySelectorAll('.nav-item');

// Set intial state of the menu
let showMenu = false;
let AGVstate = true;

menuBtn.addEventListener('click', toggleMenu);
menuBtn.addEventListener('click', AGVStateChange);

function AGVStateChange() {
    if (AGVstate) {
        localStorage.setItem('imgsrc', "dist/img/AGV-Green.png");

        AGVstate = false;
    } else {
        localStorage.setItem('imgsrc', "dist/img/AGV-Red.png");

        AGVstate = true;
    }
}

function toggleMenu() {
    if(!showMenu) {
        menuBtn.classList.add('close');
        menu.classList.add('show');
        menuNav.classList.add('show');
        menuBranding.classList.add('show');
        navItems.forEach(item => item.classList.add('show'));

        // Set Menu State
        showMenu = true;
    } else {
        menuBtn.classList.remove('close');
        menu.classList.remove('show');
        menuNav.classList.remove('show');
        menuBranding.classList.remove('show');
        navItems.forEach(item => item.classList.remove('show'));
        // Set Menu State
        showMenu = false;
    }
}

navItems.forEach(item => item.addEventListener('click', clearMenu));

function clearMenu() {
    menuBtn.classList.remove('close');
    menu.classList.remove('show');
    menuNav.classList.remove('show');
    menuBranding.classList.remove('show');
    navItems.forEach(item => item.classList.remove('show'));
}