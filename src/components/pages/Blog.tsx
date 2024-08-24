import Post from '../post/Post';

const MyBlog: React.FC = () => {
    const posts = Object.values(import.meta.glob("./posts/**/*.md", {eager: true, query: "?raw"}));

    return (
        <div className="p-2" id="Blog" >
            <h1 className="fw-bold text-decoration-underline">Blog</h1>
            {posts.map((post: any, index) => (
                <Post md={post.default as string} key={index}></Post>
            ))}
        </div>
    );
};

export default MyBlog;