const firebaseConfig = {
  apiKey: "AIzaSyDA46t6qsRN4NQE8KbZPYhlndI2yovrOzo",
  authDomain: "web-portfolio-blog.firebaseapp.com",
  databaseURL: "https://web-portfolio-blog.firebaseio.com",
  projectId: "web-portfolio-blog",
  storageBucket: "web-portfolio-blog.appspot.com",
  messagingSenderId: "782884425067",
  appId: "1:782884425067:web:8f8fc3eec7d76752e4502e",
  measurementId: "G-SGLTSJ1ZPH",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

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
const pagination = document.querySelector("#pagination");

let editMode = false;

let currentPostId;
let currentPostImage;
let currentPostTitle;
let currentPostAuthor;
let currentPostDate;
let currentPostContent;
let currentPostTag;

let lastVisible;

let postsArray = [];
let size;
let postsSize;

const getPosts = async () => {
  let docs;
  let postsRef = firebase
    .firestore()
    .collection("posts")
    .orderBy("blog_date")
    .limit(3);

  let _size = await firebase.firestore().collection("posts").get();
  size = _size.size;

  await postsRef.get().then((documentSnapshots) => {
    docs = documentSnapshots;

    lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    console.log("last", lastVisible);
  });

  docs["docs"].forEach((doc) => {
    postsArray.push({ id: doc.id, data: doc.data() });
  });

  if (postsArray.length > 0) {
    pagination.style.display = "block";
  } else {
    pagination.style.display = "none";
  }

  await createChildren(postsArray);
  postsSize = postCollection.childNodes.length;
  console.log(postsSize);
};

const paginate = async () => {
  pagination.addEventListener("click", () => {
    paginate();
  });
  let docs;
  let postsRef = firebase
    .firestore()
    .collection("posts")
    .orderBy("blog_date")
    .startAfter(lastVisible)
    .limit(3);

  await postsRef.get().then((documentSnapshots) => {
    docs = documentSnapshots;

    lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    console.log("last", lastVisible);
  });

  docs["docs"].forEach((doc, i) => {
    let div = document.createElement("div");
    div.setAttribute("class", "blog-item");

    let div1 = document.createElement("div");
    let anchorSection = document.createElement("section");
    anchorSection.setAttribute("class", "blog-link-block");

    let imageSection = document.createElement("img");
    imageSection.setAttribute("src", doc.data().blog_img);

    // blog title
    let tile = document.createElement("h4");
    let h4Title = document.createTextNode(doc.data().blog_title);
    tile.appendChild(h4Title);

    // blog author
    let authorblock = document.createElement("address");
    authorblock.setAttribute("class", "author");
    let authElement = document.createTextNode("By " + doc.data().blog_author);
    authorblock.appendChild(authElement);

    // blog date
    let dateBlock = document.createElement("span");
    dateBlock.setAttribute("class", "date");
    let dateElement = document.createTextNode(doc.data().blog_date);
    dateBlock.appendChild(dateElement);

    // blog content
    let blogBlock = document.createElement("p");
    let contentElement = document.createTextNode(doc.data().blog_subject);
    blogBlock.appendChild(contentElement);

    // blog tag
    let blogTypeBlock = document.createElement("a");
    blogTypeBlock.setAttribute("class", "hash-tag");
    let blogTpElement = document.createTextNode(doc.data().blog_tag);
    blogTypeBlock.appendChild(blogTpElement);

    let goToFullBlog = document.createElement("a");
    goToFullBlog.innerHTML = "More";
    goToFullBlog.setAttribute("class", "to-read-full-blog");
    goToFullBlog.setAttribute("href", "read-blog.html#/" + doc.id);
    anchorSection.appendChild(goToFullBlog);

    div1.appendChild(tile);
    div1.appendChild(authorblock);
    div1.appendChild(dateBlock);
    div1.appendChild(blogBlock);
    div1.appendChild(blogTypeBlock);
    div1.appendChild(anchorSection);

    div.appendChild(imageSection);
    div.appendChild(div1);

    postCollection.appendChild(div);
    postsSize++;
    console.log(postsSize);
  });

  if (postsSize >= size) {
    pagination.style.display = "none";
  }
};

if (pagination != null) {
  pagination.addEventListener("click", () => {
    paginate();
  });
}

const getPost = async () => {
  let postId = getPostIdFromURL();
  if (loading !== null) {
    loading.innerHTML = "<strong class ='loading-msg'>loading..</strong>";
  }
  let post = await firebase
    .firestore()
    .collection("posts")
    .doc(postId)
    .get()
    .catch((err) => console.log(err));

  currentPostId = post.id;
  currentPostImage = post.data().blog_img;
  currentPostTitle = post.data().blog_title;
  currentPostAuthor = post.data().blog_author;
  currentPostDate = post.data().blog_date;
  currentPostContent = post.data().blog_subject;
  currentPostTag = post.data().blog_tag;

  if (loading !== null) {
    loading.innerHTML = "";
  }

  let div = document.createElement("div");
  let AuthDateDiv = document.createElement("div");
  AuthDateDiv.setAttribute("class", "date-auth-blog");

  let img = document.createElement("img");
  img.setAttribute("src", post.data().blog_img);
  img.setAttribute("loading", "lazy");

  let blgTitle = document.createElement("h4");
  let blgTileNode = document.createTextNode(post.data().blog_title);
  blgTitle.appendChild(blgTileNode);

  let blgAuthor = document.createElement("address");
  blgAuthor.setAttribute("class", "date-auth-blog address");
  let blgAuthNode = document.createTextNode(post.data().blog_author);
  blgAuthor.appendChild(blgAuthNode);

  let blgDate = document.createElement("small");
  blgDate.setAttribute("class", "date-auth-blog small");
  let blgDateNode = document.createTextNode(post.data().blog_date);
  blgDate.appendChild(blgDateNode);

  let blgContent = document.createElement("p");
  let blgContentNode = document.createTextNode(post.data().blog_subject);
  blgContent.appendChild(blgContentNode);

  let blgTag = document.createElement("p");
  let blgTagNode = document.createTextNode(post.data().blog_tag);
  blgTag.appendChild(blgTagNode);

  AuthDateDiv.appendChild(blgAuthor);
  AuthDateDiv.appendChild(blgDate);

  div.appendChild(blgTitle);
  div.appendChild(img);
  div.appendChild(AuthDateDiv);
  div.appendChild(blgContent);
  div.appendChild(blgTag);

  readBlog.appendChild(div);
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
      document.getElementById("blogSubject").value !== "" &&
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

            if (progressHandler != null) {
              progressHandler.style.display = true;
            }
            if (postSubmit != null) {
              postSubmit.disabled = true;
            }
            if (progressBar != null) {
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

      if (postSubmit != null) {
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
  if (
    !location.href.includes("blog-page.html") &&
    !location.href.includes("create-blog.html")
  ) {
    getPost();
  }
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
