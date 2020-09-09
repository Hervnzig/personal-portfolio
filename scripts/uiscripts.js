const loggedOutLinks = document.querySelectorAll("#logged-out");
const loggedInLinks = document.querySelectorAll("#logged-in");
const accountDetails = document.querySelector(".account-details");

const setupUI = (user) => {
  if (user) {
    //Account details
    db.collection("users")
      .doc(user.uid)
      .get()
      .then((doc) => {
        const html = `
    <div>Logged in as ${user.email}</div>
    <small id="user_id">id: ${user.uid}</small>
    <p>Hello ${doc.data().first_name} ${doc.data().last_name}</p>
    `;
        accountDetails.innerHTML = html;
      });
    //toggle UI elements
    loggedInLinks.forEach((item) => {
      item.style.display = "block";
    });
    loggedOutLinks.forEach((item) => {
      item.style.display = "none";
    });
  } else {
    accountDetails.innerHTML = "";
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

// ==============login & signup & account modals ==============
let modalLogin = document.querySelector("#modal-login");
let trigger = document.querySelector(".modal-trigger");
let closeButton = document.querySelector(".close-button");

let modalSignUp = document.querySelector("#modal-signup");
let triggerSignUp = document.querySelector(".modal-trigger-sign-up");
let closeButtonSignUp = document.querySelector(".close-button-sign-up");

let modalAccount = document.querySelector("#modal-account");
let triggerAccount = document.querySelector(".modal-trigger-account");
let closeButtonAccount = document.querySelector(".close-button-account");

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

//------------ Account Modal ------------
function toggleModalAccount() {
  modalAccount.classList.toggle("show-modal-3");
}
function windowOnClickAccount() {
  if (event.target === modalAccount) {
    toggleModalAccount();
  }
}

triggerAccount.addEventListener("click", toggleModalAccount);
closeButtonAccount.addEventListener("click", toggleModalAccount);
window.addEventListener("click", windowOnClickAccount);

// ======= Snackbar notification ==========
function Notify() {
  let x = document.getElementById("snackbar");
  x.className = "show";
  setTimeout(function () {
    x.className = x.className.replace("show", "");
  }, 10000);
}
