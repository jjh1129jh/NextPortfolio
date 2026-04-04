"use client";

import { useEffect, useRef, useState } from "react";

// 메인
export default function FullPageScroll({dataobjA, dataobjB}) {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef(null);
  const bgColors = ["bg-slate-950", "bg-indigo-950", "bg-rose-950", "bg-neutral-900"];

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

  

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white font-sans selection:bg-white selection:text-black">
      
      {/* 상단 = PC */}
      <div className="fixed top-10 right-10 z-50 mix-blend-difference hidden md:flex flex-col items-end">
        <span className="text-4xl font-black tracking-tighter leading-none">{currentPage.toString().padStart(2, '0')}</span>
        <div className="w-12 h-[2px] bg-white my-2" />
        <span className="text-xs font-mono opacity-50 uppercase tracking-widest">Total 4</span>
      </div>

      {/* 측면 = PC */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${currentPage === i + 1 ? 'bg-white h-8' : 'bg-white/30'}`} />
        ))}
      </div>

      {/* 하단 = 모바일 */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 md:hidden flex flex-col items-center gap-3 mix-blend-difference w-1/4">
        <div className="flex gap-1.5 w-full justify-center">
          {[...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`h-[4px] rounded-full transition-all duration-300 ${currentPage === i + 1 ? 'flex-1 bg-white' : 'w-2 bg-white/20'}`} 
            />
          ))}
        </div>
        <span className="text-[10px] font-mono tracking-[0.3em] opacity-60 uppercase">
          Page {currentPage} / 4
        </span>
      </div>



      {/* 메인 세로 스크롤 컨테이너 */}
      <div ref={containerRef} className="h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar scroll-auto">
        {[...Array(4)].map((_, i) => {
          const pageIdx = i + 1;
          const isHorizontal = pageIdx === 2 || pageIdx === 3;

          return (
            <section
              key={pageIdx}
              id={`section-${pageIdx}`}
              className="snap-section w-full h-screen snap-start snap-always flex items-center justify-center relative overflow-hidden"
            >
              {isHorizontal && (
                <HorizontalSlider pageIdx={pageIdx} bgClass={bgColors[i]} dataobjA={dataobjA} dataobjB={dataobjB} />
              )} 
              {pageIdx === 1 && (
                <PageTop pageIdx={pageIdx} bgClass={bgColors[i]} i={i}/>
              )}
              {pageIdx === 4 && (
                <PageBtm pageIdx={pageIdx} bgClass={bgColors[i]} i={i}/>
              )}
            </section>
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
export function HorizontalSlider ({ dataobjA, dataobjB, pageIdx, bgClass }) {
  const scrollRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [initialX, setInitialX] = useState(0); 
  const [startTime, setStartTime] = useState(0);
  const sliderData = pageIdx === 2 ? dataobjA : dataobjB
  const DataTotal = sliderData.length

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
    if (!isDrag || !scrollRef.current || !sliderData) return;
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

    targetIndex = Math.max(0, Math.min(targetIndex, (sliderData.length - 1)));

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
      {sliderData.map((index , id) => (
        <div key={id} className={`min-w-full h-full snap-center snap-always flex flex-col items-center justify-center border-x border-white/5 ${bgClass}`}>
          <div className="text-center animate-fadeIn pointer-events-none px-6">
            <h2 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter uppercase leading-none">SECTION {pageIdx}</h2>
            <p>{index.name}</p>
            <p className="text-xl md:text-2xl font-light opacity-60">{index.content}</p>
            <div className="mt-8 flex gap-2 justify-center">
              {sliderData.map((index, dot) => (
                <div key={dot} className={`w-2 h-2 rounded-full transition-all duration-300 ${dot === id ? 'bg-white w-8' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export function PageTop({pageIdx ,bgClass}) {
  return(
    <div className={`${bgClass} w-full h-full flex flex-col items-center justify-center text-center px-6`}>
      <div className="animate-fadeIn">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">SECTION {pageIdx}</h2>
        <p className="mt-4 opacity-40 font-mono tracking-widest uppercase text-xs">Scroll Down</p>
      </div>
    </div>
  )
}

export function PageBtm({pageIdx ,bgClass}) {
  return(
    <div className={`${bgClass} w-full h-full flex flex-col items-center justify-center text-center px-6`}>
      <div className="animate-fadeIn">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">SECTION {pageIdx}</h2>
        <p className="mt-4 opacity-40 font-mono tracking-widest uppercase text-xs">췍!!!</p>
      </div>
    </div>
  )  
}