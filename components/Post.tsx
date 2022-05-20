import {
  BookmarkIcon,
  ChatIcon,
  DotsHorizontalIcon,
  EmojiHappyIcon,
  HeartIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/outline'
import { useSession } from "next-auth/react"
import { HeartIcon as HeroIconFilled } from '@heroicons/react/solid'
import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Moment from "react-moment"

function Post({ id, img, key, username, userImg, caption }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState();
  const [comments, setComments] = useState([])
  const [likes, setLikes] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);


  useEffect(() => {

    onSnapshot(query(collection(db, "posts", id, "comments"), orderBy("timestamp", "desc")), snapshot => {
      setComments(snapshot.docs);
    })
  }, [db, id])

  useEffect(() => {

    onSnapshot(query(collection(db, "posts", id, "likes")), snapshot => {
      setLikes(snapshot.docs);
    })

  }, [db, id])

  useEffect(() =>
    setHasLiked(
      likes.findIndex((like) => (like.id === session?.user?.uid)) !== -1
    ),
    [likes])




  const sendComment = async (e) => {

    // Helps page comment without refreshing the page
    e.preventDefault()

    const sendToComment = comment;
    setComment("");

    await addDoc(collection(db, "posts", id, "comments"), {
      comment: sendToComment,
      username: session?.user.username,
      userImage: session?.user?.image,
      timestamp: serverTimestamp(),
    });
  }

  const likeThePost = async (e) => {
    if (hasLiked) {
      await deleteDoc(doc(db, "posts", id, "likes", session?.user.uid))
    } else {
      // doc when you want to store userid as a data and collection when you watn to store data from front end
      await setDoc(doc(db, "posts", id, "likes", session?.user.uid), {
        username: session?.user.username,
      });
    }
  }


  return (
    <div className="border-rounded-sm my-7 bg-white">
      {/* Header */}
      <div className="flex items-center p-3">
        <img
          src={userImg}
          className="mr-3 h-10 w-10 rounded-full border object-contain p-1"
          alt=""
        />
        <p className="flex-1 text-sm font-bold">{username}</p>
        <DotsHorizontalIcon className="h-5" />
      </div>

      {/* Img */}
      <img src={img} className="w-full object-cover" alt="" />

      {/* Buttons */}
      {session && (

        <div className="flex justify-between px-4 pt-4">
          <div className="flex space-x-4">
            {hasLiked ? (
              <HeroIconFilled className="btn text-red-500" onClick={() => likeThePost()} />
            ) : (
              <HeartIcon className="btn" onClick={() => likeThePost()} />
            )}
            <ChatIcon className="btn" />
            <PaperAirplaneIcon className="btn" />
          </div>
          <BookmarkIcon className='btn' />
        </div>
      )}


      {/* Caption */}
      <p className="p-4 truncate">
        {likes.length > 0 && (
          <p className='font-bold mb-1'>{likes.length} likes</p>
        )}
        <span className="font-bold mr-1" >{username}</span> {caption}
      </p>

      {/* Comments */}
      {comments.length > 0 && (
        <div className='ml-4 h-29 max-h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin'>
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-center space-x-2 mb-3">
              <img src={comment.data().userImage} alt="" className="h-7 rounded-full " />
              <p className='text-sm flex-1'>
                <span className='font-bold'>{comment.data().username}
                </span>{" "}
                {comment.data().comment}
              </p>

              <Moment fromNow className='pr-3 text-xs'>
                {comment.data().timestamp?.toDate()}
              </Moment>
            </div>
          ))}
        </div>
      )}

      {/* Input */}
      {session && (
        <form className="flex items-center p-4">
          <EmojiHappyIcon className="btn" />
          <input type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="border-none flex-1 focus:ring-0 outline-none"
          />
          <button
            type='submit'
            // disabled={!comment.trim()}
            onClick={sendComment}
            className="font-semibold text-blue-400">post</button>
        </form>
      )}

    </div>
  )
}

export default Post
