import React, { useState } from 'react';
import '../styles/PostJob.css';
import JobTitleInput from '../components/postJob/JobTitleInput';
import JobDescriptionInput from '../components/postJob/JobDescriptionInput';
import SkillTags from '../components/postJob/RequiredSkillsInput';
import EstimatedTimeInput from '../components/postJob/EstimatedTimeInput';
import JobLevelSelect from '../components/postJob/JobLevelSelect';
import ConnectsInput from '../components/postJob/ConnectsRequiredInput';

const PostJob = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetSkills, setTargetSkills] = useState([]);
  const [estTime, setEstTime] = useState('1 week');
  const [jobLevel, setJobLevel] = useState('Beginner');
  const [connectsRequired, setConnectsRequired] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const jobData = {
      title,
      description,
      targetSkills,
      estTime,
      jobLevel,
      connectsRequired,
    };

    console.log('Job Data:', jobData);
    // Here you can add the API call to submit jobData to the backend.
  };

  return (
    <div className="post-job-container">
      <h1>Post a Job</h1>
      <form onSubmit={handleSubmit} className="post-job-form">
        <JobTitleInput title={title} setTitle={setTitle} />
        <JobDescriptionInput description={description} setDescription={setDescription} />
        <SkillTags targetSkills={targetSkills} setTargetSkills={setTargetSkills} />
        <EstimatedTimeInput estTime={estTime} setEstTime={setEstTime} />
        <JobLevelSelect jobLevel={jobLevel} setJobLevel={setJobLevel} />
        <ConnectsInput connectsRequired={connectsRequired} setConnectsRequired={setConnectsRequired} />
        <button type="submit" className="submit-btn">Post Job</button>
      </form>
    </div>
  );
};

export default PostJob;
