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
                className="snap-section w-full h-dvh snap-start snap-always flex items-center justify-center relative overflow-hidden z-51 relative"
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
  const timerRef = useRef(null);
  const router = useRouter();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialX, setInitialX] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [isIgnoreClick, setIsIgnoreClick] = useState(false);

  // 현재 페이지 인덱스에 따라 Personal 또는 Commercial 데이터 선택
  const sliderData = pageIdx === 2 ? dataobjA : dataobjB;

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
      // 100ms 후에 클릭 무시 해제
      setTimeout(() => setIsIgnoreClick(false), 100);
    }

    const duration = Date.now() - startTime;
    const velocity = Math.abs((initialX - endX) / duration);
    const width = scrollRef.current.offsetWidth;
    const currentScroll = scrollRef.current.scrollLeft;
    let targetIndex = Math.round(currentScroll / width);
    if (totalDistance > 5 || velocity > 0.2) {
      if (initialX - endX > 0) targetIndex = Math.floor(currentScroll / width) + 1;
      else targetIndex = Math.ceil(currentScroll / width) - 1;
    }
    targetIndex = Math.max(0, Math.min(targetIndex, sliderData.length - 1));

    setCurrentSlide(targetIndex);

    scrollRef.current.style.scrollSnapType = "x mandatory";
    scrollRef.current.style.scrollBehavior = "smooth";
    scrollRef.current.scrollTo({ left: targetIndex * width, behavior: "smooth" });
  };

  const portFolioLink = (id) => {
    router.push(`/portfolio/${id}`);
  };

  // 슬라이더 데이터가 없을 경우를 대비한 방어 코드
  if (!sliderData || sliderData.length === 0) return null;

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
      {/* 상단 섹션 타이틀 - 모바일 대응 */}
      <div className="absolute top-[50px] md:top-[76px] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
        <h2 className="text-xl md:text-4xl whitespace-nowrap relative font-orbitron before:content-[''] before:absolute before:block before:w-full before:h-1/3 before:bg-red-500 before:bottom-0 before:right-[-15px] md:before:right-[-30px] before:-z-10">
          {pageIdx === 2 ? "Personal Project" : "Commercial Project"}
        </h2>
      </div>

      {sliderData.map((item, idx) => (
        <div 
          key={item.id || idx} 
          className={`min-w-full h-full snap-center snap-always flex flex-col items-center justify-center border-x border-white/5 ${bgClass} p-6 md:p-12`}
        >
            <div className="w-full h-full animate-fadeIn pointer-events-none">
            <div className="mx-auto w-full md:w-[90%] h-full pt-[80px] md:pt-[91px] flex flex-col items-center justify-center">
              
              {/* 이미지 카드 영역 (상단 55%) */}
              <div className="w-full h-[55%] md:h-3/4 flex items-center justify-center">
                  <div
                  className="mx-auto w-full md:h-full aspect-video relative group pointer-events-auto"
                    onMouseEnter={() => {
                    timerRef.current = setTimeout(() => setActiveId(item.id), 500);
                    }}
                    onMouseLeave={() => {
                      // 마우스 나가면 타이머 취소 및 상태 초기화
                      clearTimeout(timerRef.current);
                      setActiveId(null);
                    }}
                  >
                    <div
                      className={`w-full h-full bg-gray-800 rounded-[10px] relative transition-all duration-300 ease-out
                  ${activeId === item.id
                      ? 'scale-[1.02] cursor-pointer shadow-2xl' 
                          : 'scale-100 cursor-grab active:cursor-grabbing shadow-none'}`}
                      onClick={(e) => {
                        // IgnoreClick(드래그 직후 방지)과 activeId(0.5초 대기)가 모두 충족되어야 함
                        if (activeId === item.id && !isDrag && !isIgnoreClick) {
                          portFolioLink(item.id);
                        } else {
                          e.preventDefault();
                        }
                      }}
                    >
                    {/* 호버 효과용 무지개 보더 애니메이션 */}
                      <div
                      className={`absolute -inset-[2px] md:-inset-[3px] rounded-[12px] z-0 transition-opacity duration-300 
                    ${activeId === item.id ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                          background: 'linear-gradient(60deg, #5f86f2, #a65ff2, #f25fd0, #f25f61, #f2cb5f, #abf25f, #5ff281, #5ff2f0)',
                          backgroundSize: '300% 300%',
                        animation: 'moveGradient 2s linear infinite',
                        }}
                      />

                      <div className="absolute inset-0 bg-[#181818] rounded-[10px] z-10" />

                    <div className="relative z-20 w-full h-full flex items-center justify-center overflow-hidden rounded-[10px]">
                        <img
                        className="w-full h-full object-cover md:w-auto md:max-h-full rounded-[10px] border border-white/5 pointer-events-none"
                          src={item.MainImages}
                          alt={item.name}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              {/* 하단 텍스트 정보 영역 (하단 45%) */}
              <div className="w-full h-[45%] md:h-1/4 flex flex-col items-center justify-start md:justify-center mt-6 md:mt-0">
                <h4 className="text-xl md:text-2xl font-bold font-orbitron">{item.name}</h4>
                <p className="text-sm md:text-base font-light opacity-60 mt-2 md:mt-3 px-4 text-center line-clamp-2 md:line-clamp-none">
                  {item.contentS}
                </p>

                {/* 기술 스택 렌더링 */}
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center mt-6 md:mt-4">
                  <div className="text-[10px] md:text-xs font-mono opacity-40 uppercase tracking-[0.2em]">Key skills</div>
                  <div className="flex gap-2 md:gap-3">
                    {item.Language && item.Language.map((langValue) => {
                      const targetLang = Language.find((l) => l.value === langValue);
                      if (!targetLang) return null;
                      return (
                        <div key={langValue} className="group relative">
                          <img
                            src={targetLang.src}
                            alt={langValue}
                            title={langValue}
                            className="w-6 h-6 md:w-8 md:h-8 transition-transform duration-300 group-hover:scale-125 object-contain"
                          />
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

      {/* 하단 페이지 표시용 도트 */}
      <div className="absolute bottom-8 md:bottom-10 left-0 w-full z-20 flex gap-2 justify-center items-end pointer-events-none">
        {sliderData.map((_, dotIdx) => (
          <div
            key={dotIdx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              dotIdx === currentSlide ? 'bg-white w-6 md:w-8' : 'bg-white/20 w-1.5'
              }`}
          />
        ))}
      </div>

      {/* 로컬 애니메이션 정의 */}
      <style jsx>{`
        @keyframes moveGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}