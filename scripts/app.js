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

// dashboard elements
const dashPosts = document.querySelector("#blogs_dash");
const settings = document.querySelector("#settings");
const dashPagination = document.querySelector("#pagination-dash");
const editButton = document.querySelector("#edit");
const deleteButton = document.querySelector("#delete");
const editFormContainer = document.querySelector("#editFormContainer");

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

let dashPostsArray = [];
let dash_size;

const getPosts = async () => {
  let docs;
  let postsRef = firebase
    .firestore()
    .collection("posts")
    .orderBy("blog_title")
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

const getPostsDash = async () => {
  let docs;
  let postsRef = firebase
    .firestore()
    .collection("posts")
    .orderBy("blog_title")
    .limit(3);
  let _dash_size = await firebase.firestore().collection("posts").get();
  dash_size = _dash_size.dash_size;

  await postsRef.get().then((documentSnapshots) => {
    docs = documentSnapshots;

    lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    console.log("last", lastVisible);
  });

  docs["docs"].forEach((doc) => {
    dashPostsArray.push({ id: doc.id, data: doc.data() });
  });

  if (dashPostsArray.length > 0) {
    dashPagination.style.display = "block";
  } else {
    dashPagination.style.display = "none";
  }

  await createChildrenDash(dashPostsArray);
  postsSize = dashPosts.childNodes.length;
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
    .orderBy("blog_title")
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
  currentPostTitle = post.data().blog_title;
  currentPostAuthor = post.data().blog_author;
  currentPostDate = post.data().blog_date;
  currentPostContent = post.data().blog_subject;
  currentPostTag = post.data().blog_tag;
  currentPostImage = post.data().fileRef;

  if (loading !== null) {
    loading.innerHTML = "";
  }
  if (post && deleteButton != null) {
    deleteButton.style.display = "block";
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

// ===== Create new Post and upload (Admin dashboard) =====
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
      // let dateParagraph = document.createElement("span");
      // dateParagraph.setAttribute("class", "date");
      // let datePrgrph = document.createTextNode(post.data.blog_date);
      // dateParagraph.appendChild(datePrgrph);

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
      // childDiv.appendChild(dateParagraph);
      childDiv.appendChild(blogParagraph);
      childDiv.appendChild(blogType);
      childDiv.appendChild(linkSection);

      parentDiv.appendChild(img);
      parentDiv.appendChild(childDiv);

      postCollection.appendChild(parentDiv);
    });
  }
};

const createChildrenDash = (arr) => {
  if (dashPosts !== null) {
    arr.map((post) => {
      let mainDiv = document.createElement("div");
      mainDiv.setAttribute("class", "blog-container-dash");

      let dash_img = document.createElement("img");
      dash_img.setAttribute("class", "dash_img image-styling");
      dash_img.setAttribute("src", post.data.blog_img);

      let dashTitleContentDiv = document.createElement("div");
      dashTitleContentDiv.setAttribute("class", "blog-description-dash");

      let dashh3 = document.createElement("h5");
      let h3DashTitle = document.createTextNode(post.data.blog_title);
      dashh3.appendChild(h3DashTitle);

      let dashElementContent = document.createElement("p");
      let dashContent = document.createTextNode(post.data.blog_subject);
      dashElementContent.appendChild(dashContent);

      let dashButtonContainer = document.createElement("div");
      dashButtonContainer.setAttribute("class", "blog-edit-btns");

      let dashItemLink = document.createElement("a");
      dashItemLink.innerHTML = "settings";
      dashItemLink.setAttribute("href", "admin-blog-settings.html#/" + post.id);
      dashItemLink.setAttribute("id", "settings");

      dashTitleContentDiv.appendChild(dashh3);
      dashTitleContentDiv.appendChild(dashElementContent);
      dashButtonContainer.appendChild(dashItemLink);

      mainDiv.appendChild(dash_img);
      mainDiv.appendChild(dashTitleContentDiv);
      mainDiv.appendChild(dashButtonContainer);

      dashPosts.appendChild(mainDiv);
    });
  }
};

const paginateDash = async () => {
  dashPagination.addEventListener("click", () => {
    paginateDash();
  });

  let docs;
  let postsRef = firebase
    .firestore()
    .collection("posts")
    .orderBy("blog_title")
    .startAfter(lastVisible)
    .limit(3);

  await postsRef.get().then((documentSnapshots) => {
    docs = documentSnapshots;

    lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
    console.log("last", lastVisible);
  });

  docs["docs"].forEach((doc, i) => {
    let mainDiv = document.createElement("div");
    mainDiv.setAttribute("class", "blog-container-dash");

    let dash_img = document.createElement("img");
    dash_img.setAttribute("class", "dash_img image-styling");
    dash_img.setAttribute("src", doc.data().blog_img);

    let dashTitleContentDiv = document.createElement("div");
    dashTitleContentDiv.setAttribute("class", "blog-description-dash");

    let dashh3 = document.createElement("h3");
    let h3DashTitle = document.createTextNode(doc.data().blog_title);
    dashh3.appendChild(h3DashTitle);

    let dashElementContent = document.createElement("p");
    let dashContent = document.createTextNode(doc.data().blog_subject);
    dashElementContent.appendChild(dashContent);

    let dashButtonContainer = document.createElement("div");
    dashButtonContainer.setAttribute("class", "blog-edit-btns");

    let dashItemLink = document.createElement("a");
    dashItemLink.innerHTML = "settings";
    dashItemLink.setAttribute("href", "admin-blog-settings.html#/" + doc.id);
    dashItemLink.setAttribute("id", "settings");

    dashTitleContentDiv.appendChild(dashh3);
    dashTitleContentDiv.appendChild(dashElementContent);
    dashButtonContainer.appendChild(dashItemLink);

    mainDiv.appendChild(dash_img);
    mainDiv.appendChild(dashTitleContentDiv);
    mainDiv.appendChild(dashButtonContainer);

    dashPosts.appendChild(mainDiv);
    postsSize++;
    console.log(postsSize);
  });
};
if (dashPagination != null) {
  dashPagination.addEventListener("click", () => {
    paginateDash();
  });
}

