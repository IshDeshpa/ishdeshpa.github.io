import React from 'react';
import './resume.scss';

const Resume: React.FC = () => {
    const pdfUrl = 'https://drive.google.com/file/d/1GO9DJRv1zcMjv3dfe3b3qd6xgxOcvANK/preview';

    return (
        <div className="m-2 p-2 resume" id="Resume">
            <h1 className="fw-bold text-decoration-underline">Resume</h1>
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <iframe src={pdfUrl} style={{ width: '100%', height: '100%' }} title="Resume PDF" />
                </div>
            </div>
        </div>
    );
};

export default Resume;