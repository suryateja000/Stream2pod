import React from 'react';
import './LoadingSteps.css';

const StepIcon = ({ status }) => {
  if (status === 'complete') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  if (status === 'in-progress') {
    return <div className="pulsing-dot" />;
  }

  return <div className="pending-dot" />;
};

const LoadingSteps = ({ steps }) => {
  return (
    <div className="loader-card-wrapper">
      <div className="loader-card">
        <h3 className="loader-title">Generating Your Podcast...</h3>
        <div className="steps-list">
          {steps.map((step, index) => (
            <div key={index} className={`step-item ${step.status}`}>
              <div className={`icon-wrapper ${step.status}`}>
                <StepIcon status={step.status} />
              </div>
              <span className="step-name">{step.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSteps;
