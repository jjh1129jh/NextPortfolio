"use client";

import { useEffect, useRef, useState } from "react";

// --- 가로 슬라이더 컴포넌트 (초민감 Flick + 모바일 터치 통합) ---
const HorizontalSlider = ({ pageIdx, bgClass }) => {
  const scrollRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialX, setInitialX] = useState(0); 
  const [startTime, setStartTime] = useState(0);

  const getX = (e) => (e.touches ? e.touches[0].pageX : e.pageX);

  const onDragStart = (e) => {
    setIsDrag(true);
    const x = getX(e);
    setStartX(x);
    setInitialX(x);
    setStartTime(Date.now());
    
    if (scrollRef.current) {
      // 드래그 시작 시 스냅과 부드러운 스크롤을 잠시 꺼서 마우스에 즉각 반응하게 함
      scrollRef.current.style.scrollSnapType = "none";
      scrollRef.current.style.scrollBehavior = "auto";
    }
  };

  const onDragEnd = (e) => {
    if (!isDrag || !scrollRef.current) return;
    setIsDrag(false);

    const endX = e.changedTouches ? e.changedTouches[0].pageX : e.pageX;
    const totalDistance = initialX - endX; 
    const duration = Date.now() - startTime;
    const velocity = Math.abs(totalDistance / duration);

    const width = scrollRef.current.offsetWidth;
    const currentScroll = scrollRef.current.scrollLeft;
    let targetIndex = Math.round(currentScroll / width);

    // [atypikal 로직] 5px만 움직여도 방향성 인정, 혹은 속도가 빠르면 무조건 이동
    const threshold = 5; 
    if (Math.abs(totalDistance) > threshold || velocity > 0.2) {
      if (totalDistance > 0) {
        targetIndex = Math.floor(currentScroll / width) + 1;
      } else {
        targetIndex = Math.ceil(currentScroll / width) - 1;
      }
    }

    targetIndex = Math.max(0, Math.min(targetIndex, 4));

    // 드래그 종료 후 다시 스냅과 부드러운 애니메이션 복구
    scrollRef.current.style.scrollSnapType = "x mandatory";
    scrollRef.current.style.scrollBehavior = "smooth";
    scrollRef.current.scrollTo({ left: targetIndex * width, behavior: "smooth" });
  };

  const onDragMove = (e) => {
    if (!isDrag || !scrollRef.current) return;
    
    const x = getX(e);
    const walk = (startX - x) * 1.5; // 드래그 감도
    scrollRef.current.scrollLeft += walk;
    setStartX(x); // 마우스 위치 실시간 갱신 (PC 드래그 튐 방지)
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
      className="w-full h-full flex overflow-x-hidden snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: 'pan-y' }}
    >
      {[...Array(5)].map((_, hIdx) => (
        <div key={hIdx} className={`min-w-full h-full snap-center snap-always flex flex-col items-center justify-center border-x border-white/5 ${bgClass}`}>
          <div className="text-center animate-fadeIn pointer-events-none px-6">
            <h2 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter uppercase leading-none">SECTION {pageIdx}</h2>
            <p className="text-xl md:text-2xl font-light opacity-60">Slide {hIdx + 1} / 5</p>
            <div className="mt-8 flex gap-2 justify-center">
              {[...Array(5)].map((_, dot) => (
                <div key={dot} className={`w-2 h-2 rounded-full transition-all duration-300 ${dot === hIdx ? 'bg-white w-8' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// --- 메인 풀페이지 컴포넌트 ---
export default function FullPageScroll() {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.classList.contains('snap-section')) {
            const pageNum = parseInt(entry.target.id.replace("section-", ""));
            if (!isNaN(pageNum)) setCurrentPage(pageNum);
          }
        });
      },
      { threshold: 0.6 }
    );

    document.querySelectorAll(".snap-section").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const bgColors = ["bg-slate-950", "bg-indigo-950", "bg-zinc-900", "bg-neutral-900", "bg-rose-950", "bg-stone-900", "bg-blue-950", "bg-gray-900", "bg-emerald-950", "bg-black"];

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black">
      
      {/* PC 전용 Indicator (우측 상단) */}
      <div className="fixed top-10 right-10 z-50 mix-blend-difference hidden md:flex flex-col items-end">
        <span className="text-4xl font-black tracking-tighter leading-none">{currentPage.toString().padStart(2, '0')}</span>
        <div className="w-12 h-[2px] bg-white my-2" />
        <span className="text-xs font-mono opacity-50 uppercase tracking-widest">Total 10</span>
      </div>

      {/* 모바일 전용 Indicator (하단 바) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 md:hidden flex flex-col items-center gap-3 mix-blend-difference w-full px-10">
        <div className="flex gap-1.5 w-full justify-center">
          {[...Array(10)].map((_, i) => (
            <div 
              key={i} 
              className={`h-[2px] rounded-full transition-all duration-300 ${currentPage === i + 1 ? 'flex-1 bg-white' : 'w-2 bg-white/20'}`} 
            />
          ))}
        </div>
        <span className="text-[10px] font-mono tracking-[0.3em] opacity-60 uppercase">
          Page {currentPage} / 10
        </span>
      </div>

      {/* PC 전용 좌측 Dots */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${currentPage === i + 1 ? 'bg-white h-8' : 'bg-white/30'}`} />
        ))}
      </div>

      {/* 메인 세로 스크롤 컨테이너 */}
      <div ref={containerRef} className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar scroll-auto">
        {[...Array(10)].map((_, i) => {
          const pageIdx = i + 1;
          const isHorizontal = pageIdx === 2 || pageIdx === 5;

          return (
            <section
              key={pageIdx}
              id={`section-${pageIdx}`}
              className="snap-section w-full h-screen snap-start snap-always flex items-center justify-center relative overflow-hidden"
            >
              {isHorizontal ? (
                <HorizontalSlider pageIdx={pageIdx} bgClass={bgColors[i]} />
              ) : (
                <div className={`${bgColors[i]} w-full h-full flex flex-col items-center justify-center text-center px-6`}>
                  <div className="animate-fadeIn">
                    <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">SECTION {pageIdx}</h2>
                    <p className="mt-4 opacity-40 font-mono tracking-widest uppercase text-xs">Scroll Down</p>
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* 세로 스크롤 시 2페이지 점프 방지 핵심 설정 */
        .snap-section {
          scroll-snap-align: start;
          scroll-snap-stop: always; /* 브라우저 관성 무시하고 무조건 다음 섹션에서 멈춤 */
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