// report.js
import { submitReport } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".report-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const reportData = {
      title: formData.get("title") || "Untitled Report",
      location: formData.get("location"),
      time: formData.get("time"),
      category: formData.get("category"),
      description: formData.get("description"),
    };

    try {
      const result = await submitReport(reportData);
      alert("Report submitted successfully!");
      window.location.href = `post.html?id=${result.id}`;
    } catch (err) {
      console.error("Submission failed", err);
      alert("Something went wrong submitting your report.");
    }
  });
});