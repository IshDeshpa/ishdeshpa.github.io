import React, { useEffect, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';

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
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Ishan Deshpande</Navbar.Brand>
            <Nav className="ms-auto">
                {Object.keys(pages).map((path) => {
                    const pageName = path.replace('../pages/', '').replace('.tsx', '');
                    return (
                        <Nav.Link key={pageName} href={`/${pageName}`}>
                            {pageName}
                        </Nav.Link>
                    );
                })}
            </Nav>
        </Navbar>
    );
};

export default MyNavbar;