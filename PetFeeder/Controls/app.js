let btn = document.getElementById('myButton');
btn.addEventListener('click', function() {
  if (this.classList.contains('active')) {
    btn.innerText = 'Off';
  } else {
    btn.innerText = 'On';
  }
  this.classList.toggle('active');
});
