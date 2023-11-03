import { useEffect } from 'react';
import { useState } from 'react';

const API_URL = 'https://posts-demo-server.yy1123.repl.co/posts';

export default function App() {
  const [posts, setPosts] = useState([]); //store existing posts

  const fetchPosts = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => console.error(err));
  }
  //const fetchPosts = async () =>{
  //const response = await fetch(API_URL);
  //const data = await response.json();
  //setPosts(data);}
  useEffect(() => {
    fetchPosts();
  }, []);

  //create a new post
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  //stringify > transfrom json object to plain string
  // .json() > transform plain string to json object
  const createPost = (e) => {
    e.preventDefault();
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,//title: title,
        content: content, //content
        author: author //author
      })
    })
      .then(res => res.json())
      .then(fetchPosts) //fetch all posts again after creating a post 
      .catch(err => console.error(err));

    setTitle('');
    setContent('');
    setAuthor('');
  };
  //DeletePost
  const deletePost = (postId) => {
    fetch(`${API_URL}/${postId}`, {
      method: 'DELETE',
    })
      .then(fetchPosts)
      .catch(err => console.error(err));
  };
  //UpdatePost 
  const updatePost = (postId) => {
    const newAuthor = prompt('Enter new author for the post:');
    const newTitle = prompt('Enter new title for the post:');
    const newContent = prompt('Enter new content for the post:');
    
    if (newTitle !== null && newAuthor !== null && newContent !== null) {
      fetch(`${API_URL}/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          author: newAuthor,
        })
      })
        .then(fetchPosts)
        .catch(err => console.error(err))
    }
  };

  return (
    <div>
      <form onSubmit={createPost}>
        <input type="text" placeholder='Author' value={author} onChange={e => setAuthor(e.target.value)} />
        <br />
        <input type="text" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
        <br />
        <textarea placeholder='Content' value={content} onChange={e => setContent(e.target.value)} />
        <br />
        <button type='submit'>Create Post</button>
      </form>
      <div>
        {posts.map(post => (
          <div key={post.id}>
            <h2>{post.title}</h2>
            <pre>{post.content}</pre>
            <p>Author: {post.author}</p>
            <button onClick={() => deletePost(post.id)}>Delete Post</button>
            <button onClick={() => updatePost(post.id)}>Update Post</button>
          </div>
        ))}
      </div>
    </div>
  );
}
