'use client';

import { useState, useRef } from 'react';

export default function ColorScrollBlock({ data }) {
  if (!data) return null;

  const { imageS, image } = data;

  return (
    <div className="flex flex-col gap-20 md:gap-24 w-full w-[90%] md:w-[60%] mx-auto px-6">

      <div className="flex flex-col gap-20 md:gap-24">
        {imageS?.map((item, idx) => (
          item.img && (
            <div key={`imageS-${idx}`} className="flex flex-col gap-4">

              <div className="flex justify-center md:justify-between items-end px-1 mb-0 md:mb-1">
                <span className="text-[14px] hidden md:inline-block tracking-[0.2em] text-sky-500 font-bold uppercase">
                  Interactive Preview
                </span>
                <span className="text-[12px] md:text-[14px] text-gray-400 font-semibold">
                  {/* 정밀 포인터(마우스)가 있을 때만 노출 */}
                  <span className="hidden [@media(pointer:fine)]:inline">
                    마우스를 호버해서 확인하세요 ↓
                  </span>
                  {/* 터치 기반 기기에서 노출 */}
                  <span className="inline [@media(pointer:fine)]:hidden">
                    클릭해서 확인하세요 ↓
                  </span>
                </span>
              </div>
              
              <ScrollableBox imgSrc={item.img} />
              
              <p className="text-center text-gray-400 text-base font-light tracking-widest mt-2 uppercase text-[12px] md:text-[16px] break-keep">
                {item.text}
              </p>
            </div>
          )
        ))}
      </div>

      <div className="flex flex-col gap-12 md:gap-20">
        {image?.map((item, idx) => (
          item.img && (
            <div key={`image-${idx}`} className="flex flex-col gap-4">
              <img 
                src={item.img} 
                alt={item.text} 
                className="w-full h-auto rounded-sm shadow-xl border border-white/15"
              />
              <p className="text-center text-gray-400 text-base font-light tracking-widest mt-2 uppercase text-[12px] md:text-[16px] break-keep">
                {item.text}
              </p>
            </div>
          )
        ))}
      </div>

    </div>
  );
}

function ScrollableBox({ imgSrc }) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSmallImage, setIsSmallImage] = useState(false);
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const handleImageLoad = (e) => {
    const { naturalWidth } = e.target;
    // 너비가 768px 미만이면 이미지 사이즈 조절
    if (naturalWidth < 768) {
      setIsSmallImage(true);
    }
  };

  const getScrollStyles = () => {
    if (!imgRef.current || !containerRef.current) return {};
    const diff = imgRef.current.offsetHeight - containerRef.current.offsetHeight;
    if (diff <= 0) return {};

    const duration = (diff / 250).toFixed(1);

    return {
      transform: isScrolling ? `translateY(-${diff}px)` : 'translateY(0)',
      transitionDuration: isScrolling ? `${duration}s` : '0.8s',
    };
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-video overflow-hidden rounded-sm bg-[#222] border border-white/15 shadow-2xl"
      onMouseEnter={() => setIsScrolling(true)}
      onMouseLeave={() => setIsScrolling(false)}
      onClick={() => setIsScrolling(!isScrolling)} 
    >
      <img
        ref={imgRef}
        src={imgSrc}
        alt="preview"
        onLoad={handleImageLoad}
        className={`h-auto absolute top-0 transition-transform ease-linear
          ${isSmallImage 
            ? 'w-1/3 left-1/2 -translate-x-1/2' 
            : 'w-full left-0'
          }`}
        style={getScrollStyles()}
      />
    </div>
  );
}