import Post from './Post'
import React, { useState, useEffect } from "react"
import { db, storage } from "../firebase"
import { query, collection, orderBy, onSnapshot, } from "firebase/firestore"

// const posts = [
//   {
//     id: '123',
//     username: 'Offensive Hollywood',
//     userImg:
//       'https://images.pexels.com/photos/2416871/pexels-photo-2416871.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
//     img: 'https://images.pexels.com/photos/2416871/pexels-photo-2416871.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
//     caption: 'Smash that like button',
//   },
//   {
//     id: '123',
//     username: 'Offensive Hollywood',
//     userImg:
//       'https://images.pexels.com/photos/2416871/pexels-photo-2416871.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
//     img: 'https://images.pexels.com/photos/2416871/pexels-photo-2416871.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
//     caption: 'Smash that like button Smash that like button Smash that like button Smash that like button Smash that like button',
//   },

// ]

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() =>

    onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), snapshot => {
      setPosts(snapshot.docs);
    }),
    [db])
    
    // console.log(posts);
    


  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          username={post.data().username}
          userImg={post.data().profileImg}
          img={post.data().image}
          caption={post.data().caption}
        />
      ))}
      {/* Post */}
    </div>
  )
}

export default Posts
