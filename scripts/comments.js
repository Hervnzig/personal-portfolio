const commentEmail = document.querySelector("#comment_email");
const commentContent = document.querySelector("#comment_subject");
const commentForm = document.querySelector("#writeCommentForm");
const allComments = document.querySelector("#view_comments");

if (commentForm !== null) {
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let email = commentEmail.value;
    let content = commentContent.value;
    console.log(email, content);

    db.collection("comments").add({
      comment_email: email,
      comment_content: content,
      post_id: localStorage.getItem("currentPostId"),
    });
  });
}

db.collection("comments")
  .where("post_id", "==", localStorage.getItem("currentPostId"))
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      // doc.data() is never undefined for query doc snapshots
      (comments = doc.data().comment_content),
        (comment_auths = doc.data().comment_email);
      console.log(comments);

      let div = document.createElement("div");
      div.setAttribute("class", "all_comments");

      let anchorAuth = document.createElement("small");
      anchorAuth.setAttribute("class", "comment-user");
      let commentAuth = document.createTextNode(comment_auths);
      anchorAuth.appendChild(commentAuth);

      let theCommentblock = document.createElement("p");
      let commentContent = document.createTextNode(comments);
      theCommentblock.appendChild(commentContent);

      div.appendChild(anchorAuth);
      div.appendChild(theCommentblock);

      allComments.appendChild(div);
    });
  })
  .catch(function (error) {
    console.log("Error getting documents: ", error);
  });
