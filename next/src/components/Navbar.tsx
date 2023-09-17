import Link from "next/link";
import { useEffect } from "react"

const randomHexColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const changeColorOfGroups = (groupIds: any) => {
  let hexes: string[] = []
  groupIds.forEach((id:any) => {
    const element = document.getElementById(id);
    if (element) {
      element.childNodes.forEach((child) => {
        if (child instanceof Element) {
          if (id === 'white') {
            child.setAttribute('fill', '#FFFFFF');
          } else {
            let hex = randomHexColor()
            child.setAttribute('fill', hex);
            hexes.push(hex)
          }
        }
      });
    }
  });
  return hexes
};

const changeBackgroundColor = () => {
  document.body.style.backgroundColor = randomHexColor();
};

const GeeseComponent = ({ws, user}: any) => {
  useEffect(() => {
    fetch('geese.svg')
      .then(response => response.text())
      .then(data => {
        const container = document.getElementById('geese-container');
        if (container) {
          container.innerHTML = data;
          changeColorOfGroups(['fur1', 'fur2', 'shadow', 'white', 'feet', 'svg-background']);
        }
      });
  }, []);
  
  return (
    <>
      <div id="geese-container" style={{ height: '36px', width: '36px', borderRadius: '2px' }}></div>
      <style>
        {`
          svg {
            height: 36px;
          }`
        }
      </style>
    </>
  )
}

const Navbar = () => {
  return (
    <header className="sticky flex items-center justify-around top-0 z-50 bg-opacity-20 dark:bg-opacity-20 border-b bg-black border-white/10 backdrop-blur-md backdrop-saturate-200 h-16">
      <nav className="flex flex-col w-[90%] my-0 mx-auto p-2 text-center max-w-[1440px]">
        <div className="flex justify-between items-center">
          <GeeseComponent />
          <div className="hidden sm:flex flex-row items-center flex-none flex-nowrap font-medium text-xl mb-1 min-w-[60px] gap-2">
            <span className="ml-1 text-white font-bold">Hack The Geese</span>
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