if (deleteButton != null) {
  deleteButton.addEventListener("click", async () => {
    const storageRef = firebase.storage().ref();
    await storageRef
      .child(currentPostImage)
      .delete()
      .catch((err) => {
        console.log(err);
      });
    alert("Confirm to delete");
    await firebase.firestore().collection("posts").doc(currentPostId).delete();

    window.location.replace("blogs_dash.html");
  });
}

const appendEditForm = async () => {
  let d;

  let form = document.createElement("form");
  form.setAttribute("method", "POST");
  form.setAttribute("id", "editForm");

  let titleInput = document.createElement("input");
  titleInput.setAttribute("value", currentPostTitle);
  titleInput.setAttribute("id", "editTitle");

  let authorNameInput = document.createElement("input");
  authorNameInput.setAttribute("value", currentPostAuthor);
  authorNameInput.setAttribute("id", "editAuth");

  let editBlogTag = document.createElement("input");
  editBlogTag.setAttribute("value", currentPostTag);
  editBlogTag.setAttribute("id", "editBlogType");

  let contentTextarea = document.createElement("textarea");
  contentTextarea.setAttribute("id", "editContent");

  let coverFile = document.createElement("input");
  coverFile.setAttribute("type", "file");
  coverFile.setAttribute("id", "editCover");

  let oldCover = document.createElement("input");
  oldCover.setAttribute("type", "hidden");
  oldCover.setAttribute("id", "oldCover");

  let editDate = document.createElement("input");
  editDate.setAttribute("type", "date");
  editDate.setAttribute("id", "editDate");

  let submit = document.createElement("input");
  submit.setAttribute("value", "update post");
  submit.setAttribute("type", "submit");
  submit.setAttribute("id", "editSubmit");

  form.appendChild(titleInput);
  form.appendChild(authorNameInput);
  form.appendChild(editBlogTag);
  form.appendChild(contentTextarea);
  form.appendChild(editDate);
  form.appendChild(coverFile);
  form.appendChild(oldCover);
  form.appendChild(submit);

  editFormContainer.appendChild(form);

  document.getElementById("editContent").value = currentPostContent;
  document.getElementById("oldCover").value = currentPostImage;

  document.querySelector("#editForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (
      document.getElementById("editTitle").value != "" &&
      document.getElementById("editAuth").value != "" &&
      document.getElementById("editBlogType").value != "" &&
      document.getElementById("editContent").value != "" &&
      document.getElementById("editDate").value != ""
    ) {
      if (document.getElementById("editCover").files[0] !== undefined) {
        const cover = document.getElementById("editCover").files[0];
        const storageRef = firebase.storage().ref();
        const storageChild = storageRef.child(cover.name);

        console.log("updating file...");

        const postCover = storageChild.put(cover);

        await new Promise((resolve) => {
          postCover.on(
            "state_changed",
            (snapshot) => {
              let progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              progress.innerHTML =
                "Updating progess " + Math.trunc(progress) + " %";

              if (progressHandler != null) {
                progressHandler.style.display = "block";
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
        console.log(currentPostImage);

        await storageRef
          .child(currentPostImage)
          .delete()
          .catch((err) => {
            console.log(err);
          });
        console.log("Previous image deleted successfully");

        let post = {
          blog_title: document.getElementById("editTitle").value,
          blog_author: document.getElementById("editAuth").value,
          blog_tag: document.getElementById("editBlogType").value,
          blog_subject: document.getElementById("editContent").value,
          blog_date: document.getElementById("editDate").value,
          blog_img: d,
          fileRef: fileRef.location.path,
        };

        console.log(post);

        await firebase
          .firestore()
          .collection("posts")
          .doc(currentPostId)
          .set(post, { merge: true });
        location.reload();
      } else {
        await firebase
          .firestore()
          .collection("posts")
          .doc(currentPostId)
          .set(
            {
              blog_title: document.getElementById("editTitle").value,
              blog_author: document.getElementById("editAuth").value,
              blog_tag: document.getElementById("editBlogType").value,
              blog_subject: document.getElementById("editContent").value,
              blog_date: document.getElementById("editDate").value,
            },
            { merge: true }
          );
        location.reload();
      }
    } else {
      console.log("You need to fill the inputs");
    }
  });
};

if (editButton !== null) {
  editButton.addEventListener("click", () => {
    if (editMode == false) {
      editMode = true;
      console.log("Enabling Edit Mode");

      editFormContainer.style.display = "block";

      appendEditForm();
    } else {
      editMode = false;
      console.log("Disabling Edit Mode");
      removeEditForm();

      editFormContainer.style.display = "none";
    }
  });
}

const removeEditForm = () => {
  let editForm = document.getElementById("editForm");
  editFormContainer.removeChild(editForm);
};

// check if the DOM is fully loaded
document.addEventListener("DOMContentLoaded", (e) => {
  getPosts();
  getPostsDash();
  if (
    !location.href.includes("blog-page.html") &&
    !location.href.includes("blogs_dash.html") &&
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
