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

// ======= displaying comments ==========
const writeCommentFormContainer = document.querySelector(
  "#commentFormContainer"
);
const showFormBtn = document.querySelector("#displayCommentBtn");
const commentForm = document.querySelector("#writeCommentForm");

let commentMode = false;
// let commentMode = false;

function appendCommentForm() {
  let form = document.createElement("form");
  form.setAttribute("id", "writeCommentForm");

  let emailDiv = document.createElement("div");
  emailDiv.setAttribute("class", "input-field");
  let emailLabel = document.createElement("label");
  let labeEmailContent = document.createTextNode("Your email");
  emailLabel.appendChild(labeEmailContent);
  let emailInput = document.createElement("input");
  emailInput.setAttribute("id", "comment_email");

  emailDiv.appendChild(emailLabel);
  emailDiv.appendChild(emailInput);

  let contentDiv = document.createElement("div");
  contentDiv.setAttribute("class", "input-field");
  let contentLabel = document.createElement("label");
  let labelContent = document.createTextNode("Your comment");
  contentLabel.appendChild(labelContent);
  let contentInput = document.createElement("textarea");
  contentInput.setAttribute("id", "comment_subject");

  contentDiv.appendChild(contentLabel);
  contentDiv.appendChild(contentInput);

  let buttonDiv = document.createElement("div");
  buttonDiv.setAttribute("class", "input-field");
  let replyCommentBtn = document.createElement("button");
  replyCommentBtn.setAttribute("id", "reply_to_post");
  let btn_content = document.createTextNode("reply");
  replyCommentBtn.appendChild(btn_content);

  buttonDiv.appendChild(replyCommentBtn);

  form.appendChild(emailDiv);
  form.appendChild(contentDiv);
  form.appendChild(buttonDiv);

  writeCommentFormContainer.appendChild(form);
}

const removeCommentForm = () => {
  let commentForm = document.getElementById("writeCommentForm");
  writeCommentFormContainer.removeChild(commentForm);
};

if (showFormBtn !== null) {
  showFormBtn.addEventListener("click", () => {
    if (commentMode == false) {
      commentMode = true;
      writeCommentFormContainer.style.display = "block";
      appendCommentForm();
    }
  });
}
