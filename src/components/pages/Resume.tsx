import React from 'react';
import './resume.scss'

const Resume: React.FC = () => {
    const path = (import.meta.env.DEV)?'./dist/resume.pdf':'resume.pdf';

    return (
        <div className="m-2 p-2 resume" id="Resume">
            <h1 className="fw-bold text-decoration-underline">Resume</h1>
            <embed src={path} width="100%" height="800px" type="application/pdf" />
        </div>
    );
};

export default Resume;