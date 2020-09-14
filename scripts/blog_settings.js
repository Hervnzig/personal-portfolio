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
              console.log(error.message);
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
