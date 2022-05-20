import faker from '@faker-js/faker'
import { useEffect, useState } from 'react'
import Story from './Story'
import { useSession, signIn, signOut } from "next-auth/react";

function Stories() {
  const [storyData, setStoryData] = useState([])
  const {data: session} = useSession();

  useEffect(() => {
    // Get an array of face use data and implicit return
    const suggestions = [...Array(30)].map((_, i) => ({
      ...faker.helpers.contextualCard(),
      id: i,
    }))

    // console.log(suggestions);
    setStoryData(suggestions)
  }, [])

  return (
    <div className="flex space-x-2 p-6 bg-white mt-8 border-gray-200 border rounded-sm overflow-x-scroll scrollbar-thin scrollbar-thumb-black">
    {session && (
      <Story
        key={session?.user?.uid}
        img={session?.user?.image}
        username={session?.user?.name}
      />

    )}
    {storyData.map((profile) => (
        <Story
          key={profile.id}
          img={profile.avatar}
          username={profile.username}
        />
      ))}
    </div>
  )
}

export default Stories
// Checking git commit after towo setop account