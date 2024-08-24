import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Image } from 'react-bootstrap';

import './navbar.scss';

const MyNavbar: React.FC = () => {
    const [pages, setPages] = useState<{ [key: string]: any }>({});

    useEffect(() => {
        const loadPages = async () => {
            const modules = import.meta.glob('../pages/*.tsx', { eager: false });
            const loadedPages: { [key: string]: any } = {};

            for (const path in modules) {
                loadedPages[path] = await modules[path]();
            }

            setPages(loadedPages);
        };

        loadPages();
    }, []);

    const [expanded, setExpanded] = useState(false);

    const handleToggle = () => {
        setExpanded(!expanded);
    };

    return (
        <Navbar className="d-flex" expand="lg">
            <Navbar.Brand href="/" className="fs-1 effect-shine fw-bolder col">Ishan Deshpande</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" onClick={handleToggle} />
            <Navbar.Collapse id="navbar-nav" className={expanded ? 'show' : ''}>
                <Nav className="icons col">
                    <Nav.Link href='https://www.linkedin.com/in/ishdeshpa/' target='_blank'>
                        <Image fluid className="icon" src="https://cdn1.iconfinder.com/data/icons/logotypes/32/circle-linkedin-512.png" alt="LinkedIn" roundedCircle/>
                    </Nav.Link>
                    <Nav.Link href='mailto:ishdeshpa@utexas.edu' target='_blank' rel='noopener noreferrer'>
                        <Image fluid className="icon" src="https://cdn4.iconfinder.com/data/icons/social-media-logos-6/512/112-gmail_email_mail-512.png" alt="Email" roundedCircle/>
                    </Nav.Link>
                    <Nav.Link href='https://github.com/IshDeshpa' target='_blank'>
                        <Image fluid className="icon" src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" roundedCircle/>
                    </Nav.Link>
                </Nav>  
                <Nav className="fs-3 col justify-content-end">
                    {Object.keys(pages).map((path) => {
                        const pageName = path.replace('../pages/', '').replace('.tsx', '');
                        return (
                            <Nav.Link className="nav-item effect-shine" key={pageName} href={`#${pageName}`}>
                                {pageName}
                            </Nav.Link>
                        );
                    })}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default MyNavbar;