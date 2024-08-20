import React, { useEffect, useState } from 'react';
import Post from '../post/Post';

const MyBlog: React.FC = () => {
    const posts = Object.values(import.meta.glob("./posts/**/*.md", {eager: true, query: "?raw"}));

    return (
        <div className="ps-2">
            {posts.map((post, index) => (
                <Post md={post.default as string} key={index}></Post>
            ))}
        </div>
    );
};

export default MyBlog;