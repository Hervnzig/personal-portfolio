// listening for auth status changes

auth.onAuthStateChanged((user) => {
  if (user) {
    setupUI(user);
    console.log("User logged in: " + user.email);
  } else {
    setupUI();
    Notify();
  }
});

// signup
const signUpForm = document.querySelector("#signup-form");
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const email = signUpForm["signup-email"].value;
  const password = signUpForm["signup-password"].value;

  // sign up the user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((credential) => {
      return db.collection("users").doc(credential.user.uid).set({
        first_name: signUpForm["signup-fname"].value,
        last_name: signUpForm["signup-lname"].value,
      });
      console.log(credential);
    })
    .then(() => {
      const modalSignUp = document.querySelector("modal-signup");
      signUpForm.reset();
    });

  toggleModalSignUp(); // function from uiscripts.js
});

// logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then(() => {
    console.log("User has logged out");
  });
});

// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get user info
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;
  console.log(email, password);

  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    console.log(cred);
    const modalLogin = document.querySelector("modal-login");
    loginForm.reset();
  });
  toggleModal();
});
