import { Suspense } from "react";
import BriefMain from "./components/brief-main";

export default function Home() {
  return (
    <main className="pt-10 md:pt-20 pb-24 md:pb-28 min-h-screen bg-gray-100 flex md:gap-4 flex-col //row-start-2 justify-start m-auto items-center lg:w-[900px] px-2 md:px-6 md:rounded-2xl">
      <Suspense fallback={<div>Загрузка...</div>}>
        <BriefMain />
      </Suspense>
    </main>
  );
}
