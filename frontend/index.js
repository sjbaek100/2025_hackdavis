import { fetchReports, upvoteReport, downvoteReport, removeVote } from "./api.js";

let posts = [];
  const container = document.getElementById('postings-container');
  const filter = document.getElementById('filter');
  
  function renderPosts(postList) {
    container.innerHTML = '';
    postList.forEach(report => {
      const post = document.createElement('div');
      post.classList.add('post');
      post.innerHTML = `
        <h2>${report.title}</h2>
        <p class="Time">${new Date(report.time).toLocaleString()}</p>
        <p class="Location-category">${report.location} • ${report.category}</p>
        <p class="Description">${report.description}</p>
        <a href="post.html">Read More</a>
        <div class="post-actions">
          <button class="like-btn">👍 Like <span class="like-count">${report.likes}</span></button>
          <button class="dislike-btn">👎 Dislike <span class="dislike-count">${report.dislikes}</span></button>
        </div>
      `;
  
      const likeBtn = post.querySelector('.like-btn');
      const dislikeBtn = post.querySelector('.dislike-btn');
      const likeCount = post.querySelector('.like-count');
      const dislikeCount = post.querySelector('.dislike-count');
      const voteKey = `voted-${report.id}`;
      const currentVote = localStorage.getItem(voteKey);
  
      if (currentVote === "up") {
        likeBtn.classList.add("voted");
      } else if (currentVote === "down") {
        dislikeBtn.classList.add("voted");
      }
  
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
      
      
      
  
      container.appendChild(post);
    });
  }
  
  function sortAndRender() {
    let sortedPosts = [...posts];
    const filterVal = filter.value;
  
    if (filterVal === 'newest') {
      sortedPosts.sort((a, b) => new Date(b.time) - new Date(a.time));
    } else if (filterVal === 'most_liked') {
      sortedPosts.sort((a, b) => b.likes - a.likes);
    } else if (filterVal === 'oldest'){
        sortedPosts.sort((a, b) => new Date(a.time) - new Date(b.time))
    }
  
    renderPosts(sortedPosts);
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    sortAndRender();
    filter.addEventListener('change', sortAndRender);
  });
  