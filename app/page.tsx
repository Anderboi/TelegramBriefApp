import BriefMain from "./components/brief-main";

export default function Home() {
  return (
    // <div
    //   className={`grid grid-rows-[10px_1fr_10px] items-center justify-items-center min-h-screen 
    // //gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    // >
      <main className="pt-20 pb-24 min-h-screen bg-gray-100 flex //flex-col gap-[32px] //row-start-2 justify-center m-auto items-center //sm:items-start sm:w-[900px] p-4 sm:p-6 sm:rounded-2xl">
        <BriefMain />
      </main>
     
     // </div> 
  );
}
