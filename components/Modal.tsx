import Image from 'next/image';
import React, { Fragment, useRef, useState } from 'react'
import { useRecoilState } from 'recoil';
import { modalState } from "../atoms/modalAtoms"
import { Dialog, Transition } from '@headlessui/react'
import { CameraIcon } from "@heroicons/react/outline"
import { db, storage } from "../firebase"
import { addDoc, updateDoc, doc, collection, serverTimestamp } from "@firebase/firestore"
import { useSession } from "next-auth/react"
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

function Modal() {
  const {data: session} = useSession();

  const [open, setOpen] = useRecoilState(modalState)
  const [selectedPic, setSelectedPic] = useState(null);
  const [loading, setLoading] = useState(false)
   
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);


  const uploadPost = async (e) => {
    if(loading)  return;

    setLoading(true);

    // 1. create the post and add to the firebase storage
    // 2. get the post id for the newly created post
    // 3. upload the post img to firebase storage with the post id
    // 4. get the downlaod URL from the firebase and update the original post img url
    
    
    const docRef = await addDoc(collection(db, "posts"), {
      username : session?.user?.username,
      caption : captionRef.current.value,
      profileImg : session?.user?.image,
      timestamp : serverTimestamp()
    })

    console.log("New Doc Added with id ", docRef.id);

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    await uploadString(imageRef, selectedPic, "data_url").then(async snapshot => {
      const downloadURL = await getDownloadURL(imageRef);

      await updateDoc(doc(db, 'posts', docRef.id), {
        image: downloadURL
      })
    });

    setLoading(false);
    setOpen(false);
    setSelectedPic(null)
  }


  const addImageToPost = (e) => {
    const reader = new FileReader();

    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedPic(readerEvent.target?.result);
    }
  }

  return (
    <Transition.Root show={open} as={Fragment} >
      <Dialog
        as="div"
        className="fixed z-10 overflow-y-auto inset-0"
        // Close on click outside of div
        onClose={setOpen}
        // onClose={() => setSelectedPic(null)}
      >
        <div className='flex items-end justify-center min-h-[-800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 '>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-300 bg-opacity-75 transition-opacity" />

          </Transition.Child>
          <span className='hidden sm:inline-block sm:justify-center mt- sm:align-middle sm:h-screen '>&#8203;</span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden
            shadow-xl transform transition-all sm:mt-100 sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6'>
              <div>
                {selectedPic ? (
                  <div className="h-full items-center justify-center ">

                    <img src={selectedPic}
                      onClick={() => setSelectedPic(null)}
                      className="w-full h-50 cursor-pointer object-contain"
                      alt="" />
                  </div>
                ) : (
                  <div
                    onClick={() => filePickerRef.current.click()}
                    className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer "  >
                    <CameraIcon
                      className='h-6 w-6 text-red-600'
                      aria-aria-hidden="true"
                    />
                  </div>

                )}

                <div>
                  <div className='mt-3 text-center sm:mt-5' >
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900 "
                    >
                      Upload A Photo
                    </Dialog.Title>

                    <div>
                      <input type="file"
                        onChange={addImageToPost}
                        ref={filePickerRef}
                        hidden
                      />
                    </div>

                    <div className="mt-2">
                      <input type="text" className="border-none focus:ring-0 w-full text-center "
                        placeholder='Please enter a caption...  '
                        ref={captionRef}
                      />
                    </div>

                  </div>
                </div>

                <div className='mt-5 sm:mt-6'>
                  <button
                    type='submit'
                    disabled={!selectedPic}

                    onClick={uploadPost}
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm
                      px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none
                      focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300
                      disabled:cursor-not-allowed hover:disabled:bg-gray-300
                      "

                  >
                    {loading ? "Uploading..." : "Upload Post"}
                  </button>

                </div>
              </div>


            </div>

          </Transition.Child>

        </div>

      </Dialog >
    </Transition.Root >
  )
}

export default Modal