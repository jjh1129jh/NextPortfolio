"use client";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = ({ currentPage }) => { // props 추가
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  if (!init) return null;

  const isInteractivityEnabled = currentPage === 1;
  console.log(isInteractivityEnabled)
  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 -z-10"
      options={{
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: isInteractivityEnabled,
              mode: "connect", // *** grab 대신 connect를 사용합니다 ***
            },
          },
          modes: {
            connect: {
              distance: 150,    // 마우스 주변 얼마큼의 반경을 감지할지
              links: {
                opacity: 0.5    // 연결될 선의 투명도
              },
              radius: 300       // 마우스 커서 주변의 연결 범위 (가장 중요)
            }
          },
        },
        particles: {
          color: { value: "#4c97d9" },
          links: {
            enable: false,      // 기본 연결은 꺼둡니다.
            distance: 150,
            color: "#4c97d9",
            opacity: 0.8,
            width: 1,
          },
          move: {
            enable: true,
            speed: 1,           // 부드러운 움직임을 위해 속도를 살짝 낮췄습니다.
            direction: "none",
            random: false,
            straight: false,
            outModes: { default: "out" },
          },
          number: {
            density: { enable: true, area: 800 },
            value: 200,         // 너무 많으면 어지러울 수 있어 조절했습니다.
          },
          opacity: {
            value: { min: 0.5, max: 1 },
          },
          shape: { type: "circle" },
          size: { 
            value: { min: 0.2, max: 1.4 } // 말씀하신 대로 1 이하의 작은 사이즈 적용
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticleBackground;