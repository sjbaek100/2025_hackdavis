import { fetchReports, upvoteReport, downvoteReport, removeVote, fetchComments, postComment } from "./api.js";

const container = document.getElementById("report-detail");
const params = new URLSearchParams(window.location.search);
const reportId = params.get("id");
const currentUserEmail = "akjekjie@gmail.com"; // dummy user

async function renderReport() {
  const reports = await fetchReports();
  const report = reports.find(r => r.id == reportId);

  if (!report) {
    container.innerHTML = "<p>Report not found.</p>";
    return;
  }

  container.innerHTML = `
    <h2>${report.title}</h2>
    <p><strong>Time:</strong> ${new Date(report.created_at).toLocaleString()}</p>
    <p><strong>Location:</strong> ${report.location}</p>
    <p><strong>Category:</strong> ${report.category}</p>
    <p><strong>Description:</strong><br>${report.description}</p>
    ${report.image_url ? `
      <div>
        <strong>Uploaded Photo:</strong><br>
        <img src="${report.image_url}" alt="photo" class="detail-image"/>
      </div>` : ''
    }

    <div class="post-actions">
      <button class="like-btn">
        <img src="images/thumbs-up.svg" alt="Like" class="reaction-icon" />
        Like <span class="like-count">${report.upvotes}</span>
      </button>

      <button class="dislike-btn">
        <img src="images/thumbs-down.svg" alt="Dislike" class="reaction-icon" />
        Dislike <span class="dislike-count">${report.downvotes}</span>
      </button>
    </div>

    <div class="comment-section">
      <h3>Comments</h3>
      <div class="comment-input">
        <textarea id="commentBox" placeholder="Write a comment..." rows="3"></textarea>
        <button id="submitCommentBtn">Submit</button>
      </div>
      <ul id="commentList"></ul>
    </div>
  `;

  // Voting logic
  const likeBtn = container.querySelector(".like-btn");
  const dislikeBtn = container.querySelector(".dislike-btn");
  const likeCount = container.querySelector(".like-count");
  const dislikeCount = container.querySelector(".dislike-count");
  const voteKey = `voted-${report.id}`;
  const currentVote = localStorage.getItem(voteKey);

  if (currentVote === "up") likeBtn.classList.add("voted");
  if (currentVote === "down") dislikeBtn.classList.add("voted");

  likeBtn.addEventListener("click", async () => {
    if (localStorage.getItem(voteKey) === "up") {
      const updated = await removeVote(report.id, "up");
      report.upvotes = updated.upvotes;
      report.downvotes = updated.downvotes;
      localStorage.removeItem(voteKey);
      likeBtn.classList.remove("voted");
    } else {
      if (localStorage.getItem(voteKey) === "down") await removeVote(report.id, "down");
      const updated = await upvoteReport(report.id);
      report.upvotes = updated.upvotes;
      report.downvotes = updated.downvotes;
      localStorage.setItem(voteKey, "up");
      likeBtn.classList.add("voted");
      dislikeBtn.classList.remove("voted");
    }
    likeCount.textContent = report.upvotes;
    dislikeCount.textContent = report.downvotes;
  });

  dislikeBtn.addEventListener("click", async () => {
    if (localStorage.getItem(voteKey) === "down") {
      const updated = await removeVote(report.id, "down");
      report.upvotes = updated.upvotes;
      report.downvotes = updated.downvotes;
      localStorage.removeItem(voteKey);
      dislikeBtn.classList.remove("voted");
    } else {
      if (localStorage.getItem(voteKey) === "up") await removeVote(report.id, "up");
      const updated = await downvoteReport(report.id);
      report.upvotes = updated.upvotes;
      report.downvotes = updated.downvotes;
      localStorage.setItem(voteKey, "down");
      dislikeBtn.classList.add("voted");
      likeBtn.classList.remove("voted");
    }
    likeCount.textContent = report.upvotes;
    dislikeCount.textContent = report.downvotes;
  });

  // Comments
  const commentList = container.querySelector("#commentList");
  const commentBox = container.querySelector("#commentBox");
  const submitBtn = container.querySelector("#submitCommentBtn");

  const comments = await fetchComments(report.id);
  comments.forEach(c => addCommentToDOM(c.author, c.body));

  submitBtn.addEventListener("click", async () => {
    const body = commentBox.value.trim();
    if (!body) return alert("Please enter a comment.");
    const saved = await postComment(report.id, currentUserEmail, body);
    addCommentToDOM(saved.author, saved.body);
    commentBox.value = "";
  });

  function addCommentToDOM(author, body) {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${author}</strong>: ${body}`;
    commentList.appendChild(li);
  }
}

document.addEventListener("DOMContentLoaded", renderReport);
