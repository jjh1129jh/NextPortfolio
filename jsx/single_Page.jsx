"use client"

export default function SinglePage({ pageIdx }) {
  return (
    <>
        {   pageIdx === 1 && (      <PageNum1 />    ) }
        {   pageIdx === 4 && (      <PageNum4 pageIdx={pageIdx} />    ) }
        {   pageIdx === 5 && (      <PageNum5 pageIdx={pageIdx} />    ) }
    </>
  );
}

export function PageNum1() { // 1페이지 - 배너페이지
    return(
        <div className={`w-full h-full flex flex-col items-center justify-center text-center px-6`}>
            <div className="animate-fadeIn">
              <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-none">Hello, I’m <br className="md:hidden"/><span className="text-[#ff4d5a]">JIHWAN JEONG</span> .</h2>
              <p className="mt-4 opacity-40 tracking-widest uppercase text-[18px] md:text-2xl">I’m a publisher<br className="md:hidden"/>& Front-end Engineer.</p>
            </div>
        </div>
    )
}

export function PageNum4({pageIdx}) { // 4페이지 - 간단한 자기소개 + 기술 스택
    return(
        <div className={`w-full h-full flex flex-col items-center justify-center text-center px-6`}>
            <div className="animate-fadeIn">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">SECTION {pageIdx}</h2>
              <p className="mt-4 opacity-40 font-mono tracking-widest uppercase text-xs">Scroll Down</p>
            </div>
        </div>
    )
}

export function PageNum5({pageIdx}) { // 5페이지 - 인적사항 + Footer
    return (
        <div className={`w-full h-full flex flex-col items-center flex-1 text-center`}>
            <div className="animate-fadeIn flex-1 px-6">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">SECTION {pageIdx}</h2>
              <p className="mt-4 opacity-40 font-mono tracking-widest uppercase text-xs">Scroll Down</p>
            </div>
            <footer className="w-full h-45 md:h-34 flex flex-col">
                <div className="w-full h-full md:h-[60%] flex flex-col md:flex-row md:gap-2 pb-5 md:pb-3 md:pr-3 items-center md:items-end justify-center bg-gray-800 md:bg-[#1d1d1d] relative">
                    <img className="w-8 mt-3 mb-2 md:mt-0" src="/img/logo.png" alt="logo" />
                    <div className="text-center md:text-left">
                        <h3 className="opacity-80 text-[16px] md:text-[21px] md:leading-[1.1]">JH PORTFOLIO</h3>
                        <p className="opacity-80 text-[14px]">From. JIHWAN JEONG</p>
                    </div>
                </div>
                <div className="w-full h-[40%] bg-gray-900 md:bg-[#1d1d1d] md:flex md:items-center md:justify-center">
                    <div className="w-full h-full flex items-center md:items-start justify-end md:justify-center gap-3 md:gap-5 pr-3 md:pr-0">
                        <div className="flex items-center">
                            <img className="w-5" src="/img/svg_html.svg" alt="html" />
                            <span className="hidden">Html</span>
                        </div>
                        <div className="flex items-center">
                            <img className="w-5" src="/img/svg_css.svg" alt="Css" />
                            <span className="hidden">Css</span>
                        </div>
                        <div className="flex items-center">
                            <img className="w-5" src="/img/svg_tailwind.svg" alt="Tailwind" />
                            <span className="hidden">Tailwind</span>
                        </div>
                        <div className="flex items-center">
                            <img className="w-5" src="/img/svg_js.svg" alt="Js" />
                            <span className="hidden">Js</span>
                        </div>
                        <div className="flex items-center">
                            <img className="w-5" src="/img/svg_react.svg" alt="React" />
                            <span className="hidden">React</span>
                        </div>
                        <div className="flex items-center">
                            <img className="w-5 invert-90" src="/img/svg_next.svg" alt="Next" />
                            <span className="hidden">Next.js</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}