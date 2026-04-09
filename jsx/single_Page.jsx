"use client"

import { useEffect, useState } from "react";
import { useMobile } from "./useMobile";
import { iconDataM, iconDataPC } from "./iconData";

export default function SinglePage({ pageIdx, type }) {
    const isMobile = useMobile();
  return (
    <>
        {   pageIdx === 1 && (      <PageNum1 />    ) }
        {   ((pageIdx === 4 && !isMobile) || (pageIdx === 4 && isMobile) || (pageIdx === 5 && isMobile)) && (      <PageNum4 type={type} />    ) }
        {   ((pageIdx === 5 && !isMobile) || (pageIdx === 6 && isMobile)) && (      <PageNum5 pageIdx={pageIdx} />    ) }
    </>
  );
}

export function PageNum1() { // 1페이지 - 배너페이지
    return(
        <div className={`w-full h-full flex flex-col items-center justify-center text-center p-4 md:p-12`}>
            <div className="animate-fadeIn">
              <h2 className="text-4xl md:text-8xl font-black tracking-tighter uppercase leading-[110%] md:leading-[100%]">Hello, I’m <br className="md:hidden"/><span className="text-[#ff4d5a]">JIHWAN JEONG</span> .</h2>
              <p className="mt-4 opacity-70 tracking-widest uppercase text-[18px] md:text-2xl">I’m a publisher<br className="hidden md:inline-block"/> & Front-end Engineer.</p>
            </div>
        </div>
    )
}

export function PageNum4({type}) { // 4페이지 - 간단한 자기소개 + 기술 스택
    return(
        <div className={`w-full h-full p-4 md:p-12 relative`}>
            {
                (type === "All" || type === "HALF1") && <div className="absolute top-[60px] md:top-[100px] left-1/2 -translate-x-1/2 -translate-y-1/2"><h2 className="text-3xl md:text-4xl whitespace-nowrap relative before:content-[''] before:absolute before:block before:w-full before:h-1/3 before:bg-red-500 before:bottom-0 before:right-[-30px] before:-z-10">About</h2></div>
            }
            {
                type === "HALF2" && <div className="absolute top-[60px] md:top-[100px] left-1/2 -translate-x-1/2 -translate-y-1/2"><h2 className="text-3xl md:text-4xl whitespace-nowrap relative before:content-[''] before:absolute before:block before:w-full before:h-1/3 before:bg-red-500 before:bottom-0 before:right-[-30px] before:-z-10">Skill</h2></div>
            }
            
            <div className="w-full md:w-[1500px] h-full mx-auto animate-fadeIn flex flex-col md:flex-row justify-center md:justify-between gap-6 md:gap-0">
                {
                    type === "All" && (<><PageNum4Top/><PageNum4Bottom/></>)
                }
                {
                    type === "HALF1" && (<PageNum4Top/>)
                }
                {
                    type === "HALF2" && (<PageNum4Bottom/>)
                }
            </div>
        </div>
    )
}

export function PageNum4Top() {
    function Br() {
        return(
            <>
                <br className="hidden md:inline-block"/>
                <span className="md:hidden">&nbsp;</span>
            </>
        )
    }
    return (
        <div className="w-full md:w-[50%] flex flex-col items-center justify-center gap-6 md:gap-8">
            <img className="w-40 md:w-80" src="/img/developer.png" alt="개발자 캐릭터" />
            <p className="w-[90%] md:w-fit text-[16px] md:text-[18px] leading-[1.8] break-keep text-center md:text-left">
                안녕하세요! 저는 "개발은 멈추지 않는 평생교육이다." 라는 철학을 바탕으로,<Br/>급변하는 기술 트렌드 속에서도 끊임없이 학습하며 나아가는 개발자입니다.<Br/>탄탄한 웹 퍼블리싱 역량을 통해 디테일이 살아있는 UI를 구현하며,<Br/>이를 프론트엔드 기술과 접목해 사용자 중심의 역동적인 웹 환경을 구축합니다.<Br/>어제보다 더 나은 코드와 기술력으로 완성도 높은 결과물을 만들어내겠습니다.
            </p>
        </div>
    )
}

