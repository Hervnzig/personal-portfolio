const commentEmail = document.querySelector("#comment_email");
const commentContent = document.querySelector("#comment_subject");
const commentForm = document.querySelector("#writeCommentForm");

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
      console.log(doc.id, " => ", doc.data());
    });
  })
  .catch(function (error) {
    console.log("Error getting documents: ", error);
  });
