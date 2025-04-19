import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // States to hold dynamic data
  const [proposals, setProposals] = useState([]);
  const [messagesCount, setMessagesCount] = useState(0);
  const [jobsCount, setJobsCount] = useState(0);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch proposals submitted by freelancer
    const fetchProposals = async () => {
      if (currentUser.accType === "Freelancer") {
        const res = await fetch(
          `http://localhost:4000/api/v1/proposals/freelancer/${currentUser.userID}`
        );
        const data = await res.json();
        setProposals(data || []);
        setJobsCount(data.length); // assuming each proposal = 1 applied job
      }
    };

    // Fetch jobs posted by client
    const fetchClientJobs = async () => {
      if (currentUser.accType === "Client") {
        const res = await fetch(
          `http://localhost:4000/api/v1/jobs/client/${currentUser.userID}`
        );
        const data = await res.json();
        setJobsCount(data.length);
      }
    };

    // Fetch unread messages count
    const fetchUnreadMessages = async () => {
      const res = await fetch(
        `http://localhost:4000/api/v1/messages/unread/${currentUser.userID}`
      );
      const data = await res.json();
      setMessagesCount(data.count || 0);
    };

    // Earnings - can be hardcoded or fetched
    const fetchEarnings = async () => {
      const res = await fetch(
        `http://localhost:4000/api/v1/transactions/user/${currentUser.userID}`
      );
      const data = await res.json();
      const totalEarned = data.reduce((sum, tx) => sum + tx.Amount, 0);
      setEarnings(totalEarned);
    };

    if (currentUser.accType === "Freelancer") fetchProposals();
    else fetchClientJobs();

    fetchUnreadMessages();
    fetchEarnings();
  }, [currentUser]);

  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        {currentUser ? (
          <>
            <section className="dashboard-header">
              <h1>Welcome back, {currentUser.name} 👋</h1>
              <p>Here’s a quick summary of your activity</p>
            </section>

            <section className="overview-section">
              <div
                className="overview-card turquoise"
                onClick={() => navigate("/proposals")}
                style={{ cursor: "pointer" }}
              >
                <h3>Proposals</h3>
                <p>{proposals.length} Active</p>
              </div>

              <div
                className="overview-card dark"
                onClick={() => navigate("/messages")}
                style={{ cursor: "pointer" }}
              >
                <h3>Messages</h3>
                <p>{messagesCount} Unread</p>
              </div>

              <div
                className="overview-card turquoise"
                onClick={() => navigate("/transactions")}
                style={{ cursor: "pointer" }}
              >
                <h3>Earnings</h3>
                <p>${earnings}</p>
              </div>

              <div
                className="overview-card dark"
                onClick={() => navigate("/jobs")}
                style={{ cursor: "pointer" }}
              >
                <h3>
                  {currentUser.accType === "Client"
                    ? "Jobs Posted"
                    : "Jobs Applied"}
                </h3>
                <p>{jobsCount} Total</p>
              </div>
            </section>

            <section className="recent-section">
              <h2>
                {currentUser.accType === "Freelancer"
                  ? "Recent Proposals"
                  : "Recent Jobs"}
              </h2>
              {proposals.length > 0 ? (
                proposals.slice(0, 2).map((p, i) => (
                  <div key={i} className="recent-card">
                    <h4>{p.title}</h4>
                    <p>
                      Status: {p.pStatus} | Bid: ${p.bidAmount} | Submitted:{" "}
                      {new Date(p.submittedOn).toDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p>No recent activity found.</p>
              )}
            </section>

            <section className="dashboard-actions">
              {currentUser.accType === "Client" ? (
                <button
                  className="primary-btn"
                  onClick={() => navigate("/post-job")}
                >
                  Post a Job
                </button>
              ) : (
                <button
                  className="primary-btn"
                  onClick={() => navigate("/jobs")}
                >
                  Browse Jobs
                </button>
              )}
            </section>
          </>
        ) : (
          <div className="guest-dashboard">
            <div className="dashboard-header">
              <h1>Welcome to SkillLink!</h1>
              <p>
                Connect with top professionals or find your next opportunity
              </p>
            </div>

            <div className="guest-actions">
              <div className="action-card">
                <h3>For Freelancers</h3>
                <p>Find exciting projects that match your skills</p>
                <button
                  onClick={() => navigate("/register?type=Freelancer")}
                  className="action-button"
                >
                  Join as Freelancer
                </button>
              </div>

              <div className="action-card">
                <h3>For Clients</h3>
                <p>Hire skilled professionals for your projects</p>
                <button
                  onClick={() => navigate("/register?type=Client")}
                  className="action-button"
                >
                  Hire Talent
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
