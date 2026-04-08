"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ParticleBackground from "./particle_Bg.jsx";
import SinglePage from "./single_Page.jsx";
import { useMobile } from "./useMobile.jsx";

// 메인
export default function FullPageScroll({ dataobjA, dataobjB }) {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef(null);
  const isMobile = useMobile()
  const [totalArr, setTotalArr] = useState([])

useEffect(() => {
    if (totalArr.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageNum = parseInt(entry.target.id.replace("section-", ""));
            if (!isNaN(pageNum)) setCurrentPage(pageNum);
          }
        });
      },
      { threshold: 0.6 }
    );

    // .snap-section들을 다시 찾아서 관찰
    const sections = document.querySelectorAll(".snap-section");
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, [totalArr]);

  useEffect(()=>{
    !isMobile
    ? setTotalArr([...Array(5)])
    : setTotalArr([...Array(6)])
  },[isMobile])

  return (
    <main className="relative w-full h-dvh overflow-hidden bg-[#181818] text-white font-sans selection:bg-white selection:text-black">

      {/* 상단 페이지 표시 */}
      <div className="fixed top-10 right-10 z-60 mix-blend-difference hidden md:flex flex-col items-end">
        <span className="text-4xl font-black tracking-tighter leading-none">{currentPage.toString().padStart(2, '0')}</span>
        <div className="w-12 h-[2px] bg-white my-2" />
        <span className="text-xs font-mono opacity-50 uppercase tracking-widest">Total 5</span>
      </div>

      {/* 측면 페이지 표시 */}
      <div className="fixed left-[18px] md:left-6 bottom-[18px] md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-60 flex flex-col gap-2 md:gap-4">
        {totalArr.map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${currentPage === i + 1 ? 'bg-white h-6 md:bg-white md:h-8' : 'bg-white/30'}`} />
        ))}
      </div>

      {/* 메인 세로 스크롤 컨테이너 */}
      <div ref={containerRef} className="h-dvh overflow-y-auto snap-y snap-mandatory no-scrollbar scroll-auto">
        {totalArr.map((_, i) => {
          const pageIdx = i + 1;
          const isHorizontal = pageIdx === 2 || pageIdx === 3;

          return (
            <div key={pageIdx}>
              <div className="relative w-full h-full overflow-hidden bg-transparent z-50">
                <ParticleBackground currentPage={currentPage} key={currentPage} />
              </div>
              <section
                id={`section-${pageIdx}`}
                className="snap-section w-full h-dvh snap-start snap-always flex items-center justify-center relative overflow-hidden z-51"
              >
                {isHorizontal && (
                  <HorizontalSlider pageIdx={pageIdx} dataobjA={dataobjA} dataobjB={dataobjB} />
                )}
                {pageIdx === 1 && (
                  <SinglePage pageIdx={pageIdx} />
                )}
                {
                  !isMobile
                  ? (
                      (pageIdx === 4 && !isMobile) && <SinglePage pageIdx={pageIdx} type={"All"} />
                    )
                  : (
                      (pageIdx === 4 && isMobile) && <SinglePage pageIdx={pageIdx} type={"HALF1"} />
                    )
                }
                {
                  isMobile ? (pageIdx === 5 && isMobile) && <SinglePage pageIdx={pageIdx} type={"HALF2"} /> : null
                }
                {((pageIdx === 5 && !isMobile) || (pageIdx === 6 && isMobile)) && (
                  <SinglePage pageIdx={pageIdx} />
                )}
              </section>
            </div>

          );
        })}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .snap-section {
          scroll-snap-align: start;
          scroll-snap-stop: always;
        }

        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </main>
  );
}

// 포트폴리오 파트
export function HorizontalSlider({ dataobjA, dataobjB, pageIdx, bgClass }) {
  const scrollRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialX, setInitialX] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const sliderData = pageIdx === 2 ? dataobjA : dataobjB;

  const getX = (e) => (e.touches ? e.touches[0].pageX : e.pageX);

  const onDragStart = (e) => {
    setIsDrag(true);
    const x = getX(e);
    setStartX(x);
    setInitialX(x);
    setStartTime(Date.now());

    if (scrollRef.current) {
      scrollRef.current.style.scrollSnapType = "none";
      scrollRef.current.style.scrollBehavior = "auto";
    }
  };

  const onDragEnd = (e) => {
    if (!isDrag || !scrollRef.current || !sliderData) return;
    setIsDrag(false);

    const endX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
    const totalDistance = initialX - endX;
    const duration = Date.now() - startTime;
    const velocity = Math.abs(totalDistance / duration);

    const width = scrollRef.current.offsetWidth;
    const currentScroll = scrollRef.current.scrollLeft;
    let targetIndex = Math.round(currentScroll / width);

    const threshold = 5;
    if (Math.abs(totalDistance) > threshold || velocity > 0.2) {
      if (totalDistance > 0) {
        targetIndex = Math.floor(currentScroll / width) + 1;
      } else {
        targetIndex = Math.ceil(currentScroll / width) - 1;
      }
    }

    targetIndex = Math.max(0, Math.min(targetIndex, sliderData.length - 1));

    scrollRef.current.style.scrollSnapType = "x mandatory";
    scrollRef.current.style.scrollBehavior = "smooth";
    scrollRef.current.scrollTo({ left: targetIndex * width, behavior: "smooth" });
  };

  const onDragMove = (e) => {
    if (!isDrag || !scrollRef.current) return;

    const x = getX(e);
    const walk = (startX - x) * 1.5;
    scrollRef.current.scrollLeft += walk;
    setStartX(x);
  };

  const router = useRouter();
  const portFolioLink = (id) => {
    console.log("링크 클릭!");
    router.push(`/portfolio/${id}`);
  };

  return (
    <div
      ref={scrollRef}
      onMouseDown={onDragStart}
      onMouseMove={onDragMove}
      onMouseUp={onDragEnd}
      onMouseLeave={onDragEnd}
      onTouchStart={onDragStart}
      onTouchMove={onDragMove}
      onTouchEnd={onDragEnd}
      className="w-full h-full flex overflow-x-hidden snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing select-none relative"
      style={{ touchAction: 'pan-y' }}
    >
      <div className="absolute top-[100px] left-1/2 -translate-x-1/2 -translate-y-1/2"><h2 className="text-3xl md:text-4xl whitespace-nowrap relative before:content-[''] before:absolute before:block before:w-full before:h-1/3 before:bg-red-500 before:bottom-0 before:right-[-30px] before:-z-10">{pageIdx === 2 ? "Personal Project" : "Commercial Project"}</h2></div>
      {sliderData.map((item, id) => (
        <div key={id} className={`min-w-full h-full snap-center snap-always flex flex-col items-center justify-center border-x border-white/5 ${bgClass} p-4 md:p-12`}>
          <div className="text-center animate-fadeIn pointer-events-none">
            <h2 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter uppercase leading-none">SECTION {pageIdx}</h2>
            <p className="pointer-events-auto cursor-pointer" onClick={() => { portFolioLink(item.id) }}>{item.id}</p>
            <p className="text-xl md:text-2xl font-light opacity-60">{item.content}</p>
            <div className="mt-8 flex gap-2 justify-center">
              {sliderData.map((_, dot) => (
                <div key={dot} className={`w-2 h-2 rounded-full transition-all duration-300 ${dot === id ? 'bg-white w-8' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}