import { fetchReports, upvoteReport, downvoteReport, removeVote } from "./api.js";

let posts = [];
let currentSort = "newest";

function renderPosts(postList, container) {
  if (!container) {
    console.error("Error: #post-list container not found.");
    return;
  }

  container.innerHTML = '';

  postList.forEach((report) => {
    const post = document.createElement("div");
    post.classList.add("post");

    post.innerHTML = `
    <h2>${report.title}</h2>
    <p class="Time">${new Date(report.created_at).toLocaleString()}</p>
    <p class="Location-category">${report.location} • ${report.category}</p>
    <p class="Description">${report.description}</p>
    <a href="post.html?id=${report.id}">Read More</a>
    <div class="post-actions">
      <button class="like-btn">
        <img src="images/thumbs-up.svg" alt="Like" class="reaction-icon" />
        <span class="like-text">Like</span>
        <span class="like-count">${report.upvotes}</span>
      </button>
      <button class="dislike-btn">
        <img src="images/thumbs-down.svg" alt="Dislike" class="reaction-icon" />
        <span class="dislike-text">Dislike</span>
        <span class="dislike-count">${report.downvotes}</span>
      </button>
    </div>
  `;
  

    const likeBtn = post.querySelector(".like-btn");
    const dislikeBtn = post.querySelector(".dislike-btn");
    const voteKey = `voted-${report.id}`;
    const currentVote = localStorage.getItem(voteKey);

    if (currentVote === "up") likeBtn.classList.add("voted");
    if (currentVote === "down") dislikeBtn.classList.add("voted");

    likeBtn.addEventListener("click", async () => {
      const vote = localStorage.getItem(voteKey);

      if (vote === "up") {
        await removeVote(report.id, "up");
        localStorage.removeItem(voteKey);
      } else {
        if (vote === "down") await removeVote(report.id, "down");
        await upvoteReport(report.id);
        localStorage.setItem(voteKey, "up");
      }

      posts = await fetchReports();
      sortAndRender(container);
    });

    dislikeBtn.addEventListener("click", async () => {
      const vote = localStorage.getItem(voteKey);

      if (vote === "down") {
        await removeVote(report.id, "down");
        localStorage.removeItem(voteKey);
      } else {
        if (vote === "up") await removeVote(report.id, "up");
        await downvoteReport(report.id);
        localStorage.setItem(voteKey, "down");
      }

      posts = await fetchReports();
      sortAndRender(container);
    });

    container.appendChild(post);
  });
}

function sortAndRender(container) {
  let sorted = [...posts];

  if (currentSort === "newest") {
    sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (currentSort === "oldest") {
    sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (currentSort === "most_liked") {
    sorted.sort((a, b) => b.upvotes - a.upvotes);
  }

  renderPosts(sorted, container);
}

async function init(container) {
  posts = await fetchReports();
  sortAndRender(container);
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("post-list");
  const sortMenu = document.getElementById("sortMenu");

  if (!container) {
    console.error("Cannot find #post-list in the DOM.");
    return;
  }

  init(container);

  sortMenu.addEventListener("click", (e) => {
    const value = e.target.getAttribute("data-value");
    if (value) {
      currentSort = value;
      sortAndRender(container);
    }
  });
});
