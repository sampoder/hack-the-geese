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
  const [user, setUser] = useState<string>();
  const camera = useRef<any>(null);
  const [image, setImage] = useState(null);
  const [uploaded, setUploaded] = useState(false);

  const router = useRouter();

  const [ws, setWS] = useState<WebSocket>();

  function handleOnMessage(msg: any) {
    try {
      const message = JSON.parse(msg.data);
      console.log(message);
      if (message.action == "new_player_connected") {
        if (message.origin == scannedCode) {
          setUser(scannedCode || "");
          // setGameState("geese")
          setGameState("ready");
        }
      } else if (message.action == "player_connected") {
        if (message.origin == scannedCode) {
          setUser(message.origin);
          setGameState("ready");
        }
      } else if (message.action == "waiting_for_opponent") {
        if (message.target == user) {
          setOpponentCode(message.origin);
          ws!.send(
            JSON.stringify({
              action: "opponent_ready",
              origin: user,
              target: message.origin,
              battle: message.battle,
            })
          );
        }
      } else if (message.action == "opponent_ready") {
        if (message.target == user || message.origin == user) {
          console.log("REMATCH");
          setCurrentBattle(message.battle);
          setCurrentPrompt(message.prompt);
          setImage(null);
          setGameState("playing");
        }
      } else if (message.action == "submission") {
        if (message.battle == currentBattle) {
          if (message.origin == user) {
            setGameState("won");
            setUploaded(true);
            setWinningPhoto(message.attachment);
          } else {
            setGameState("lost");
            setWinningPhoto(message.attachment);
          }
        }
      } else if (message.action == "rematch_request") {
        if (message.target == user) {
          setGameState("rematch_requested");
          toast((t) => (
            <span>
              {message.origin} wants a rematch!
              <button onClick={() => toast.dismiss(t.id)}>Nah, gotta go</button>
              <button
                onClick={() => {
                  ws!.send(
                    JSON.stringify({
                      action: "rematch_consent",
                      origin: user,
                      target: opponentCode,
                    })
                  );
                  toast.dismiss(t.id);
                }}
              >
                Sure, let&apos;s do it
              </button>
            </span>
          ));
        }
      } else if (message.action == "game_ended") {
        setGameState("ready");
        setOpponentCode(null);
      } else if (message.action == "missing_target") {
        toast.error(
          "Opponent hasn't signed up yet. Ask them to scan their QR code from their device."
        );
      }
    } catch (e) {
      console.log(msg);
      console.error(e);
    }
  }

  const uploadImage = async (image: string) => {
    const base64Response = await fetch(image);
    const blob = await base64Response.blob();

    const uploaded = await toast.promise(
      upload(`prompt-${Math.random()}.png`, blob, {
        access: "public",
        handleUploadUrl: "/api/upload",
      }),
      { loading: "Uploading...", success: "Uploaded!", error: "Upload failed" }
    );

    ws!.send(
      JSON.stringify({
        action: "submission",
        origin: user,
        battle: currentBattle,
        attachment: uploaded.url,
      })
    );
  };

  useEffect(() => {
      const newWS = new WebSocket("wss://shy-frost-9467.fly.dev:443/handler")
      newWS.onerror = err => console.error(err);
      newWS.onopen = () => {
        setWS(newWS);
      }
      newWS.onmessage = msg => handleOnMessage(msg);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    if (ws) {
      let newWS = ws;
      newWS.onmessage = (msg) => handleOnMessage(msg);
      setWS(newWS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scannedCode, currentBattle, currentPrompt, opponentCode, user]);

  useEffect(() => {
    if (ws && scannedCode) {
      ws.send(JSON.stringify({ action: "player_join", origin: scannedCode }));
    }
  }, [scannedCode, ws]);

  useEffect(() => {
    if (ws && opponentCode) {
      ws.send(JSON.stringify({ action: "new_battle", origin: user, target: opponentCode }));
    }
  }, [opponentCode, user, ws]);

  switch (gameState) {
    case "authentication":
      return (
        <main
          className={`flex min-h-screen flex-col items-center justify-between py-12 px-6 ${inter.className}`}
        >
          <div className="flex justify-center z-10 max-w-5xl w-full items-center lg:justify-between font-mono text-sm">
            <p className="flex justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:from-inherit w-auto rounded-xl border bg-gray-200 p-4 dark:bg-zinc-800/30">
              Get started by scanning&nbsp;
              <code className="font-mono font-bold">your QR code</code>
            </p>
            <div className="fixed bottom-0 left-0 flex h-24 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none pb-8 md:pb-0 bold">
              By Deet, Fayd, and Sam.
            </div>
          </div>
          {scannedCode}
          <QrReader
            scanDelay={0}
            constraints={{
              aspectRatio: { exact: 1 },
              facingMode: { ideal: "environment" },
              frameRate: 30,
            }}
            containerStyle={{
              maxWidth: 500,
              maxHeight: 500,
              width: "100vw",
              height: "100vh",
              margin: 24,
            }}
            videoContainerStyle={{
              maxWidth: 500,
              maxHeight: 500,
              width: "100vw",
              height: "100vh",
            }}
            videoStyle={{
              maxWidth: 500,
              width: "100vw",
              maxHeight: 500,
              height: "100vh",
            }}
            ViewFinder={ViewFinder}
            onResult={(result) => {
              if (!result) return;
              const code = result.getText().split("/").slice(-1)[0];
              if (code.split("-").length !== 4) {
                return toast.error("Invalid QR code");
              }
              if (code != scannedCode) {
                setScannedCode(code);
                toast.success("QR code scanned, your code is: " + code, { duration: 5000 });
              }
            }}
          />

          {false && (
            <>
              <button
                onClick={() => {
                  const code = "pair-muskrat-sweater-tube";
                  if (code.split("-").length !== 4) {
                    return toast.error("Invalid QR code");
                  }
                  if (code != scannedCode) {
                    setScannedCode(code);
                  }
                }}
              >
                Sam&apos;s QR Code
              </button>

              <button
                onClick={() => {
                  const code = "countess-polo-reward-claw";
                  if (code.split("-").length !== 4) {
                    return toast.error("Invalid QR code");
                  }
                  // if (code === user) return;
                  ws!.send(JSON.stringify({ action: "player_join", origin: code }));
                  if (code != scannedCode) {
                    setScannedCode(code);
                  }
                }}
              >
                Fayd&apos;s QR Code
              </button>
            </>
          )}

          {user && (
            <p className="w-full my-2 text-center font-mono text-sm">
              Welcome,{" "}
              <code className="w-full my-2 text-center text-sm">
                <i>{user}</i>
              </code>
              .
            </p>
          )}

          <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left"></div>
        </main>
      );
    case "ready":
      return (
        <main
          className={`flex min-h-screen flex-col items-center justify-between py-12 px-6 ${inter.className}`}
        >
          <div className="flex justify-center z-10 max-w-5xl w-full items-center lg:justify-between font-mono text-sm">
            <p className="border-b text-center border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:from-inherit w-auto rounded-xl border bg-gray-200 p-4 dark:bg-zinc-800/30">
              Awesome! Now scan&nbsp;
              <code className="font-mono font-bold">a person&apos;s QR code</code>
            </p>
            <div className="fixed bottom-0 left-0 flex h-24 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none pb-8 md:pb-0 bold">
              By Deet, Fayd, and Sam.
            </div>
          </div>

          <QrReader
            scanDelay={0}
            constraints={{
              aspectRatio: { exact: 1 },
              facingMode: { ideal: "environment" },
              frameRate: 30,
            }}
            containerStyle={{
              maxWidth: 500,
              maxHeight: 500,
              width: "100vw",
              height: "100vh",
              margin: 24,
            }}
            videoContainerStyle={{
              maxWidth: 500,
              maxHeight: 500,
              width: "100vw",
              height: "100vh",
            }}
            videoStyle={{
              maxWidth: 500,
              width: "100vw",
              maxHeight: 500,
              height: "100vh",
            }}
            ViewFinder={ViewFinder}
            onResult={(result) => {
              if (!result) return;
              const code = result.getText().split("/").slice(-1)[0];
              if (code.split("-").length !== 4) {
                return toast.error("Invalid QR code");
              }
              if (code === user) return;
              setOpponentCode(code);
              toast.success("QR code scanned, opponent code is: " + code, { duration: 5000 });
            }}
          />
          {false && (
            <>
              <button
                onClick={() => {
                  const code = "pair-muskrat-sweater-tube";
                  if (code.split("-").length !== 4) {
                    return toast.error("Invalid QR code");
                  }
                  if (code === user) return;
                  setOpponentCode(code);
                }}
              >
                Sam&apos;s QR Code
              </button>

              <button
                onClick={() => {
                  const code = "countess-polo-reward-claw";
                  if (code.split("-").length !== 4) {
                    return toast.error("Invalid QR code");
                  }
                  if (code === user) return;
                  setOpponentCode(code);
                }}
              >
                Fayd&apos;s QR Code
              </button>
            </>
          )}
          {opponentCode ? (
              <p className="w-full my-2 text-center font-mono text-sm">
                We're loading your game with
                <code className="w-full my-2 text-center text-sm">{opponentCode}</code>. 
                Make sure your opponent has the app open.
              </p>
            ) : (
            <p className="w-full my-2 text-center font-mono text-sm">
              Welcome,{" "}
              <code className="w-full my-2 text-center text-sm">
                <i>{user}</i>
              </code>
              .
            </p>
          )}

          <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left"></div>
        </main>
      );
    case "playing":
      return (
        <main
          className={`flex min-h-screen flex-col items-center gap-10 py-12 px-6 ${inter.className}`}
        >
          <h1 className="text-4xl font-bold text-center">Hack the Geese</h1>

          <div className="flex items-center justify-evenly w-full">
            <p className="flex-1 my-2 text-center font-mono text-sm">
              You: <code>{user}</code> {currentBattle}
            </p>

            <p className="flex-1 my-2 text-center font-mono text-sm">
              Opponent: <code>{opponentCode}</code>
            </p>
          </div>

          <div className="flex sm:items-center justify-evenly w-full gap-2 flex-col sm:flex-row items-stretch">
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
    case "won":
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
                ws!.send(
                  JSON.stringify({ action: "rematch_request", origin: user, target: opponentCode })
                );
              }}
            >
              Rematch
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                setGameState("ready");
                setOpponentCode(null);
                ws!.send(
                  JSON.stringify({ action: "game_ended", origin: user, target: opponentCode })
                );
              }}
            >
              Play again
            </button>
          </div>
        </main>
      );
    case "lost":
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
                ws!.send(
                  JSON.stringify({ action: "rematch_request", origin: user, target: opponentCode })
                );
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
      );
  }
}

const ViewFinder = (props: any) => (
  <div
    style={{
      zIndex: 100,
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "50%",
      height: "50%",
      borderRadius: "10px",
      ...props.style,
    }}
  >
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "10%",
        height: "10%",
        borderLeft: "2px solid white",
        borderTop: "2px solid white",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "10%",
        height: "10%",
        borderRight: "2px solid white",
        borderTop: "2px solid white",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "10%",
        height: "10%",
        borderLeft: "2px solid white",
        borderBottom: "2px solid white",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        width: "10%",
        height: "10%",
        borderRight: "2px solid white",
        borderBottom: "2px solid white",
      }}
    />
  </div>
);
