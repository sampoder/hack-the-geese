import { upload } from "@vercel/blob/client";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { Camera } from "react-camera-pro";

const inter = Inter({ subsets: ["latin"] });

export default function GameScreen() {
  const router = useRouter();
  const camera = useRef<any>(null);
  const [image, setImage] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  const uploadImage = async (image: string) => {
    const base64Response = await fetch(image);
    const blob = await base64Response.blob();

    // const uploaded = await upload(`prompt-${router.query.person}.png`, blob, {
    //   access: "public",
    //   handleUploadUrl: "/api/upload",
    // });

    setUploaded(true);
  };

  if (uploaded) {
    return (
      <main
        className={`flex min-h-screen flex-col items-center gap-10 py-12 px-6 ${inter.className}`}
      >
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
          Hack the Geese
          <div className="fixed bottom-0 left-0 flex w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            By Deet, Fayd, and Sam.
          </div>
        </div>

        <div className="flex items-center justify-evenly w-full">
          <p className="flex-1 my-2 text-center font-mono text-sm">
            You: <code>{router.query.person}</code>
          </p>

          <p className="flex-1 my-2 text-center font-mono text-sm">
            Opponent: <code>{router.query.opponent}</code>
          </p>
        </div>

        <h1 className="text-4xl font-bold text-center">Sweet! You win this round!</h1>
        <div className="flex items-center justify-center gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.reload()}
          >
            Rematch
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => router.push("/")}
          >
            Play again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center gap-10 py-12 px-6 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        Hack the Geese
        <div className="fixed bottom-0 left-0 flex w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          By Deet, Fayd, and Sam.
        </div>
      </div>

      <div className="flex items-center justify-evenly w-full">
        <p className="flex-1 my-2 text-center font-mono text-sm">
          You: <code>{router.query.person}</code>
        </p>

        <p className="flex-1 my-2 text-center font-mono text-sm">
          Opponent: <code>{router.query.opponent}</code>
        </p>
      </div>

      <div className="flex items-center justify-evenly w-full">
        <p className="flex justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:from-inherit w-auto rounded-xl border bg-gray-200 p-4 dark:bg-zinc-800/30">
          This is the prompt: Do this do that
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setImage(camera.current?.takePhoto())}
        >
          Take photo
        </button>
      </div>

      {image ? (
        <>
          <Image width={500} height={500} src={image || ""} alt="Taken photo" />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => uploadImage(image)}
          >
            Submit
          </button>
        </>
      ) : (
        <Camera
          facingMode="user"
          errorMessages={{
            noCameraAccessible:
              "No camera device accessible. Please connect your camera or try a different browser.",
            permissionDenied:
              "Camera permission denied. Please refresh and grant access to the camera.",
            switchCamera: "Please grant access to the camera and switch to front camera.",
            canvas: "Canvas is not supported.",
          }}
          aspectRatio={1 / 1}
          ref={camera}
        />
      )}
    </main>
  );
}
