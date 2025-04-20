import React, { useState, useEffect } from "react";
import Filters from "../components/jobs/Filters";
import JobList from "../components/jobs/JobList";
import { useAuth } from "../context/AuthContext";
import "../styles/Jobs.css";

const ActiveJobs = () => {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    keyword: "",
    level: "",
    connects: null,
    sortBy: "",
  });

  useEffect(() => {
    const fetchActiveJobs = async () => {
      if (!currentUser || currentUser.accType !== "Client") return;

      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:4000/api/v1/jobs/client/${currentUser.userID}?status=Active`
        );
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch active jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveJobs();
  }, [currentUser]);

  return (
    <div className="jobs-page">
      <div className="jobs-sidebar">
        <Filters onFilterChange={setFilters} />
      </div>

      <div className="jobs-main">
        {loading ? (
          <div className="loading">Loading active jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="no-jobs">No active jobs found</div>
        ) : (
          <JobList jobs={jobs} filters={filters} showActions />
        )}
      </div>
    </div>
  );
};

export default ActiveJobs;
