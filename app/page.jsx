import FullPageScroll from "../jsx/full_Page";

export const dataobj1 = "https://raw.githubusercontent.com/jjh1129jh/PotfolioJSON/refs/heads/main/PotfolioData_1.json";
export const dataobj2 = "https://raw.githubusercontent.com/jjh1129jh/PotfolioJSON/refs/heads/main/PotfolioData_2.json";

export async function getDataA() {
  const responseA= await fetch(dataobj1, { cache: 'no-store' });
  return responseA.json();
}

export async function getDataB() {
    const responseB = await fetch(dataobj2, { cache: 'no-store' });
    return responseB.json();
}

export default async function HomePage() {
    const dataobjA = await getDataA();
    const dataobjB = await getDataB();
    return (
        <>
            <FullPageScroll dataobjA={dataobjA} dataobjB={dataobjB}></FullPageScroll>
        </>
    )
}