const posts = [
  {
    id: 1,
    title: "Suspicious Activity in Downtown",
    time: "2025-04-19T12:30:00Z",
    location: "Downtown Davis",
    category: "Suspicious Behavior",
    description: "Man pacing around parking lot for over an hour, appearing to watch people and take notes.",
    likes: 4,
    dislikes: 0,
  },
  {
    id: 2,
    title: "Possible Drug Activity Near Oak Grove",
    time: "2025-04-18T22:15:00Z",
    location: "Oak Grove Park",
    category: "Drug Activity",
    description: "Saw two individuals exchanging small bags and cash repeatedly by the benches.",
    likes: 6,
    dislikes: 1,
  },
  {
    id: 3,
    title: "Weapon Sighting on G Street",
    time: "2025-04-17T18:00:00Z",
    location: "G Street",
    category: "Weapon Sighting",
    description: "Person was seen carrying what looked like a handgun under a jacket. Walked toward the 7-Eleven.",
    likes: 10,
    dislikes: 2,
  },
  {
    id: 4,
    title: "Sexual Harassment Incident Near MU",
    time: "2025-04-19T08:45:00Z",
    location: "Memorial Union",
    category: "Sexual Harassment",
    description: "A man catcalled and followed a student after she left the coffee shop. She looked visibly shaken.",
    likes: 7,
    dislikes: 0,
  },
  {
    id: 5,
    title: "Unusual Behavior at the Arboretum",
    time: "2025-04-18T16:30:00Z",
    location: "UC Davis Arboretum",
    category: "Other",
    description: "Individual was shouting incoherently and walking into traffic. Possibly in distress or under influence.",
    likes: 5,
    dislikes: 1,
  }
];

  
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
  
      likeBtn.addEventListener('click', () => {
        report.likes++;
        likeCount.textContent = report.likes;
      });
  
      dislikeBtn.addEventListener('click', () => {
        report.dislikes++;
        dislikeCount.textContent = report.dislikes;
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
  