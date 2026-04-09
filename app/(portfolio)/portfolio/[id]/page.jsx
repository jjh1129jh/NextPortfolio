import Link from "next/link"
import { dataobj1, dataobj2 } from "../../../page"
import ParticleBackground from "../../../../jsx/particle_Bg";

export async function getData(id) {
    const response = await fetch(dataobj1, { cache: 'no-store' });
    const data = await response.json()
    const dataArr = [...data]
    const item = dataArr.find((item) => item.id === Number(id));
    return item
}



export default async function Portfolio({params}) {
    const { id } = await params
    const obj = await getData(id)
    return(
        <div className="w-full min-h-screen relative bg-[#181818] text-white">
            <div className="relative w-full h-full overflow-hidden bg-transparent z-50">
                <ParticleBackground currentPage={0} key={0} />
            </div>
            <Link className="absolute top-2 left-2 w-8 h-8 border-1 border-white rounded-[6px]" href="/"><img src="/img/icon_home.svg" alt="홈화면 이동" /></Link>
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