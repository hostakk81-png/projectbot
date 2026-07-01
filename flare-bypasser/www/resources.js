document.addEventListener("DOMContentLoaded", function () {
  // Get the modal
  var modal = document.getElementById("authModal");
  var statModal = document.getElementByClassName("myModal");

  // Get the button that opens the modal
  var buttons = document.querySelectorAll(".myBtn");
  var statButtons = document.querySelectorAll("#statBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementById("close");
  var span1 = document.getElementById("close1");

  // When the user clicks on the button, open the modal
  buttons.forEach(function (btn) {
    btn.onclick = function(event) {
      event.preventDefault(); // Отменяем стандартное поведение ссылки
      modal.style.display = "block";
    }
  })

  statButtons.forEach(function (btn) {
    btn.onclick = function(event) {
      event.preventDefault(); // Отменяем стандартное поведение ссылки
      statModal.style.display = "block";
    }
  })

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  span1.onclick = function() {
    statModal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
    if (event.target == statModal) {
      statModal.style.display = "none";
    }
  }
});
