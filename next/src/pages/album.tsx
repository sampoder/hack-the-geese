import Navbar from "@/components/Navbar";
import React, { useState } from "react";
import useSWR from "swr";
import useLocalStorageState from "use-local-storage-state";
import Image from "next/image";

const AlbumPage = () => {
  const [tabs, setTabs] = useState([
    { name: "My Album", current: true },
    { name: "Global Album", current: false },
  ]);

  const currentTab = tabs.findIndex((t) => t.current);
  const [user] = useLocalStorageState<string>("user");

  const { data, error, isLoading } = useSWR(
    currentTab === 0 && user ? `/api/album/${user}` : "/api/album",
    (...args: Parameters<typeof fetch>) => fetch(...args).then((res) => res.json())
  );

  return (
    <>
      <Navbar />
      <div className="px-4 py-6 flex justify-center">
        <nav className="flex border-white/10 py-4 justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 backdrop-blur-2xl dark:border-neutral-800 dark:from-inherit w-fit rounded-xl border bg-gray-200 p-4 dark:bg-zinc-800/30">
          <ul
            role="list"
            className="flex gap-x-6 px-2 text-sm font-semibold leading-6 text-gray-400"
          >
            {tabs.map((tab) => (
              <li
                key={tab.name}
                className={(tab.current ? "text-indigo-400" : "") + " cursor-pointer"}
                onClick={() => setTabs(tabs.map((t) => ({ ...t, current: t.name === tab.name })))}
              >
                {tab.name}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {currentTab === 0 ? (
        <div className="p-6">
          {error && <div>failed to load</div>}
          {isLoading && <div>loading...</div>}
          {data && data.length === 0 && (
            <div className="text-center">
              No Photos. <br />
              Head over to the homepage to compete with your friends and create memories!
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
            {data &&
              data.map((album: any, i: number) => (
                <Image key={i} src={album.winningPhoto} alt="photo" width={300} height={300} />
              ))}
          </div>
        </div>
      ) : (
        <div className="p-6">
          {error && <div>failed to load</div>}
          {isLoading && <div>loading...</div>}
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center">
            {data &&
              data.map((album: any, i: number) => (
                <Image key={i} src={album.winningPhoto} alt="photo" width={300} height={300} />
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumPage;
