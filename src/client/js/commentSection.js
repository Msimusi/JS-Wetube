const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

let deleteComments = document.querySelectorAll("#deleteBtn__comment");

const addComment = (text, id) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "video__comment";

  const commentIcon = document.createElement("div");
  const commentContent = document.createElement("div");
  const commentDelete = document.createElement("div");

  commentIcon.className = "comment__icon";
  commentContent.className = "comment__content";
  commentDelete.className = "comment__delete";

  const icon = document.createElement("i"); // 아이콘 추가
  icon.className = "fas fa-comment";
  commentIcon.appendChild(icon);

  const pre = document.createElement("pre"); // 텍스트 영역 추가
  pre.innerText = ` ${text}`;
  commentContent.appendChild(pre);

  const span2 = document.createElement("span"); // 삭제버튼 추가
  span2.innerText = "❌";
  span2.id = "deleteBtn__comment";
  commentDelete.appendChild(span2);

  newComment.appendChild(commentIcon);
  newComment.appendChild(commentContent);
  newComment.appendChild(commentDelete);

  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault(); // 새로고침 방지
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  textarea.value = "";
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-type": "application/json" }, // information about request
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    const json = await response.json(); // json 추출.
    addComment(text, json.newCommentId);
    deleteComments = document.getElementById("deleteBtn__comment");
    deleteComments.removeEventListener("click", handleDeleteComment);
    deleteComments.addEventListener("click", handleDeleteComment);
  }
  // window.location.reload();
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

const handleDeleteComment = async (event) => {
  const li = event.srcElement.parentNode.parentNode;
  const {
    dataset: { id: commentId },
  } = li;

  await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });
  li.remove();
};

if (deleteComments) {
  deleteComments.forEach((deleteComment) => {
    deleteComment.addEventListener("click", handleDeleteComment);
  });
}
