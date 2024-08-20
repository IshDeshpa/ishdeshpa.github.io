import React, {useEffect} from 'react';
import { Container } from 'react-bootstrap';
import Markdown from 'react-markdown';

import './jumbotron.scss';

const MyJumbotron: React.FC = () => {
    const [description, setDescription] = React.useState<string>('');

    useEffect(() => {
        import('./description.md').then((module) => {
            fetch(module.default)
                .then((response) => response.text())
                .then((text) => {
                    setDescription(text);
                });
        });
    }, []); 

    return (
        <div className="jumbotron-fluid text-light">
            <Container fluid>
                <div className="row">
                    <div className="description col-md-8">
                        <h1>Hi!</h1>
                        <Markdown>{description}</Markdown>
                    </div>
                    <div className="col-md-4 pe-0">
                        <div className="image-container">
                            <img src="headshot.jpg" alt="Large Image" className="img-fluid" />
                            <div className="image-overlay"></div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default MyJumbotron;