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

      let dashh3 = document.createElement("h4");
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

    let dashh3 = document.createElement("h4");
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
