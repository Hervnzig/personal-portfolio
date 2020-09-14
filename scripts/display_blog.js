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
  localStorage.setItem("currentPostId", currentPostId);
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
