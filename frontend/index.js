// dummy data
const posts = [
  {
    id: 1,
    title: "Lost Wallet",
    time: "2025-04-19T12:30:00Z",
    location: "Library",
    category: "Lost",
    description: "Black wallet with ID and cards.",
    likes: 2,
    dislikes: 0,
  },
  {
    id: 2,
    title: "Found Keys",
    time: "2025-04-18T09:00:00Z",
    location: "Cafeteria",
    category: "Found",
    description: "Set of house keys with a red keychain.",
    likes: 5,
    dislikes: 1,
  },
  {
    id: 3,
    title: "Lost Cat",
    time: "2025-04-17T16:45:00Z",
    location: "Dorm Area",
    category: "Lost",
    description: "Orange cat, answers to 'Pumpkin'.",
    likes: 1,
    dislikes: 0,
  },
  {
    id: 4,
    title: "Found Phone",
    time: "2025-04-19T08:15:00Z",
    location: "Lecture Hall",
    category: "Found",
    description: "iPhone with cracked screen, no case.",
    likes: 3,
    dislikes: 0,
  },
  {
    id: 5,
    title: "Lost AirPods",
    time: "2025-04-18T20:00:00Z",
    location: "Gym",
    category: "Lost",
    description: "White AirPods in a green silicone case.",
    likes: 0,
    dislikes: 2,
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
      <a href="post.html?id=${report.id}">Read More</a>
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

  if (filter && filter.value === 'most_recent') {
    sortedPosts.sort((a, b) => new Date(b.time) - new Date(a.time));
  } else if (filter && filter.value === 'most_liked') {
    sortedPosts.sort((a, b) => b.likes - a.likes);
  }

  renderPosts(sortedPosts);
}

document.addEventListener("DOMContentLoaded", () => {
  sortAndRender();
  if (filter) {
    filter.addEventListener('change', sortAndRender);
  }
});
