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

const changeColorOfGroups = (groupIds: any, parentID: any) => {
  let hexes: string[] = []
  groupIds.forEach((id:any) => {
    const element = document.getElementById(parentID ? `${parentID}-${id}` : id);
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

let svg = `

<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 333 432">
  <g id="fur2">
    <rect class="cls-2" x="198" y="360" width="18" height="27"/>
    <polygon class="cls-2" points="18 297 27 297 27 315 9 315 9 306 18 306 18 297"/>
    <path class="cls-2" d="m261,297h9v9h-9v-9Zm-198,45h144v-9H63v9Zm126-81h-9v18H54v-9h-9v18h144v-27Zm45,63h-27v9h36v-18h18v-9h-27v18Zm36-36v9h27v-9h-27Zm-72-45h-9v18h9v-18Zm-126,0h-9v18h-9v9h18v-27Zm135-9h63v-81h-63v-27h18v9h54v-36h-9v-27h-63v27h-9v126h9v9Z"/>
    <rect class="cls-2" x="153" y="360" width="18" height="36"/>
  </g>
  <g id="fur1">
    <polygon class="cls-5" points="180 279 54 279 54 270 72 270 72 243 90 243 90 234 99 234 99 225 126 225 126 216 189 216 189 234 198 234 198 243 189 243 189 261 180 261 180 279"/>
    <polygon class="cls-5" points="297 261 297 288 270 288 270 297 261 297 261 306 234 306 234 324 207 324 207 333 54 333 54 324 27 324 27 288 45 288 45 297 198 297 198 261 207 261 207 243 216 243 216 234 270 234 270 243 279 243 279 261 297 261"/>
  </g>
  <g id="feet">
    <path class="cls-4" d="m261,396v27h-45v-27h45Zm-108,27h54v-27h-54v27Z"/>
  </g>
  <g id="outlineshadow">
    <rect class="cls-1" x="63" y="351" width="144" height="9"/>
    <rect class="cls-1" x="243" y="342" width="18" height="9"/>
    <rect class="cls-1" x="207" y="351" width="54" height="9"/>
    <rect class="cls-1" x="261" y="342" width="9" height="9"/>
    <rect class="cls-1" x="261" y="333" width="9" height="9"/>
  </g>
  <g id="outline">
    <polygon class="cls-3" points="261 99 261 126 243 126 243 108 252 108 252 99 261 99"/>
    <polygon class="cls-3" points="297 306 297 315 288 315 288 333 279 333 279 306 297 306"/>
    <rect class="cls-3" x="270" y="333" width="9" height="18"/>
    <rect class="cls-3" x="54" y="333" width="9" height="27"/>
    <rect class="cls-3" x="27" y="324" width="27" height="9"/>
    <polygon class="cls-3" points="198 261 198 297 45 297 45 288 189 288 189 261 198 261"/>
    <polygon class="cls-3" points="198 99 198 225 207 225 207 234 216 234 216 243 207 243 207 261 198 261 198 234 189 234 189 216 126 216 126 207 189 207 189 90 198 90 198 63 270 63 270 72 207 72 207 99 198 99"/>
    <rect class="cls-3" x="9" y="315" width="18" height="9"/>
    <rect class="cls-3" x="18" y="288" width="9" height="9"/>
    <polygon class="cls-3" points="36 270 45 270 45 288 27 288 27 279 36 279 36 270"/>
    <rect class="cls-3" x="45" y="261" width="9" height="9"/>
    <rect class="cls-3" y="306" width="9" height="9"/>
    <rect class="cls-3" x="9" y="297" width="9" height="9"/>
    <rect class="cls-3" x="54" y="243" width="9" height="18"/>
    <rect class="cls-3" x="63" y="234" width="27" height="9"/>
    <rect class="cls-3" x="90" y="225" width="9" height="9"/>
    <rect class="cls-3" x="99" y="216" width="27" height="9"/>
    <rect class="cls-3" x="270" y="72" width="9" height="27"/>
    <polygon class="cls-3" points="279 153 279 234 288 234 288 252 306 252 306 306 297 306 297 261 279 261 279 243 270 243 270 144 261 144 261 135 279 135 279 99 288 99 288 117 333 117 333 153 279 153"/>
    <path class="cls-3" d="m270,369v-18h-9v9H63v9h81v54h9v-54h18v27h36v27h-54v9h117v-36h-9v27h-45v-27h45v-9h-36v-18h45Zm-81,18h-9v-18h9v18Zm27,0h-18v-18h18v18Z"/>
  </g>
  <g id="white">
    <rect class="cls-6" x="63" y="342" width="180" height="9"/>
    <rect class="cls-6" x="207" y="333" width="54" height="9"/>
    <rect class="cls-6" x="243" y="315" width="36" height="18"/>
    <rect class="cls-6" x="261" y="306" width="18" height="9"/>
    <rect class="cls-6" x="270" y="297" width="27" height="9"/>
    <rect class="cls-6" x="207" y="144" width="63" height="9"/>
    <rect class="cls-6" x="207" y="126" width="18" height="18"/>
    <rect class="cls-6" x="225" y="135" width="36" height="9"/>
    <rect class="cls-6" x="243" y="99" width="9" height="9"/>
  </g>
</svg>
`

export const GeeseComponent = ({id, height}: any) => {
  useEffect(() => {
    const container = document.getElementById(id ? `geese-container-${id}` : `geese-container`);
      if (container) {
        container.innerHTML = svg.replaceAll(`<g id="`, `<g id="${id}-`);
        changeColorOfGroups(['fur1', 'fur2', 'shadow', 'white', 'feet', 'svg-background'], id);
      }
  }, []);
  
  return (
    <>
      <div id={id ? `geese-container-${id}` : `geese-container`} style={{ height: `${height ? height : 36}px`, width: `${height ? height : 36}px`, borderRadius: '2px' }}></div>
      {
        height && <style jsx>
          {`
            svg {
              height: ${height ? height : 36}px;
            }`
          }
        </style>
      }
      
    </>
  )
}

const Navbar = () => {
  return (
    <header className="sticky flex items-center justify-around top-0 z-50 bg-opacity-20 dark:bg-opacity-20 border-b bg-black border-white/10 backdrop-blur-md backdrop-saturate-200 h-16">
      <nav className="flex flex-col w-[90%] my-0 mx-auto p-2 text-center max-w-[1440px]">
        <div className="flex justify-between items-center">
          <GeeseComponent height={24} id="nav" />
          <div className="hidden sm:flex flex-row flex-grow items-center flex-none flex-nowrap font-medium text-xl mb-1 min-w-[60px] gap-2">
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
