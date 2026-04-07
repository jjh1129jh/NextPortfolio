"use client"

import { useEffect, useState } from "react";
import { useMobile } from "./useMobile";
import { iconDataM, iconDataPC } from "./iconData";

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
        <div className={`w-full h-full flex flex-col items-center justify-center text-center p-4 md:p-12`}>
            <div className="animate-fadeIn">
              <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-none">Hello, I’m <br className="md:hidden"/><span className="text-[#ff4d5a]">JIHWAN JEONG</span> .</h2>
              <p className="mt-4 opacity-70 tracking-widest uppercase text-[18px] md:text-2xl">I’m a publisher<br className="md:hidden"/>& Front-end Engineer.</p>
            </div>
        </div>
    )
}

export function PageNum4() { // 4페이지 - 간단한 자기소개 + 기술 스택
    let currentIndex = 0;
    const isMobile = useMobile();
    const [iconData, setIconData] = useState([])
    const [groupSizes, setGroupSizes] = useState([])

    useEffect (()=>{
        isMobile 
        ?   (
                setIconData([...iconDataM]),
                setGroupSizes([4, 4, 4, 4])
            )
        :   (
                setIconData([...iconDataPC]),
                setGroupSizes([2, 4, 4, 4, 2])
            )
    },[isMobile])
    
    return(
        <div className={`w-full h-full p-4 md:p-12`}>
            <div className="w-full md:w-[1400px] h-full mx-auto animate-fadeIn flex flex-col md:flex-row justify-center md:justify-between gap-6 md:gap-0">
                <div className="w-full md:w-[40%] flex flex-col items-center justify-center gap-6 md:gap-8">
                    <img className="w-40 md:w-80" src="/img/developer.png" alt="개발자 캐릭터" />
                    <p className="w-[80%]">내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.내용을 채워주세요.</p>
                </div>
                <div className="w-full md:w-[60%] flex items-center justify-center">
                    <div className="flex justify-center gap-2 md:gap-6">
                        {
                            groupSizes.map((index, i) =>{
                                const group = iconData.slice(currentIndex, currentIndex + index);
                                currentIndex += index;
                                return (
                                    <div key={i} className="w-[20%] md:w-32 flex flex-col items-center justify-center gap-2 md:gap-6">
                                    {group.map((obj, j) => (
                                        <div
                                            key={j}
                                            className="w-full flex flex-col items-center justify-center gap-1 md:gap-2 rounded-xl p-[2px] border-1 md:border-2 border-transparent"
                                            style={{
                                                backgroundImage: "linear-gradient(#181818, #181818), radial-gradient(circle at top left, #51a2e9, #ff4d5a)",
                                                backgroundOrigin: "border-box",
                                                backgroundClip: "content-box, border-box",
                                            }}
                                        >
                                            <div className="h-1/2 aspect-[2/1] md:aspect-[3/2] flex items-center justify-center">
                                                <img className={obj.style} src={`/img/svg_${obj.file}.svg`} alt={obj.name} />
                                            </div>
                                            
                                            <p className="text-[8.5px] md:text-sm font-light md:font-semibold uppercase tracking-wider">{obj.name}</p>
                                        </div>
                                    ))}
                                </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export function PageNum5({pageIdx}) { // 5페이지 - 인적사항 + Footer
    const name = ["html", "css", "tailwind", "js", "react", "next"]
    const style = ["", "", "", "", "", "invert-90"]
    return (
        <div className={`w-full h-full flex flex-col items-center flex-1 text-center`}>
            <div className="w-full animate-fadeIn flex-1 p-4 md:p-12">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">SECTION {pageIdx}</h2>
              <p className="mt-4 opacity-40 font-mono tracking-widest uppercase text-xs">Scroll Down</p>
            </div>
            <footer className="w-full h-32 md:h-34 flex flex-col">
                <div className="w-full h-1/2 md:h-[60%] flex gap-1 md:gap-2 pt-6 md:pb-3 pr-6 md:pr-3 items-center md:items-end justify-center bg-[#242424] relative">
                    <img className="w-8 mb-2" src="/img/logo.png" alt="logo" />
                    <div className="text-center md:text-left">
                        <h3 className="opacity-80 text-[16px] md:text-[21px] md:leading-[1.1]">JH PORTFOLIO</h3>
                        <p className="opacity-80 text-[11px] md:text-[14px]">From. JIHWAN JEONG</p>
                    </div>
                </div>
                <div className="w-full h-[40%] bg-[#242424] md:flex md:items-center md:justify-center">
                    <div className="w-full h-full flex items-center md:items-start justify-center gap-3 md:gap-5 pr-3 md:pr-0">
                        {
                            name.map((index, i)=>(
                                <div className="flex items-center" key={i}>
                                    <img className={`w-5 ${style[i]}`} src={`/img/svg_${index}.svg`} alt={index} />
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="w-full h-[10%] bg-[#242424] md:hidden"/>
            </footer>
        </div>
    )
}


