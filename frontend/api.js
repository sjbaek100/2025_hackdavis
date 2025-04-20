const API_BASE = "http://127.0.0.1:5000"; // or your deployed backend URL

// POST a new suspicious person report
export async function submitReport(reportData) {
    const response = await fetch(`${API_BASE}/alerts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reportData),
    });
  
    return response.json();
  }
  

// Upvote a report
export async function upvoteReport(reportId) {
  const res = await fetch(`${API_BASE}/alerts/${reportId}/upvote`, {
    method: "POST",
  });
  return res.json();
}

// Downvote a report
export async function downvoteReport(reportId) {
  const res = await fetch(`${API_BASE}/alerts/${reportId}/downvote`, {
    method: "POST",
  });
  return res.json();
}

// Get all current reports
export async function fetchReports() {
  const res = await fetch(`${API_BASE}/alerts`);
  return res.json();
}

export async function removeVote(reportId, type) {
    const res = await fetch(`${API_BASE}/alerts/${reportId}/remove_vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type }),
    });
    return res.json();
  }
  
export async function fetchComments(alertId) {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/comments`);
    return res.json();
}

export async function postComment(alertId, author, body) {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author, body }),
    });
    return res.json();
}
  

export async function loginUser(email, password) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // if using cookies
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      return { ok: response.ok, data };
    } catch (error) {
      console.error("Login API error:", error);
      return { ok: false, data: { message: "Network error" } };
    }
  }
  
