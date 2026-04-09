"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ParticleBackground from "./particle_Bg.jsx";
import SinglePage from "./single_Page.jsx";
import { useMobile } from "./useMobile.jsx";
import { Language } from "./LanguageData.jsx";

// 메인
export default function FullPageScroll({ dataobjA, dataobjB }) {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef(null);
  const isMobile = useMobile();
  const [totalArr, setTotalArr] = useState([]);

  // 가로 슬라이더의 현재 인덱스를 부모에서 관리 (도트 표시용)
  const [currentSlide2, setCurrentSlide2] = useState(0); // 2페이지(Personal)
  const [currentSlide3, setCurrentSlide3] = useState(0); // 3페이지(Commercial)

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
        <span className="text-4xl font-black tracking-tighter leading-none">
          {currentPage.toString().padStart(2, "0")}
        </span>
        <div className="w-12 h-[2px] bg-white my-2" />
        <span className="text-xs font-mono opacity-50 uppercase tracking-widest">
          Total {totalArr.length}
        </span>
      </div>

      {/* 측면 페이지 표시 */}
      <div className="fixed left-[18px] md:left-6 bottom-[18px] md:bottom-auto md:top-1/2 md:-translate-y-1/2 z-60 flex flex-col gap-2 md:gap-4">
        {totalArr.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              currentPage === i + 1 ? "bg-white h-6 md:h-8" : "bg-white/30"
            }`}
          />
        ))}
      </div>

      {/* 메인 세로 스크롤 컨테이너 */}
      <div ref={containerRef} className="h-dvh overflow-y-auto snap-y snap-mandatory no-scrollbar scroll-auto">
        {totalArr.map((_, i) => {
          const pageIdx = i + 1;
          return (
            <div key={pageIdx}>
              <div className="relative w-full h-full overflow-hidden bg-transparent z-50">
                <ParticleBackground currentPage={currentPage} key={currentPage} />
              </div>
              <section
                id={`section-${pageIdx}`}
                className="snap-section w-full h-dvh snap-start snap-always flex items-center justify-center relative overflow-hidden z-51"
              >
                {/* 1페이지: Page Down 가이드 추가 */}
                {pageIdx === 1 && (
                  <>
                    <SinglePage pageIdx={pageIdx} />
                    <div className="absolute bottom-8 2xl:bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40 animate-bounceVertical pointer-events-none">
                      <span className="text-[10px] 2xl:text-[14px] font-mono tracking-[0.3em] uppercase">Scroll Down</span>
                      <div className="w-[1px] h-6 bg-white/50 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-white after:rotate-45" />
                    </div>
                  </>
                )}

                {/* 2페이지: Personal */}
                {pageIdx === 2 && (
                  <HorizontalSlider 
                    pageIdx={pageIdx} 
                    sliderData={dataobjA} 
                    currentSlide={currentSlide2} 
                    setCurrentSlide={setCurrentSlide2}
                    isMobile={isMobile} 
                  />
                )}
                {/* 3페이지: Commercial */}
                {pageIdx === 3 && (
                  <HorizontalSlider 
                    pageIdx={pageIdx} 
                    sliderData={dataobjB} 
                    currentSlide={currentSlide3} 
                    setCurrentSlide={setCurrentSlide3}
                    isMobile={isMobile} 
                  />
                )}
                
                {/* 나머지 페이지들 */}
                {isMobile ? (
                  <>
                    {pageIdx === 4 && <SinglePage pageIdx={pageIdx} type={"HALF1"} />}
                    {pageIdx === 5 && <SinglePage pageIdx={pageIdx} type={"HALF2"} />}
                    {pageIdx === 6 && <SinglePage pageIdx={pageIdx} />}
                  </>
                ) : (
                  <>
                    {pageIdx === 4 && <SinglePage pageIdx={pageIdx} type={"All"} />}
                    {pageIdx === 5 && <SinglePage pageIdx={pageIdx} />}
                  </>
                )}
              </section>
            </div>
          );
        })}
      </div>

      {/* 가로 슬라이더 도트 네비게이션 (부모 레벨에서 관리하여 모든 슬라이드에서 노출) */}
      {(currentPage === 2 || currentPage === 3) && (
        <div className="fixed bottom-6 md:bottom-12 left-0 w-full z-[100] flex gap-2 justify-center items-end pointer-events-none">
          {(currentPage === 2 ? dataobjA : dataobjB).map((_, dotIdx) => (
            <div
              key={dotIdx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                dotIdx === (currentPage === 2 ? currentSlide2 : currentSlide3) 
                ? 'bg-white w-6 md:w-10' 
                : 'bg-white/20 w-1.5'
              }`}
            />
          ))}
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .snap-section { scroll-snap-align: start; scroll-snap-stop: always; }
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fadeIn { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes bounceHorizontal {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounceHorizontal { animation: bounceHorizontal 1s infinite; }
      `}</style>
    </main>
  );
}

// 가로 슬라이더 컴포넌트
export function HorizontalSlider({ sliderData, pageIdx, currentSlide, setCurrentSlide, isMobile, bgClass }) {
  const scrollRef = useRef(null);
  const timerRef = useRef(null);
  const router = useRouter();

  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialX, setInitialX] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [isIgnoreClick, setIsIgnoreClick] = useState(false);

  const getX = (e) => (e.touches ? e.touches[0].pageX : e.pageX);

  const onDragStart = (e) => {
    setIsDrag(true);
    setIsIgnoreClick(false);
    const x = getX(e);
    setStartX(x);
    setInitialX(x);
    setStartTime(Date.now());
    if (scrollRef.current) {
      scrollRef.current.style.scrollSnapType = "none";
      scrollRef.current.style.scrollBehavior = "auto";
    }
  };

  const onDragMove = (e) => {
    if (!isDrag || !scrollRef.current) return;
    const x = getX(e);
    const walk = (startX - x) * 1.5;
    scrollRef.current.scrollLeft += walk;
    setStartX(x);
  };

  const onDragEnd = (e) => {
    if (!isDrag || !scrollRef.current || !sliderData) return;
    setIsDrag(false);
    const endX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
    const totalDistance = Math.abs(initialX - endX);

    if (totalDistance > 10) {
      setIsIgnoreClick(true);
      setTimeout(() => setIsIgnoreClick(false), 100);
    }

    const duration = Date.now() - startTime;
    const velocity = Math.abs((initialX - endX) / duration);
    const width = scrollRef.current.offsetWidth;
    const currentScroll = scrollRef.current.scrollLeft;
    
    let targetIndex = Math.round(currentScroll / width);
    if (totalDistance > 20 || velocity > 0.2) {
      if (initialX - endX > 0) targetIndex = Math.ceil(currentScroll / width);
      else targetIndex = Math.floor(currentScroll / width);
    }
    targetIndex = Math.max(0, Math.min(targetIndex, sliderData.length - 1));

    // 부모의 상태를 업데이트
    setCurrentSlide(targetIndex);

    // 부드러운 이동 실행
    scrollRef.current.scrollTo({ 
      left: targetIndex * width, 
      behavior: "smooth" 
    });

    // 이동 완료 후 스냅 재활성화 (걸림 현상 해결 핵심)
    setTimeout(() => {
      if (scrollRef.current) {
    scrollRef.current.style.scrollSnapType = "x mandatory";
      }
    }, 400);
  };

  if (!sliderData || sliderData.length === 0) return null;

  return (
    <>
<div className="absolute top-[60px] md:top-[76px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
  <h2 className="text-2xl md:text-4xl whitespace-nowrap relative font-orbitron before:content-[''] before:absolute before:block before:w-[100%] before:max-w-[200px] before:h-1/3 before:bg-red-500 before:bottom-0 before:right-[-24px] before:-z-10">
    {pageIdx === 2 ? "Personal Project" : "Commercial Project"}
  </h2>
</div>

      {/* 가로 슬라이드 안내 문구 (첫 번째 슬라이드에서만 표시) */}
      {currentSlide === 0 && (
        <div className="absolute bottom-[80px] md:bottom-[100px] left-1/2 -translate-x-1/2 md:-translate-0 md:left-auto md:right-[120px] z-[60] flex items-center gap-3 opacity-40 pointer-events-none">
          <span className="text-[10px] md:text-[14px] font-orbitron tracking-[0.2em] uppercase">Slide Projects</span>
          <span className="text-lg md:text-xl animate-bounceHorizontal">→</span>
        </div>
      )}

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


        {sliderData.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`min-w-full h-full snap-center snap-always flex flex-col items-center justify-center ${bgClass} p-6 md:p-12`}
          >
            <div className="w-full h-full animate-fadeIn pointer-events-none">
              <div className="mx-auto w-full md:w-[90%] h-full pt-[80px] md:pt-[91px] flex flex-col items-center justify-center">

                <div className="w-full h-[50%] md:h-[65%] flex items-end md:items-center justify-center">
                  <div
                    className={`mx-auto w-full md:w-auto md:h-full aspect-video relative group pointer-events-auto 
                    ${isMobile ? 'cursor-pointer' : (activeId === item.id ? 'cursor-pointer' : 'cursor-not-allowed')}`}
                    onMouseEnter={() => {
                      if (!isMobile) timerRef.current = setTimeout(() => setActiveId(item.id), 500);
                    }}
                    onMouseLeave={() => {
                      if (!isMobile) {
                        clearTimeout(timerRef.current);
                        setActiveId(null);
                      }
                    }}
                  >
                    <div
                      className={`w-full h-full bg-gray-800 rounded-[10px] relative transition-all duration-300 ease-out
                    ${!isMobile && activeId === item.id ? 'scale-[1.02] shadow-2xl' : 'scale-100 shadow-none'}`}
                      onClick={(e) => {
                        if (isMobile || activeId === item.id) {
                          if (!isDrag && !isIgnoreClick) router.push(`/portfolio/${item.id}`);
                        } else {
                          e.preventDefault();
                        }
                      }}
                    >
                      {!isMobile && (
                        <div
                          className={`absolute -inset-[2px] md:-inset-[4px] rounded-[12px] z-0 transition-opacity duration-300
                    ${activeId === item.id ? 'opacity-100' : 'opacity-0'}`}
                          style={{
                            background: 'linear-gradient(60deg, #5f86f2, #a65ff2, #f25fd0, #f25f61, #f2cb5f, #abf25f, #5ff281, #5ff2f0)',
                            backgroundSize: '300% 300%',
                            animation: 'moveGradient 2s linear infinite',
                          }}
                        />
                      )}
                      <div className="absolute inset-0 bg-[#181818] rounded-[10px] z-10" />
                      <div className={`relative z-20 w-full h-full flex items-center justify-center overflow-hidden rounded-[10px] border ${activeId === item.id ? "border-transparent" : "border-white/20"}`}>
                        {activeId === item.id ? (
                          <div className={`absolute w-full h-full bg-black/20 z-50 opacity-100 duration-500 flex items-end justify-center animate-fadeIn`}>
                            <span className="hidden 2xl:block font-orbitron opacity-80 text-2xl mb-10 tracking-wider">VIEW PROJECT</span>
                          </div>
                        ) : null}
                        <img className="w-full h-auto rounded-[10px] pointer-events-none" src={item.MainImages} alt={item.name} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full h-[50%] md:h-[35%] flex flex-col items-center justify-start md:justify-center mt-6 md:mt-2">
                  <h4 className="max-[350px]:text-[18px] text-xl md:text-2xl 2xl:text-3xl font-bold font-orbitron title-mixed-font">{item.name}</h4>
                  <p className="text-[14px] md:text-lg font-light opacity-60 mt-2 md:mt-3 2xl:mt-4 px-4 text-center line-clamp-4 md:line-clamp-none leading-relaxed weight-clear-300 md:whitespace-nowrap break-keep">
                    {item.contentS}
                  </p>
                  <div className="flex gap-2 md:gap-4 items-center mt-4 2xl:mt-8">
                    <div className="text-xs font-mono opacity-40 uppercase tracking-[2px] md:tracking-[0.2em]">Key skills</div>
                    <div className="flex gap-2 md:gap-3">
                      {item.Language && item.Language.map((langValue) => {
                        const targetLang = Language.find((l) => l.value === langValue);
                        if (!targetLang) return null;
                        return (
                          <div key={langValue} className="group relative">
                            <img src={targetLang.src} alt={langValue} className="w-5 h-5 md:w-7 md:h-7 2xl:w-9 2xl:h-9 transition-transform duration-300 group-hover:scale-125 object-contain" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

        <style jsx>{`
        @keyframes moveGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </>
  );
}