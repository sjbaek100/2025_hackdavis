document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/disasters")
      .then((res) => res.json())
      .then((data) => {
        const container = document.getElementById("disaster-list");
        container.innerHTML = "";
  
        data.forEach((item) => {
          const card = document.createElement("div");
          card.className = "alert-card";
  
          card.innerHTML = `
            <h3>${item.type}</h3>
            <p><strong>Location:</strong> ${item.location}</p>
            <p><strong>Time:</strong> ${item.time}</p>
            <p>${item.message}</p>
          `;
  
          container.appendChild(card);
        });
      })
      .catch((err) => {
        console.error("Failed to fetch disaster data:", err);
      });
  });
  