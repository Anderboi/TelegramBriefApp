import BriefMain from "./components/brief-main";

export default function Home() {
  return (
    <main className="pt-20 pb-24 sm:pb-28 min-h-screen bg-gray-100 flex gap-4 flex-col //row-start-2 justify-start m-auto items-center lg:w-[900px] px-4 sm:px-6 sm:rounded-2xl">
      <BriefMain />
    </main>
  );
}
