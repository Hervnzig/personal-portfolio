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

function renderComments(doc) {
  let div = document.createElement("div");
  div.setAttribute("class", "all_comments");
  div.setAttribute("id", doc.id);

  let anchorAuth = document.createElement("small");
  anchorAuth.setAttribute("class", "comment-user");
  let commentAuth = document.createTextNode(doc.data().comment_email);
  anchorAuth.appendChild(commentAuth);

  let theCommentblock = document.createElement("p");
  let commentContent = document.createTextNode(doc.data().comment_content);
  theCommentblock.appendChild(commentContent);

  div.appendChild(anchorAuth);
  div.appendChild(theCommentblock);

  allComments.appendChild(div);

  console.log(doc.id);
}

db.collection("comments")
  .where("post_id", "==", localStorage.getItem("currentPostId"))
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    // console.log(changes);
    changes.forEach((change) => {
      if (change.type == "added") {
        renderComments(change.doc);
      } else if (change.type == "removed") {
        console.log(
          doc.id + "can't be removed, unless admin privileges allows"
        );
      }
    });
  });
