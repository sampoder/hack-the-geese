import { QrScanner } from "@yudiel/react-qr-scanner";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useLocalStorageState from "use-local-storage-state";

const inter = Inter({ subsets: ["latin"] });

export type User = { code: string; colors: string[] | null };

export default function Home() {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [oppCode, setOppCode] = useState<string | null>(null);
  const [user, setUser] = useLocalStorageState<User | null>("user", { defaultValue: null });
  const router = useRouter();
 
  const [ws, setWS] = useState(null);
  
  function handleOnMessage(msg){
    try {
      const message = JSON.parse(msg.data)
      if(message.action == "new_player_connected"){
        if(message.origin == scannedCode){
          setUser({ code, image: null });
          router.push(`/geese`);
        }
      }
      else if (message.action == "player_connected") {
          if(message.origin == scannedCode){
            setUser({ code: message.origin, colors: message.colors });
          }
      }
    }
    catch(e){
      console.log(msg)
      console.error(e)
    }
  }
  
  useEffect(() => {
      const newWS = new WebSocket("ws://localhost:8000/handler")
      newWS.onerror = err => console.error(err);
      newWS.onopen = () => setWS(newWS);
      newWS.onmessage = msg => handleOnMessage(msg);
      if(user !== null){
        newWS.send(JSON.stringify({"Action": "player_join", "Origin": user}))
      }
      setWS(newWS)
  }, [])
  
  useEffect(() => {
    if(ws){
      let newWS = ws
      newWS.onmessage = msg => handleOnMessage(msg);
      setWS(newWS) 
    }
  }, [scannedCode]);

  useEffect(() => {
    if (!user || !oppCode) return;
    router.push(`/match/${user.code}/${oppCode}`);
  }, [user, oppCode, router]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between py-12 px-6 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
        {user?.code ? (
          <p className="fixed px-6 left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Awesome! Now scan&nbsp;
            <code className="font-mono font-bold">a person&apos;s QR code</code>
          </p>
        ) : (
          <p className="fixed px-6 left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Get started by scanning&nbsp;
            <code className="font-mono font-bold">your QR code</code>
          </p>
        )}
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          By Deet, Fayd, and Sam.
        </div>
      </div>

      <QrScanner
        containerStyle={{ maxWidth: 500, maxHeight: 500, height: 500, padding: 0, margin: 24 }}
        constraints={{
          aspectRatio: { min: 1, max: 1 },
        }}
        onDecode={(result) => {
          const code = result.split("/").slice(-1)[0];

          if (code.split("-").length !== 4) {
            return toast.error("Invalid QR code");
          }

          if (code === user?.code) return;

          // make the user create a profile + select a duck.
          // let them scan for the opponent.
          // if opponent hasn't created a profile, ask them to tell the opponent to create a profile.
          // opponent goes through the same process of creating a profile.
          // once both players have created a profile, they can start the game.
          // they get redirected to /match/[personalCode]/[opponentCode]

          if (user) setOppCode(code);
          else {
            if(!scannedCode){
              ws.send(JSON.stringify({"Action": "player_join", "Origin": code}))
              setScannedCode(code)
            }
          }
        }}
        onError={(error) => console.log(error.message)}
      />

      {user && (
        <p className="w-full my-2 text-center font-mono text-sm">
          Your code:
          <code className="w-full my-2 text-center text-sm block">{user.code}</code>
        </p>
      )}

      {oppCode && (
        <p className="w-full my-2 text-center font-mono text-sm">
          Scanned code:
          <code className="w-full my-2 text-center text-sm block">{oppCode}</code>
        </p>
      )}

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left"></div>
    </main>
  );
}
