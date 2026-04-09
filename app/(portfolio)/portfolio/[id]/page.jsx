import Link from "next/link"
import { dataobj1, dataobj2 } from "../../../page"

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
        <div className="w-full h-full relative">
            <Link className="absolute top-2 left-2 w-8 h-8 border-1 border-black rounded-[6px]" href="/"><img src="/img/icon_home.svg" alt="홈화면 이동" /></Link>
            <p className="text-2xl">{obj.content}</p>
        </div>
    )
}