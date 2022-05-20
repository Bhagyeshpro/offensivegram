import { getProviders, signIn as SignIntoProvider } from "next-auth/react"
import Image from 'next/image'
import Header from "../../components/Header";

const signIn = ({ providers }) => {
  return (
    <>
      <Header />
      <div className="bg-red-100 flex w-800 flex-col px-14 items-center justify-center min-h-screen py-2">

            <p
              className="font-medium italic"
            >This is Offensivegrm for Offensive People</p>
          <div className="w-50 mt-20 mx-100">
            {Object.values(providers).map((provider) => (
              <div key={provider.name} >
                <button
                  className="p-3 bg-blue-500 rounded-lg text-white"
                  onClick={() => SignIntoProvider(provider.id, {callbackUrl: "/"})}>
                  Sign in with {provider.name}
                </button>
              </div>
            ))}
          </div>
        </div>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers
    }
  }
}

export default signIn;

// import React from 'react'

// function signin() {
//   return (
//     <div>signin</div>
//   )
// }

// export default signin