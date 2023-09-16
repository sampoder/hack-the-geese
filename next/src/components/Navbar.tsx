import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky flex items-center justify-around top-0 z-50 bg-opacity-20 dark:bg-opacity-20 border-b bg-black border-white/10 backdrop-blur-md backdrop-saturate-200 h-16">
      <nav className="flex flex-col w-[90%] my-0 mx-auto p-2 text-center max-w-[1440px]">
        <div className="flex justify-between">
          <div className="hidden sm:flex flex-row items-center flex-none flex-nowrap font-medium text-xl mb-1 min-w-[60px] gap-2">
            <span className="ml-1 text-white">Hack The Geese</span>
          </div>

          <div className="flex items-center justify-evenly flex-1">
            <Link
              className="text-sm text-[#ccc] hover:text-[#ecf0f1] transition duration-300"
              href="/"
            >
              Play
            </Link>
            <Link
              className="text-sm text-[#ccc] hover:text-[#ecf0f1] transition duration-300"
              href="/album"
            >
              Album
            </Link>
            <Link
              className="text-sm text-[#ccc] hover:text-[#ecf0f1] transition duration-300"
              href="/leaderboard"
            >
              Leaderboard
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
