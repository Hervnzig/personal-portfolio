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

const db = firebase.firestore();
const postCollection = document.querySelector("#posts_collection");
const createForm = document.querySelector("#createFrom");
const progressBar = document.querySelector("#progressBar");
const progressHandler = document.querySelector("#progressHandler");
const postSubmit = document.querySelector("#postSubmit");
const progressCount = document.querySelector("#progress_count");
const warningForm = document.querySelector("#warning");
const loading = document.querySelector("#loading");
const readBlog = document.querySelector("#read_post");

const getPosts = async () => {
  let postsArray = [];
  let docs = await firebase
    .firestore()
    .collection("posts")
    .get()
    .catch((err) => {
      console.log(err);
    });
  docs.forEach((doc) => {
    postsArray.push({ id: doc.id, data: doc.data() });
  });

  createChildren(postsArray);
};

const getPost = async () => {
  // console.log(db);

  let postId = getPostIdFromURL();
  if (loading !== null) {
    loading.innerHTML = "<p>Loading post..</p>";
  }
  let post = await firebase
    .firestore()
    .collection("posts")
    .doc(postId)
    .get()
    .catch((err) => console.log(err));
  if (loading !== null) {
    loading.innerHTML = "";
  }
  if (post !== null) {
    console.log(post.data());
  }

  let blogData = post.data();

  createChild(blogData);
};

const createChild = (postData) => {
  if (readBlog !== null) {
    console.log(postData);
    let parentBlogDiv = document.createElement("div");
    let div = document.createElement("div");
    div.setAttribute("class", "date-auth-blog");

    let title = document.createElement("h4");
    let titleNode = document.createTextNode(postData.blog_title);
    title.appendChild(titleNode);

    let img = document.createElement("img");
    img.setAttribute("src", postData.blog_img);

    let author = document.createElement("address");
    let authorNode = document.createTextNode(postData.blog_author);
    author.appendChild(authorNode);

    let blogDate = document.createElement("small");
    let blogDateNode = document.createTextNode(postData.blog_date);
    blogDate.appendChild(blogDateNode);

    let blogContent = document.createElement("p");
    let blogContentNode = document.createTextNode(postData.blog_subject);
    blogContent.appendChild(blogContentNode);

    div.appendChild(author);
    div.appendChild(blogDate);

    parentBlogDiv.appendChild(title);
    parentBlogDiv.appendChild(img);
    parentBlogDiv.appendChild(div);
    parentBlogDiv.appendChild(blogContent);

    post.appendChild(parentBlogDiv);
  }
};
// display read blog page
const getPostIdFromURL = () => {
  let postLocation = window.location.href;
  let hrefArray = postLocation.split("/");
  let postId = hrefArray.slice(-1).pop();

  return postId;
};

// ===== Create new Post and upload =====
if (createForm !== null) {
  let d;
  createForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (
      document.getElementById("blogTitle").value !== "" &&
      document.getElementById("blogAuthor").value !== "" &&
      document.getElementById("blogTag").value !== "" &&
      document.getElementById("blogSubject").value !== "blogSubject" &&
      document.getElementById("blogDate").value !== "" &&
      document.getElementById("blogImage").files[0] !== ""
    ) {
      let blog_title = document.getElementById("blogTitle").value;
      let blog_author = document.getElementById("blogAuthor").value;
      let blog_tag = document.getElementById("blogTag").value;
      let blog_subject = document.getElementById("blogSubject").value;
      let blog_date = document.getElementById("blogDate").value;
      let blog_img = document.getElementById("blogImage").files[0];

      // console.log(blog_img);

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
            progressCount.innerHTML = "Progress " + Math.trunc(progress) + " %";

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
        blog_author: blog_author,
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
        warningForm.innerHTML = "Must fill in all fields before submitting";
      }
    }
  });
}

const createChildren = (arr) => {
  if (postCollection !== null) {
    arr.map((post) => {
      // console.log(post);
      let parentDiv = document.createElement("div");
      parentDiv.setAttribute("class", "blog-item");

      //
      let childDiv = document.createElement("div");
      let linkSection = document.createElement("section");
      linkSection.setAttribute("class", "blog-link-block");

      //image
      let img = document.createElement("img");
      img.setAttribute("src", post.data.blog_img);

      // blog title
      let h4 = document.createElement("h4");
      let h4Title = document.createTextNode(post.data.blog_title);

      h4.appendChild(h4Title);

      // blog author
      let authorParagraph = document.createElement("address");
      authorParagraph.setAttribute("class", "author");
      let authPrgrph = document.createTextNode("By " + post.data.blog_author);

      authorParagraph.appendChild(authPrgrph);

      // blog date
      let dateParagraph = document.createElement("span");
      dateParagraph.setAttribute("class", "date");
      let datePrgrph = document.createTextNode(post.data.blog_date);
      dateParagraph.appendChild(datePrgrph);

      // blog content
      let blogParagraph = document.createElement("p");
      let paragraphContent = document.createTextNode(post.data.blog_subject);
      blogParagraph.appendChild(paragraphContent);

      // blog tag
      let blogType = document.createElement("a");
      blogType.setAttribute("class", "hash-tag");
      let blogTp = document.createTextNode(post.data.blog_tag);
      blogType.appendChild(blogTp);

      // link
      let readBlogLink = document.createElement("a");
      readBlogLink.innerHTML = "More";
      readBlogLink.setAttribute("class", "to-read-full-blog");
      readBlogLink.setAttribute("href", "read-blog.html#/" + post.id);
      linkSection.appendChild(readBlogLink);

      childDiv.appendChild(h4);
      childDiv.appendChild(authorParagraph);
      childDiv.appendChild(dateParagraph);
      childDiv.appendChild(blogParagraph);
      childDiv.appendChild(blogType);
      childDiv.appendChild(linkSection);

      parentDiv.appendChild(img);
      parentDiv.appendChild(childDiv);

      postCollection.appendChild(parentDiv);
    });
  }
};

// check if the DOM is fully loaded
document.addEventListener("DOMContentLoaded", (e) => {
  getPosts();
  getPost();
});

// ===== previewing the blog image before upload =====
function preview_image(event) {
  var reader = new FileReader();
  reader.onload = function () {
    var output = document.getElementById("output_image");
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}
