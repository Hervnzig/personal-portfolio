// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDA46t6qsRN4NQE8KbZPYhlndI2yovrOzo",
  authDomain: "web-portfolio-blog.firebaseapp.com",
  databaseURL: "https://web-portfolio-blog.firebaseio.com",
  projectId: "web-portfolio-blog",
  storageBucket: "web-portfolio-blog.appspot.com",
  messagingSenderId: "782884425067",
  appId: "1:782884425067:web:8f8fc3eec7d76752e4502e",
  measurementId: "G-SGLTSJ1ZPH",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// ===== previewing the blog image before upload =====
function preview_image(event) {
  var reader = new FileReader();
  reader.onload = function () {
    var output = document.getElementById("output_image");
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

let postCollection = document.querySelector("#posts_collection");

const db = firebase.firestore();

function loadPost(image, title, author, date, content, hashTag) {
  let parentDiv = document.createElement("div");
  parentDiv.setAttribute("class", "blog-item");

  let img = document.createElement("img");
  let childDiv = document.createElement("div");
  let h4 = document.createElement("h4");
  let authorParagraph = document.createElement("address");
  authorParagraph.setAttribute("class", "author");
  let dateParagraph = document.createElement("span");
  dateParagraph.setAttribute("class", "date");
  let blogParagraph = document.createElement("p");
  let blogType = document.createElement("a");
  blogType.setAttribute("class", "hash-tag");
  let button = document.createElement("a");
  button.innerHTML = "read more";

  img.src = image;
  h4.textContent = title;
  authorParagraph.textContent = author;
  dateParagraph.textContent = date;
  blogParagraph.textContent = content;
  blogType.textContent = hashTag;

  childDiv.appendChild(h4);
  childDiv.appendChild(authorParagraph);
  childDiv.appendChild(dateParagraph);
  childDiv.appendChild(blogParagraph);
  childDiv.appendChild(blogType);
  childDiv.appendChild(button);

  parentDiv.appendChild(img);
  parentDiv.appendChild(childDiv);

  postCollection.appendChild(parentDiv);
}

// Get posts
function getPosts() {
  db.collection("blogs")
    .get()
    .then((snapshot) => {
      snapshot.docs.forEach((docs) => {
        loadPost(
          docs.data().blogImage,
          docs.data().blogTitle,
          docs.data().blogAuthor,
          docs.data().blogDate,
          docs.data().blogContent,
          docs.data().blogType
        );
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

getPosts();
