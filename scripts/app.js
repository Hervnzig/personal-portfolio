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

// Variables
// const firestore = firebase.firestore();

const db = firebase.firestore();
const postCollection = document.querySelector("#posts_collection");
const createForm = document.querySelector("#createFrom");
const progressBar = document.querySelector("#progressBar");
const progressHandler = document.querySelector("#progressHandler");
const postSubmit = document.querySelector("#postSubmit");

if (createForm !== null) {
  let d;
  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (
      document.getElementById("blogTitle").value !== "" &&
      document.getElementById("blogTag").value !== "" &&
      document.getElementById("blogSubject").value !== "blogSubject" &&
      document.getElementById("blogDate").value !== "" &&
      document.getElementById("blogImage").files[0] !== ""
    ) {
      let blog_title = document.getElementById("blogTitle").value;
      let blog_tag = document.getElementById("blogTag").value;
      let blog_subject = document.getElementById("blogSubject").value;
      let blog_date = document.getElementById("blogDate").value;
      let blog_img = document.getElementById("blogImage").files[0];

      console.log(blog_img);

      const storageRef = firebase.storage().ref();
      const storageChild = storageRef.child(blog_img.name);
      console.log("uploading file ..");
      const postBlogImage = storageChild.put(blog_img);

      await new Promise((resolve) => {
        postBlogImage.on(
          "state_changed",
          (snapshot) => {
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(Math.trunc(progress));

            if (progressHandler !== null) {
              progressHandler.style.display = true;
            }
            if (postSubmit !== null) {
              postSubmit.disabled = true;
            }
            if (progressBar !== null) {
              progressBar.value = progress;
            }
          },
          (error) => {
            console.log(error);
          },
          async () => {
            const downloadURL = await storageChild.getDownloadURL();
            d = downloadURL;
            console.log(d);
            resolve();
          }
        );
      });

      const fileRef = await firebase.storage().refFromURL(d);

      let post = {
        blog_title: blog_title,
        blog_tag: blog_tag,
        blog_subject: blog_subject,
        blog_img: d,
        fileRef: fileRef.location.path,
        blog_date: blog_date,
      };

      await firebase.firestore().collection("posts").add(post);
      console.log("post added successfully");

      if (postSubmit !== null) {
        window.location.replace("blog-page.html");
        postSubmit.disabled = false;
      } else {
        console.log("Must fill in all fields before submitting");
        alert("Must fill in all fields before submitting");
      }
    }
  });
}

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
  button.setAttribute("class", "to-read-full-blog");
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

  // postCollection.appendChild(parentDiv);
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

// ===== previewing the blog image before upload =====
function preview_image(event) {
  var reader = new FileReader();
  reader.onload = function () {
    var output = document.getElementById("output_image");
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}
