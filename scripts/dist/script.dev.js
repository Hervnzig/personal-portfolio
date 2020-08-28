"use strict";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDA46t6qsRN4NQE8KbZPYhlndI2yovrOzo",
  authDomain: "web-portfolio-blog.firebaseapp.com",
  databaseURL: "https://web-portfolio-blog.firebaseio.com",
  projectId: "web-portfolio-blog",
  storageBucket: "web-portfolio-blog.appspot.com",
  messagingSenderId: "782884425067",
  appId: "1:782884425067:web:8f8fc3eec7d76752e4502e",
  measurementId: "G-SGLTSJ1ZPH"
}; // Initialize Firebase

firebase.initializeApp(firebaseConfig);
firebase.analytics(); // // ===== previewing the blog image before upload =====
// function preview_image(event) {
//   var reader = new FileReader();
//   reader.onload = function () {
//     var output = document.getElementById("output_image");
//     output.src = reader.result;
//   };
//   reader.readAsDataURL(event.target.files[0]);
// }

var postCollection = document.querySelector("#posts_collection");
var db = firebase.firestore();

function loadPost(image, title, content, author, date, hashTag) {
  var parentDiv = document.createElement("div");
  parentDiv.setAttribute("class", "blog-item");
  var img = document.createElement("img");
  var childDiv = document.createElement("div");
  var h4 = document.createElement("h4");
  var authorParagraph = document.createElement("address");
  authorParagraph.setAttribute("class", "author");
  var dateParagraph = document.createElement("p");
  dateParagraph.setAttribute("class", "date");
  var blogParagraph = document.createElement(p);
  var blogType = document.createElement("a");
  blogType.setAttribute("class", "hash-tag");
  var button = document.createElement("a");
  img.src = image;
  h4.textContent = title;
  authorParagraph.textContent = author;
  dateParagraph.textContent = date;
  blogParagraph.textContent = content;
  blogType.textContent = hashTag;
  childDiv.appendChild(h4);
  childDiv.appendChild(authorParagraph);
  childDiv.appendChild(blogParagraph);
  childDiv.appendChild(dateParagraph);
  childDiv.appendChild(blogType);
  parentDiv.appendChild(img);
  parentDiv.appendChild(childDiv);
  parentDiv.appendChild(button);
  postCollection.appendChild(parentDiv); // Get posts

  function getPosts() {
    db.collection("blogs").get().then(function (snapshot) {
      snapshot.docs.forEach(function (docs) {
        loadPost(docs.data().blogImage, docs.data().blogTitle, docs.data().blogAuthor, docs.data().blogContent, docs.data().blogDate, docs.data().blogType);
      });
    })["catch"](function (err) {
      console.log(err);
    });
  }
}

getPosts();