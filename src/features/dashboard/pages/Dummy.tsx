export default function DummyPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        {/* Changed 3x1 to 3xl */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <p className="text-gray-500">This page is under developments</p>
      </div>
    </div>
  );
}