export function PageNum4Bottom() {
    let currentIndex = 0;
    const isMobile = useMobile();
    const [iconData, setIconData] = useState([])
    const [groupSizes, setGroupSizes] = useState([])

    useEffect (()=>{
        isMobile 
        ?   (
                setIconData([...iconDataM]),
                setGroupSizes([3, 4, 3, 4, 3])
            )
        :   (
                setIconData([...iconDataPC]),
                setGroupSizes([2, 4, 5, 4, 2])
            )
    },[isMobile])

    return(
        <div className="w-full md:w-[50%] flex items-center justify-center">
            <div className="w-[90%] md:w-auto flex flex-col md:flex-row justify-center gap-2 md:gap-5">
                {
                    groupSizes.map((index, i) =>{
                        const group = iconData.slice(currentIndex, currentIndex + index);
                        currentIndex += index;
                        return (
                            <div key={i} className="w-full md:w-30 flex md:flex-col justify-center gap-2 md:gap-5">
                            {group.map((obj, j) => (
                                <div
                                    key={j}
                                    className="w-1/4 md:w-full h-17 md:h-30 flex flex-col items-center justify-center gap-1 md:gap-2 rounded-xl p-[2px] border-1 md:border-2 border-transparent"
                                    style={{
                                        backgroundImage: "linear-gradient(#181818, #181818), radial-gradient(circle at top left, #51a2e9, #ff4d5a)",
                                        backgroundOrigin: "border-box",
                                        backgroundClip: "content-box, border-box",
                                    }}
                                >
                                    <div className="w-full h-1/2 md:h-1/2 flex items-center justify-center">
                                        <img className={`${obj.style} mt-3 md:mt-5`} src={`/img/svg_${obj.file}.svg`} alt={obj.name} />
                                    </div>
                                    <div className="w-full h-1/2 flex items-center justify-center">
                                        <p className="text-[8px] md:text-sm font-light md:font-semibold uppercase tracking-wider text-center flex-col items-center">
                                            {obj.name.split('|').map((index, i) => (
                                              <span key={i} className="leading-[75%]">
                                                {index}
                                                {i !== obj.name.split('|').length - 1 && <br />}
                                              </span>
                                            ))}
                                        </p>
                                    </div>

                                </div>
                            ))}
                        </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export function PageNum5({pageIdx}) { // 5페이지 - 인적사항 + Footer
    const name = ["html", "css", "tailwind", "js", "react", "next"]
    const style = ["", "", "", "", "", "invert-90"]
    const maskBorderStyle = {
      padding: '2px',
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'destination-out',
      maskComposite: 'exclude',
      background: 'radial-gradient(circle at top left, rgba(81, 162, 233, 0.7), rgba(255, 77, 90, 0.7))'
    };
    return (
        <div className={`w-full h-full flex flex-col items-center flex-1 text-center relative`}>
            <div className="absolute top-[60px] md:top-[100px] left-1/2 -translate-x-1/2 -translate-y-1/2"><h2 className="text-3xl md:text-4xl whitespace-nowrap relative before:content-[''] before:absolute before:block before:w-full before:h-1/3 before:bg-red-500 before:bottom-0 before:right-[-30px] before:-z-10">Career</h2></div>
            <div className="w-full flex-1 md:mt-30 animate-fadeIn px-4 pt-33 pb-17 flex content-end md:justify-center">
                <div className="w-full md:w-[90%] grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-4">

                    {/* PROFILE */}
                    <div className="w-full h-full relative p-2 text-white rounded-lg flex flex-col items-center justify-start">
                        <div
                            className="absolute inset-0 rounded-lg"
                            style={maskBorderStyle}
                        />
                        <h4 className="text-3xl relative z-10 font-bold mt-4">PROFILE</h4>
                        <div className="flex-1 flex items-center justify-center">
                            <ul>
                                <li className="text-[12px] py-1 whitespace-nowrap">정지환</li>
                                <li className="text-[12px] py-1 whitespace-nowrap">인천 서구</li>
                                <li className="text-[12px] py-1 whitespace-nowrap">1996.11.29</li>
                                <li className="text-[12px] py-1 whitespace-nowrap">멀티미디어학 졸업</li>
                                <li className="text-[12px] py-1 whitespace-nowrap">TIS정보기술교육센터 수료</li>
                            </ul>
                        </div>
                    </div>

                    {/* LICENSE */}
                    <div className="w-full h-full relative p-2 text-white rounded-lg md:row-start-2 md:col-start-1 flex flex-col items-center justify-start">
                        <div
                            className="absolute inset-0 rounded-lg"
                            style={maskBorderStyle}
                        />
                        <h4 className="text-3xl relative z-10 font-bold mt-4">LICENSE</h4>
                        <div className="flex-1 flex items-center justify-center">
                            <ul>
                                <li className="text-[12px] py-1 whitespace-nowrap">정보처리산업기사</li>
                                <li className="text-[12px] py-1 whitespace-nowrap">웹디자인기능사</li>
                                <li className="text-[12px] py-1 whitespace-nowrap">컴퓨터그래픽스기능사</li>
                                <li className="text-[12px] py-1 whitespace-nowrap">사무자동화산업기사</li>
                            </ul>
                        </div>
                    </div>

                    {/* CAREER */}
                    <div className="w-full h-full relative p-2 text-white rounded-lg col-span-2 md:col-span-2 md:row-span-2 md:col-start-2 md:row-start-1 flex flex-col items-center justify-start">
                        <div
                            className="absolute inset-0 rounded-lg"
                            style={maskBorderStyle}
                        />
                        <h4 className="text-3xl relative z-10 font-bold mt-4">CAREER</h4>
                        <div className="flex-1 flex items-center justify-center">
                            <ul>
                                <li className="text-[12px] py-2 whitespace-nowrap">미림미디어랩<br/>(2022.06 ~ 2023.09)</li>
                                <li className="text-[12px] py-2 whitespace-nowrap">미림미디어랩 ( 외주 )<br/>(2023.10 ~ 2023.12)</li>
                                <li className="text-[12px] py-2 whitespace-nowrap">다락컴퍼니<br/>(2024.02 ~ 2025.04)</li>
                                <li className="text-[12px] py-2 whitespace-nowrap">비즈엠디지 ( 외주 )<br/>(2025.06 ~ 2025.10)</li>
                                <li className="text-[12px] py-2 whitespace-nowrap">리얼스터디 ( 3개월 계약직 + α )<br/>(2025.10 ~ 2026.02)</li>
                            </ul>
                        </div>
                    </div>

                </div>

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