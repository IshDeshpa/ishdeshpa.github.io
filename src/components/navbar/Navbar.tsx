import React, { useEffect, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';

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

            console.log(loadedPages);
        };

        loadPages();
    }, []);

    return (
        <Navbar className="ps-2 navbar-light">
            <Navbar.Brand href="/" className="fs-1 effect-shine fw-bolder">Ishan Deshpande</Navbar.Brand>
            <Nav className="ms-auto pe-2 fs-5">
                {Object.keys(pages).map((path) => {
                    const pageName = path.replace('../pages/', '').replace('.tsx', '');
                    return (
                        <Nav.Link className="effect-shine" key={pageName} href={`/${pageName}`}>
                            {pageName}
                        </Nav.Link>
                    );
                })}
            </Nav>
        </Navbar>
    );
};

export default MyNavbar;