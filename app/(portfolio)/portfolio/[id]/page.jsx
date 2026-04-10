import Link from "next/link"
import { dataobj1, dataobj2 } from "../../../page"
import ParticleBackground from "../../../../jsx/particle_Bg";
import ColorScrollBlock from "../../../../jsx/ColorScrollBlock";

export async function getData(id) {
    const res1 = await fetch(dataobj1, { cache: 'no-store' });
    const res2 = await fetch(dataobj2, { cache: 'no-store' });
    
    const data1 = await res1.json();
    const data2 = await res2.json();

    // 2. 두 배열을 하나로 합칩니다.
    const allData = [...data1, ...data2];

    // 3. 합쳐진 전체 데이터에서 id가 일치하는 항목을 찾습니다.
    const item = allData.find((item) => item.id === Number(id));
    
    return item;
}



export default async function Portfolio({params}) {
    const { id } = await params
    const obj = await getData(id)
    return(
        <div className="w-full min-h-screen relative bg-[#181818] text-white">
            <div className="relative z-[100] pt-20 pb-40">
                <ColorScrollBlock data={obj} />
            </div>
            <div className="relative w-full h-full overflow-hidden bg-transparent z-50">
                <ParticleBackground currentPage={0} key={0} />
            </div>
            <Link className="absolute top-8 right-8 w-16 h-16 border-1 border-white rounded-[6px] cursor-pointer z-200 hover:scale-110 duration-200" href="/"><img src="/img/icon_home.svg" alt="홈화면 이동" /></Link>
            <p className="text-2xl">{obj.contentL}</p>
            <Link 
                href={obj.weblink} 
                target="_blank" 
                rel="noopener noreferrer" // 보안과 성능을 위해 추가 권장
                className="text-xl md:text-2xl font-light opacity-60 pointer-events-auto hover:underline"
            >
                {obj.weblink}
            </Link>
        </div>
    )
}