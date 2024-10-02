import React from 'react';
import { Container } from 'react-bootstrap';
import Markdown from 'react-markdown';

import './jumbotron.scss';

const MyJumbotron: React.FC = () => {
    // Eager loading this is faster, but you have to use the glob import?
    const description : any = Object.values(import.meta.glob("./description.md", {eager: true, query: "?raw"}))[0];

    return (
        <div className="jumbotron-fluid text-light">
            <Container fluid>
                <div className="row">
                    <div className="description col-md-8">
                        <h1>Hi!</h1>
                        <Markdown>{description.default as string}</Markdown>
                    </div>
                    <div className="col-md-4 pe-0">
                        <div className="image-container">
                            <img src="headshot.jpg" alt="Large Image" className="img-fluid" />
                            <div className="image-overlay"></div>
                        </div>
                    </div>
                    <a href="https://github.com/IshDeshpa/ishdeshpa.github.io" target="_blank" rel="noopener noreferrer" className="text-light text-decoration-none jumbotron-footer">
                        <small>Written in ReactJS and Vite, using GitHub Pages</small>
                    </a>
                </div>
            </Container>
        </div>
    );
};

export default MyJumbotron;