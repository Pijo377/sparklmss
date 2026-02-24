import { HierarchyTree } from './HierarchyTree';
import { hierarchyData } from './data';

interface MappingPageProps {
  expandAll?: boolean;
}

const MappingPage = ({ expandAll }: MappingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50">

      <main className="relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.3] bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-10">
          <HierarchyTree data={hierarchyData} expandAll={expandAll} />
        </div>
      </main>
    </div>
  );
};

export default MappingPage;
