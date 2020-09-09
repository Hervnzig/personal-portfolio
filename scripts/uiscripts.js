const loggedOutLinks = document.querySelectorAll("#logged-out");
const loggedInLinks = document.querySelectorAll("#logged-in");

const setupUI = (user) => {
  if (user) {
    //toggle UI elements
    loggedInLinks.forEach((item) => {
      item.style.display = "block";
    });
    loggedOutLinks.forEach((item) => {
      item.style.display = "none";
    });
  } else {
    //toggle UI elements
    loggedInLinks.forEach((item) => {
      item.style.display = "none";
    });
    loggedOutLinks.forEach((item) => {
      item.style.display = "block";
    });
  }
};

// ============== Navigation bar open and close functions ==============
let navList = document.getElementById("nav-lists");
function Show() {
  navList.classList.add("_Menus-show");
}

function Hide() {
  navList.classList.remove("_Menus-show");
}

// ==============login and signup modals ==============
let modalLogin = document.querySelector("#modal-login");
let trigger = document.querySelector(".modal-trigger");
let closeButton = document.querySelector(".close-button");

let modalSignUp = document.querySelector("#modal-signup");
let triggerSignUp = document.querySelector(".modal-trigger-sign-up");
let closeButtonSignUp = document.querySelector(".close-button-sign-up");

// ------------ login modal ------------
function toggleModal() {
  modalLogin.classList.toggle("show-modal");
}

function windowOnClick(event) {
  if (event.target === modalLogin) {
    toggleModal();
  }
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);

//------------ SignUp Modal ------------
function toggleModalSignUp() {
  modalSignUp.classList.toggle("show-modal-2");
}

function windowOnClickSignUp(event) {
  if (event.target === modalSignUp) {
    toggleModalSignUp();
  }
}

triggerSignUp.addEventListener("click", toggleModalSignUp);
closeButtonSignUp.addEventListener("click", toggleModalSignUp);
window.addEventListener("click", windowOnClickSignUp);

// ======= Snackbar notification ==========
function Notify() {
  let x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 10000);
}
