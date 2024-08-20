import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

const MyBlog: React.FC = () => {
    const [posts, setPosts] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const loadPosts = async () => {
            const modules = import.meta.glob('./posts/*.md', { eager: false });
            const moduleImports: { [key: string]: any } = {};
            const loadedPosts: { [key: string]: string } = {};

            for (const path in modules) {
                moduleImports[path] = await modules[path]();
                fetch(moduleImports[path].default)
                .then((response) => response.text())
                .then((text) => {
                    loadedPosts[path] = text;
                });
            }

            setPosts(loadedPosts);
        };

        loadPosts();
    }, []);

    return (
        <div className="blog">
            {Object.keys(posts).map((path) => (
                <ReactMarkdown key={path}>{posts[path]}</ReactMarkdown>
            ))}
        </div>
    );
};

export default MyBlog;