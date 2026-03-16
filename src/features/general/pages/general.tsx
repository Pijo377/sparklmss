import { useState } from "react";
import { GENERAL_TABS } from "../config/generalconfig";
import QueueConfiguration from "../components/QueueConfiguration";
import CollectionAgentQueueConfiguration from "../components/CollectionAgentQueueConfiguration";
import DashboardMenusConfiguration from "../components/DashboardMenusConfiguration";
import NotesTopicConfiguration from "../components/NotesTopicConfiguration";
import TagsConfiguration from "../components/TagsConfiguration";

const General = () => {
    const [activeTab, setActiveTab] = useState("queue-config");

    const renderContent = () => {
        switch (activeTab) {
            case "queue-config":
                return <QueueConfiguration />;
            case "collection-agent-queue":
                return <CollectionAgentQueueConfiguration />;
            case "dashboard-menus-config":
                return <DashboardMenusConfiguration />;
            case "notes-topic":
                return <NotesTopicConfiguration />;
            case "tags":
                return <TagsConfiguration />;
            default: {
                const tab = GENERAL_TABS.find(t => t.id === activeTab);
                return (
                    <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl border border-slate-200 border-dashed p-12 text-center">
                        <div className="p-4 bg-slate-50 rounded-2xl mb-4">
                            {tab && <tab.icon size={48} className="text-slate-300" />}
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">{tab?.label}</h3>
                        <p className="text-sm text-slate-500 max-w-xs">
                            This configuration module is coming soon.
                        </p>
                    </div>
                );
            }
        }
    };

    return (
        <div className="flex flex-col gap-4 p-4 h-full font-display">
            <h1 className="text-2xl font-semibold text-slate-900 shrink-0">
                General
            </h1>

            {/* Main layout */}
            <div className="flex gap-4 items-stretch min-h-0 flex-1">

                {/* ── Left Sidebar: Categories ── */}
                <div className="w-48 xl:w-56 shrink-0 flex flex-col rounded-lg border bg-white shadow-sm overflow-hidden h-full">
                    <div className="p-4 border-b flex items-center gap-2">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                            Categories
                        </span>
                    </div>
                    <nav className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {GENERAL_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors
                                        ${isActive
                                            ? "bg-blue-600 text-white font-semibold shadow-sm"
                                            : "text-slate-600 hover:bg-slate-50"
                                        }
                                    `}
                                >
                                    <Icon size={16} className={isActive ? "text-white" : "text-slate-400"} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* ── Main Content Area ── */}
                <div className="flex-1 min-w-0 h-full overflow-hidden">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default General;
