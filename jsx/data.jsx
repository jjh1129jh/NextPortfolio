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

// 2. 서버 컴포넌트 (반드시 async를 붙여야 합니다)
export default async function DataList() {
  const dataobjA = await getDataA();
  const dataobjB = await getDataB();
  return (
    <>
      {dataobjA.map((item) => (
        <div key={item.id}>
            <p>{item.content}</p>
        </div>
      ))}
      {dataobjB.map((item) => (
        <div key={item.id}>
            <p>{item.content}</p>
        </div>
      ))}
    </>
  );
}