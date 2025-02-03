function toggleMenu() {
  document.querySelector('.mobile-menu').classList.toggle('active');
  document.querySelector('.menu-icon').classList.toggle('active');
}
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
