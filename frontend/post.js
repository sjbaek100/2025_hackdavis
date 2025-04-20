import { fetchReports, upvoteReport, downvoteReport, removeVote } from "./api.js";

const container = document.getElementById("report-detail");
const params = new URLSearchParams(window.location.search);
const reportId = params.get("id");

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
    ${report.image_url ? `<div><strong>Uploaded Photo:</strong><br><img src="${report.image_url}" alt="photo" class="detail-image" /></div>` : ''}
    <div class="post-actions">
      <button class="like-btn">👍 Like <span class="like-count">${report.upvotes}</span></button>
      <button class="dislike-btn">👎 Dislike <span class="dislike-count">${report.downvotes}</span></button>
    </div>
  `;

  // Attach voting logic
  const likeBtn = container.querySelector(".like-btn");
  const dislikeBtn = container.querySelector(".dislike-btn");
  const likeCount = container.querySelector(".like-count");
  const dislikeCount = container.querySelector(".dislike-count");
  const voteKey = `voted-${report.id}`;
  const currentVote = localStorage.getItem(voteKey);

  if (currentVote === "up") likeBtn.classList.add("voted");
  if (currentVote === "down") dislikeBtn.classList.add("voted");

  likeBtn.addEventListener('click', async () => {
    const voteKey = `voted-${report.id}`;
    const currentVote = localStorage.getItem(voteKey);
  
    if (currentVote === "up") {
      const updated = await removeVote(report.id, "up");
      report.upvotes = updated.upvotes;
      report.downvotes = updated.downvotes;
      likeCount.textContent = report.upvotes;
      dislikeCount.textContent = report.downvotes;
      localStorage.removeItem(voteKey);
      likeBtn.classList.remove("voted");
      dislikeBtn.classList.remove("voted");

    } 
    else {
      if (currentVote === "down") {
        await removeVote(report.id, "down");
      }
      const updated = await upvoteReport(report.id);
      report.upvotes = updated.upvotes;
      report.downvotes = updated.downvotes;
      likeCount.textContent = report.upvotes;
      dislikeCount.textContent = report.downvotes;
      localStorage.setItem(voteKey, "up");
      likeBtn.classList.add("voted");
      dislikeBtn.classList.remove("voted");
    }
  });
  
  dislikeBtn.addEventListener('click', async () => {
    const voteKey = `voted-${report.id}`;
    const currentVote = localStorage.getItem(voteKey);
  
    if (currentVote === "down") {
      const updated = await removeVote(report.id, "down");
      report.upvotes = updated.upvotes;
      report.downvotes = updated.downvotes;
      likeCount.textContent = report.upvotes;
      dislikeCount.textContent = report.downvotes;
      localStorage.removeItem(voteKey);
      likeBtn.classList.remove("voted");
      dislikeBtn.classList.remove("voted");

    } 
    else {
      if (currentVote === "up") {
        await removeVote(report.id, "up");
      }
  
      const updated = await downvoteReport(report.id);
      report.upvotes = updated.upvotes;
      report.downvotes = updated.downvotes;
      likeCount.textContent = report.upvotes;
      dislikeCount.textContent = report.downvotes;
      
      localStorage.setItem(voteKey, "down");
      dislikeBtn.classList.add("voted");
      likeBtn.classList.remove("voted");

    }
  });
}

document.addEventListener("DOMContentLoaded", renderReport);
