import { QrReader } from "react-qr-reader";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import useLocalStorageState from "use-local-storage-state";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { Camera } from "react-camera-pro";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [currentBattle, setCurrentBattle] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [gameState, setGameState] = useState<string | null>("authentication");
  const [winningPhoto, setWinningPhoto] = useState<string | null>(null);
  const [opponentCode, setOpponentCode] = useState<string | null>(null);
  const [user, setUser] = useLocalStorageState<string>("user");
  const camera = useRef<any>(null);
  const [image, setImage] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  
  const router = useRouter();
 
  const [ws, setWS] = useState<WebSocket>();
  
  function handleOnMessage(msg: any) {
    if (!ws) return;

    try {
      const message = JSON.parse(msg.data)
      console.log(message)
      console.log(message.action)
      if(message.action == "new_player_connected"){
        if(message.origin == scannedCode){
          setUser(scannedCode || "");
          // setGameState("geese")
          setGameState("ready")
        }
      }
      else if (message.action == "player_connected") {
          if(message.origin == scannedCode){
            setUser(message.origin);
            setGameState("ready")
          }
      }
      else if (message.action == "waiting_for_opponent") {
          if(message.target == user){
            setOpponentCode(message.origin)
            ws.send(JSON.stringify({"action": "opponent_ready", "origin": user, "target": message.origin, "battle": message.battle}))
          }
      }
      else if (message.action == "opponent_ready") {
          if(message.target == user || message.origin == user){
            console.log("REMATCH")
            setCurrentBattle(message.battle)
            setCurrentPrompt(message.prompt)
            setImage(null)
            setGameState("playing")
          }
      }
      else if (message.action == "submission") {
        console.log("hi!")
        console.log(message.battle)
        console.log(currentBattle)
        if(message.battle == currentBattle){
          console.log("hi!")
          if(message.origin == user){
            setGameState("won")
            setUploaded(true);
            setWinningPhoto(message.attachment)
          }
          else {
            setGameState("lost")
            setWinningPhoto(message.attachment)
          }
        }
      }
      else if (message.action == "rematch_request") {
        if(message.target == user){
          setGameState("rematch_requested")
          if (true) {
            ws.send(JSON.stringify({"action": "rematch_consent", "origin": user, "target": opponentCode}))
          }
        }
      }
      else if (message.action == "game_ended") {
        setGameState("ready")
        setOpponentCode(null)
      }
    }
    catch(e){
      console.log(msg)
      console.error(e)
    }
  }
  
  const uploadImage = async (image: string) => {
    if (!ws) return;

    const base64Response = await fetch(image);
    const blob = await base64Response.blob();
  
    const uploaded = await upload(`prompt-${Math.random()}.png`, blob, {
      access: "public",
      handleUploadUrl: "/api/upload",
    });
  
    ws.send(JSON.stringify({"action": "submission", "origin": user, "battle": currentBattle, "attachment": uploaded.url }))
  };
  
  useEffect(() => {
      const newWS = new WebSocket("ws://2.tcp.ngrok.io:14453/handler")
      newWS.onerror = err => console.error(err);
      newWS.onopen = () => {
        setWS(newWS);
        if(user && !scannedCode){
          newWS.send(JSON.stringify({ action: "player_join", origin: user }));
        } 
      }
      newWS.onmessage = msg => handleOnMessage(msg);
      
  }, [])
  
  useEffect(() => {
    if(ws){
      let newWS = ws
      newWS.onmessage = msg => handleOnMessage(msg);
      setWS(newWS) 
    }
  }, [scannedCode, currentBattle, currentPrompt, opponentCode, user]);

  switch(gameState) {
    case 'authentication':
      return (
        <main
          className={`flex min-h-screen flex-col items-center justify-between py-12 px-6 ${inter.className}`}
        >
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
            <p className="fixed px-6 left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
              Get started by scanning&nbsp;
              <code className="font-mono font-bold">your QR code</code>
            </p>
            <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
              By Deet, Fayd, and Sam.
            </div>
          </div>

          <QrReader
            constraints={{ aspectRatio: { min: 1, max: 1 }, facingMode: { ideal: "environment" } }}
            onResult={(result) => {
              if (!result) return;
              const code = result.getText().split("/").slice(-1)[0];
              if (code.split("-").length !== 4) {
                return toast.error("Invalid QR code");
              }

              ws!.send(JSON.stringify({ Action: "player_join", Origin: code }));
              if (code != scannedCode) {
                setScannedCode(code);
              }
            }}
            containerStyle={{
              maxWidth: 500,
              width: 500,
              maxHeight: 500,
              height: 500,
              padding: 0,
              margin: 24,
            }}
          />

          <button
            onClick={() => {
              if (!ws) return;

              const code = "pair-muskrat-sweater-tube";
              if (code.split("-").length !== 4) {
                return toast.error("Invalid QR code");
              }
              ws.send(JSON.stringify({ action: "player_join", origin: code }));
              if (code != scannedCode) {
                setScannedCode(code);
              }
            }}
          >
            Sam&apos;s QR Code
          </button>

          <button
            onClick={() => {
              if (!ws) return;

              const code = "countess-polo-reward-claw";
              if (code.split("-").length !== 4) {
                return toast.error("Invalid QR code");
              }

              ws.send(JSON.stringify({ action: "player_join", origin: code }));
              if (code != scannedCode) {
                setScannedCode(code);
              }
            }}
          >
            Fayd&apos;s QR Code
          </button>

          {user && (
            <p className="w-full my-2 text-center font-mono text-sm">
              Your code:
              <code className="w-full my-2 text-center text-sm block">{user}</code>
            </p>
          )}

          {opponentCode && (
            <p className="w-full my-2 text-center font-mono text-sm">
              Scanned code:
              <code className="w-full my-2 text-center text-sm block">{opponentCode}</code>
            </p>
          )}

          <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left"></div>
        </main>
      );
    case 'ready':
      return (
        <main
          className={`flex min-h-screen flex-col items-center justify-between py-12 px-6 ${inter.className}`}
        >
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
            <p className="fixed px-6 left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
              Awesome! Now scan&nbsp;
              <code className="font-mono font-bold">a person&apos;s QR code</code>
            </p>
            <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
              By Deet, Fayd, and Sam.
            </div>
          </div>

          <QrReader
            constraints={{ aspectRatio: { min: 1, max: 1 }, facingMode: { ideal: "environment" } }}
            onResult={(result) => {
              if (!result) return;

              const code = result.getText().split("/").slice(-1)[0];
              if (code.split("-").length !== 4) {
                return toast.error("Invalid QR code");
              }

              if (code === user) return;

              setOpponentCode(code);

              ws!.send(JSON.stringify({ Action: "new_battle", Origin: user, Target: code }));
            }}
            containerStyle={{
              maxWidth: 500,
              width: 500,
              maxHeight: 500,
              height: 500,
              padding: 0,
              margin: 24,
            }}
          />

          <button
            onClick={() => {
              if (!ws) return;

              const code = "pair-muskrat-sweater-tube";
              if (code.split("-").length !== 4) {
                return toast.error("Invalid QR code");
              }
              if (code === user) return;
              setOpponentCode(code);
              ws.send(JSON.stringify({ action: "new_battle", origin: user, target: code }));
            }}
          >
            Sam&apos;s QR Code
          </button>

          <button
            onClick={() => {
              if (!ws) return;

              const code = "countess-polo-reward-claw";
              if (code.split("-").length !== 4) {
                return toast.error("Invalid QR code");
              }
              if (code === user) return;
              setOpponentCode(code);
              ws.send(JSON.stringify({ action: "new_battle", origin: user, target: code }));
            }}
          >
            Fayd&apos;s QR Code
          </button>

          {user && (
            <p className="w-full my-2 text-center font-mono text-sm">
              Your code:
              <code className="w-full my-2 text-center text-sm block">{user}</code>
            </p>
          )}

          {opponentCode && (
            <p className="w-full my-2 text-center font-mono text-sm">
              Scanned code:
              <code className="w-full my-2 text-center text-sm block">{opponentCode}</code>
            </p>
          )}

          <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left"></div>
        </main>
      );
    case 'playing':
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
              You: <code>{user}</code> {currentBattle}
            </p>
      
            <p className="flex-1 my-2 text-center font-mono text-sm">
              Opponent: <code>{opponentCode}</code>
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
      )  
    case 'won':
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
              onClick={() => {
                if (!ws) return;

                ws.send(JSON.stringify({"action": "rematch_request", "origin": user, "target": opponentCode}))
              }}
            >
              Rematch
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setGameState("ready")
                setOpponentCode(null)
                ws.send(JSON.stringify({"action": "game_ended", "origin": user, "target": opponentCode}))
              }}
            >
              Play again
            </button>
          </div>
        </main>
      )
      case 'lost':
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
        
          <h1 className="text-4xl font-bold text-center">oh no, you lost</h1>
          <div className="flex items-center justify-center gap-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                if (!ws) return;

                ws.send(JSON.stringify({"action": "rematch_request", "origin": user, "target": opponentCode}))
              }}
            >
              Rematch
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => setGameState("ready")}
            >
              Play again
            </button>
          </div>
        </main>
      )
  }

  
}
