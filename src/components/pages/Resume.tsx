import React from 'react';
import './resume.scss'

const Resume: React.FC = () => {
    return (
        <div className="m-2 p-2 resume" id="Resume">
            <h1 className="fw-bold text-decoration-underline">Resume</h1>
            <embed src='resume.pdf' width="100%" height="800px" type="application/pdf" />
        </div>
    );
};

export default Resume;