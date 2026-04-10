import Link from "next/link"
import { dataobj1, dataobj2 } from "../../../page"
import ParticleBackground from "../../../../jsx/particle_Bg";
import ColorScrollBlock from "../../../../jsx/ColorScrollBlock";

export async function getData(id) {
    const res1 = await fetch(dataobj1, { cache: 'no-store' });
    const res2 = await fetch(dataobj2, { cache: 'no-store' });
    
    const data1 = await res1.json();
    const data2 = await res2.json();

    const allData = [...data1, ...data2];

    const item = allData.find((item) => item.id === Number(id));
    return item;
}

export default async function Portfolio({ params }) {
  const { id } = await params;
  const obj = await getData(id);

  return (
    <div className="w-full min-h-screen relative bg-[#181818] text-white font-sans overflow-x-hidden">

      <Link
        className="fixed right-5 top-4 md:top-8 md:right-8 w-13 md:w-16 h-13 md:h-16 border-3 border-white rounded-[6px] cursor-pointer z-[200] flex items-center justify-center opacity-75 md:opacity-85 hover:opacity-100 hover:scale-110 duration-200"
        href="/"
      >
        <img src="/img/icon_home.svg" alt="홈화면 이동" className="w-11 md:w-14 h-11 md:h-14" />
      </Link>


      <section className="relative w-full md:h-[70vh] overflow-hidden pt-20 md:pt-0">
        <img
          src={obj.MainImages}
          alt={obj.name}
          className="w-[90%] mx-auto md:mx-0 md:w-full md:h-full object-cover md:opacity-60"
        />
        <div className="hidden md:block md:absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />


        <div className="md:absolute md:bottom-10 md:left-1/2 md:-translate-x-1/2 mx-auto md:mx-0 w-[90%] md:w-[60%] mt-10 md:mt-0">
          <h1 className="text-2xl md:text-7xl font-bold text-center title-mixed-font">
            {obj.name}
          </h1>
        </div>
      </section>

      <section className="relative z-[100] w-[90%] md:w-[60%] mx-auto py-8 md:py-20 flex flex-col gap-16">

        <div className="flex flex-col gap-6 md:border-l-2 md:border-sky-500 md:pl-8">
          <p className="text-[15px] md:text-2xl text-center md:text-start font-light leading-relaxed text-gray-200 title-mixed-font break-keep">
            {obj.contentL}
          </p>

          {obj.weblink && (typeof obj.weblink === 'string' ? obj.weblink !== "" : obj.weblink.length > 0) ? (
            <div className="grid grid-cols-1 md:flex md:flex-wrap gap-3 w-[85%] md:w-full mx-auto md:mx-0 justify-center md:justify-start">
              {Array.isArray(obj.weblink) ? (
                obj.weblink.map((url, index) => (
                  <Link
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 w-full md:min-w-[140px] px-6 py-3 md:py-4 border bg-sky-500 md:bg-transparent border-sky-500 text-sky-400 font-bold text-sm md:text-base tracking-[0.2em] rounded-sm hover:bg-sky-500 hover:text-white transition-all duration-300 flex items-center gap-2 group justify-center"
                  >
                    {obj.weblink.length > 1 ? `홈페이지 ${index + 1}` : "홈페이지"}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                ))
              ) : (
                <Link
                  href={obj.weblink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[80%] mx-auto md:mx-0 md:w-full px-8 py-3 md:py-4 border pr-3 md:pr-0 bg-sky-500 md:bg-transparent border-sky-500 text-sky-400 font-bold text-sm md:text-base tracking-[0.2em] rounded-sm hover:bg-sky-500 hover:text-white transition-all duration-300 flex items-center gap-2 md:gap-3 group justify-center"
                >
                  홈페이지
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              )}
            </div>
          ) : (
            <button
              disabled
              className="w-[80%] mx-auto md:mx-0 md:w-full px-8 py-3 md:py-4 border border-white/10 text-gray-500 font-bold text-sm md:text-base tracking-[0.2em] rounded-sm cursor-not-allowed bg-white/5"
            >
              링크 없음
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 bg-white/5 p-6 md:p-10 backdrop-blur-sm border border-white/10 rounded-sm">

          {/* Composition */}
          {obj.composition && obj.composition.length > 0 && (
            <div className="flex flex-col gap-5">
              <h3 className="text-sky-500 text-sm font-bold tracking-[0.3em] uppercase border-b border-white/10 pb-2 w-fit">
                Composition
              </h3>
              <div className="flex flex-wrap gap-3">
                {obj.composition.map((item, index) => (
                  <span
                    key={`comp-${index}`}
                    className="px-4 py-2 bg-white/10 rounded-full text-[12px] md:text-sm font-medium text-gray-200 border border-white/5"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {obj.features && obj.features.length > 0 && (
            <div className="flex flex-col gap-5">
              <h3 className="text-sky-500 text-sm font-bold tracking-[0.3em] uppercase border-b border-white/10 pb-2 w-fit">
                Features
              </h3>
              <div className="flex flex-wrap gap-3">
                {obj.features.map((item, index) => (
                  <span
                    key={`feat-${index}`}
                    className="px-4 py-2 bg-white/10 rounded-full text-[12px] md:text-sm font-medium text-gray-200 border border-white/5"
                  >
                    # {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Language */}
          {obj.Language && obj.Language.length > 0 && (
            <div className="flex flex-col gap-5 md:col-span-2">
              <h3 className="text-sky-500 text-sm font-bold tracking-[0.3em] uppercase border-b border-white/10 pb-2 w-fit">
                Key Skill
              </h3>
              <div className="flex flex-wrap gap-3">
                {obj.Language.map((item, index) => (
                  <span
                    key={`lang-${index}`}
                    className="px-4 py-2 bg-sky-500/10 rounded-full text-[12px] md:text-sm font-bold text-sky-400 border border-sky-500/20 uppercase"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      <DetailImg obj={obj} />


      <section className="relative z-[100] pb-40">
        <ColorScrollBlock data={obj} />
      </section>


      <div className="fixed inset-0 w-full h-full overflow-hidden z-10 pointer-events-none">
        <ParticleBackground currentPage={0} key={0} />
      </div>
    </div>
  );
}

export function DetailImg({obj}) {
  return (
    <>
      {
        (obj.image.length === 0 && obj.imageS.length === 0)
        ? null
        : <h2 className="text-2xl md:text-5xl font-bold text-center title-mixed-font mt-10 mb-12 md:mb-26">DETAIL&ensp;IMAGES</h2>
      }
    </>
  )
}