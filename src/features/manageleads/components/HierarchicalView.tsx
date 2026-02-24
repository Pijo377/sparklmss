import { useState } from "react";
import { ChevronRight, Folder, FolderOpen, File } from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────
export interface HierarchyNode {
    id: string;
    label: string;
    children?: HierarchyNode[];
}

/** Shape of each row coming from the API's `NewDataSet.Table` array */
interface ApiTableRow {
    memberid: string;
    Name: string;
    parentid?: string;
    parentname?: string;
}

// ─── Hardcoded API data (same shape as the real response) ───────────────────────
const apiTableData: ApiTableRow[] = [
    { memberid: "2", Name: "sparklms" },
    { memberid: "3", Name: "TXCABCSO_BW", parentid: "2", parentname: "sparklms" },
    { memberid: "4", Name: "TXCABCSO_MN", parentid: "2", parentname: "sparklms" },
    { memberid: "5", Name: "TitleCABCSO_MN", parentid: "2", parentname: "sparklms" },
    { memberid: "6", Name: "TitleCABCSO_MN18", parentid: "2", parentname: "sparklms" },
    { memberid: "7", Name: "TXCABCSO_BW20", parentid: "2", parentname: "sparklms" },
    { memberid: "8", Name: "LOC_MN", parentid: "2", parentname: "sparklms" },
    { memberid: "9", Name: "InstallProduct", parentid: "2", parentname: "sparklms" },
    { memberid: "10", Name: "PDTN_15", parentid: "2", parentname: "sparklms" },
    { memberid: "11", Name: "ATMND50", parentid: "2", parentname: "sparklms" },
    { memberid: "12", Name: "Equal Payments", parentid: "2", parentname: "sparklms" },
    { memberid: "13", Name: "SplitFeePaymentProduct", parentid: "2", parentname: "sparklms" },
    { memberid: "14", Name: "CABTypeProduct", parentid: "2", parentname: "sparklms" },
    { memberid: "15", Name: "SchedInstallProduct", parentid: "2", parentname: "sparklms" },
    { memberid: "16", Name: "ScheduleIntallType%", parentid: "2", parentname: "sparklms" },
    { memberid: "17", Name: "AutoTitleCABProduct", parentid: "2", parentname: "sparklms" },
    { memberid: "18", Name: "CAB/CSO19", parentid: "2", parentname: "sparklms" },
    { memberid: "19", Name: "CAB_NEW", parentid: "2", parentname: "sparklms" },
    { memberid: "20", Name: "CAB_NEW2", parentid: "2", parentname: "sparklms" },
    { memberid: "21", Name: "CAB2024", parentid: "2", parentname: "sparklms" },
    { memberid: "22", Name: "PDMO_MN_400", parentid: "2", parentname: "sparklms" },
    { memberid: "23", Name: "PDMO_WK_400", parentid: "2", parentname: "sparklms" },
    { memberid: "24", Name: "PDMO_BWSM_400", parentid: "2", parentname: "sparklms" },
    { memberid: "25", Name: "PDAR_MN_17", parentid: "2", parentname: "sparklms" },
    { memberid: "26", Name: "PDIN_MN_21", parentid: "2", parentname: "sparklms" },
    { memberid: "27", Name: "PDIA_MN_21", parentid: "2", parentname: "sparklms" },
    { memberid: "28", Name: "PDMI_MN_25", parentid: "2", parentname: "sparklms" },
    { memberid: "29", Name: "PDMN_MN_50", parentid: "2", parentname: "sparklms" },
    { memberid: "30", Name: "PDSC_MN_8.75", parentid: "2", parentname: "sparklms" },
    { memberid: "31", Name: "PDWI_MN_5", parentid: "2", parentname: "sparklms" },
    { memberid: "32", Name: "EggvyProduct", parentid: "2", parentname: "sparklms" },
    { memberid: "33", Name: "CSO2025julTesting", parentid: "2", parentname: "sparklms" },
    { memberid: "34", Name: "CABBiWeekly25", parentid: "3", parentname: "TXCABCSO_BW" },
    { memberid: "35", Name: "CABMonthly40", parentid: "4", parentname: "TXCABCSO_MN" },
    { memberid: "36", Name: "TestCampaign", parentid: "4", parentname: "TXCABCSO_MN" },
    { memberid: "37", Name: "CPCABBiWeekly25", parentid: "5", parentname: "TitleCABCSO_MN" },
    { memberid: "38", Name: "TitleCABMonthly40", parentid: "5", parentname: "TitleCABCSO_MN" },
    { memberid: "39", Name: "TitleCABMonthly18", parentid: "6", parentname: "TitleCABCSO_MN18" },
    { memberid: "40", Name: "CABBiWeekly20", parentid: "7", parentname: "TXCABCSO_BW20" },
    { memberid: "41", Name: "CABBiWeeklyAddLeads", parentid: "7", parentname: "TXCABCSO_BW20" },
    { memberid: "42", Name: "TESTCampUpdate", parentid: "9", parentname: "InstallProduct" },
    { memberid: "43", Name: "LendMeCampaign", parentid: "9", parentname: "InstallProduct" },
    { memberid: "44", Name: "PaydayCampaign", parentid: "10", parentname: "PDTN_15" },
    { memberid: "45", Name: "CN_TXCABCSO_Test1", parentid: "11", parentname: "ATMND50" },
    { memberid: "46", Name: "TestCampaign", parentid: "11", parentname: "ATMND50" },
    { memberid: "47", Name: "TestAutoCampaign", parentid: "11", parentname: "ATMND50" },
    { memberid: "48", Name: "test_Cam_UPdate", parentid: "17", parentname: "AutoTitleCABProduct" },
    { memberid: "49", Name: "EqualCampaign", parentid: "12", parentname: "Equal Payments" },
    { memberid: "50", Name: "CPCABMonthly40", parentid: "13", parentname: "SplitFeePaymentProduct" },
    { memberid: "51", Name: "SplitFeePaymentWeekly", parentid: "13", parentname: "SplitFeePaymentProduct" },
    { memberid: "52", Name: "SplitFeePaymentMonthly", parentid: "13", parentname: "SplitFeePaymentProduct" },
    { memberid: "53", Name: "CabTypeCampWeekly", parentid: "14", parentname: "CABTypeProduct" },
    { memberid: "54", Name: "CabTypeCampMonth", parentid: "14", parentname: "CABTypeProduct" },
    { memberid: "55", Name: "ScheduleInstallCampWeekly", parentid: "15", parentname: "SchedInstallProduct" },
    { memberid: "56", Name: "ScheduleInstallCampMonthl", parentid: "15", parentname: "SchedInstallProduct" },
    { memberid: "57", Name: "ScheduleIntallType%Weekly", parentid: "16", parentname: "ScheduleIntallType%" },
    { memberid: "58", Name: "ScheduleIntallType%Monthl", parentid: "16", parentname: "ScheduleIntallType%" },
    { memberid: "59", Name: "CAM19", parentid: "18", parentname: "CAB/CSO19" },
    { memberid: "60", Name: "CAB_NEW_CAM", parentid: "19", parentname: "CAB_NEW" },
    { memberid: "61", Name: "CAM_NEW2_CAM2", parentid: "20", parentname: "CAB_NEW2" },
    { memberid: "62", Name: "CABMonthlyAddLeads", parentid: "21", parentname: "CAB2024" },
    { memberid: "63", Name: "CSO2024", parentid: "21", parentname: "CAB2024" },
    { memberid: "64", Name: "EggvyAutoCampaign", parentid: "21", parentname: "CAB2024" },
    { memberid: "65", Name: "CMPMO_MN_400", parentid: "22", parentname: "PDMO_MN_400" },
    { memberid: "66", Name: "CMPMO_WK_400", parentid: "23", parentname: "PDMO_WK_400" },
    { memberid: "67", Name: "CMPMO_BWSM_400", parentid: "24", parentname: "PDMO_BWSM_400" },
    { memberid: "68", Name: "CMPAR_MN_17", parentid: "25", parentname: "PDAR_MN_17" },
    { memberid: "69", Name: "CMPAR_BWSM_17", parentid: "25", parentname: "PDAR_MN_17" },
    { memberid: "70", Name: "CMPAR_WK_17", parentid: "25", parentname: "PDAR_MN_17" },
    { memberid: "71", Name: "CMPIN_MN_21", parentid: "26", parentname: "PDIN_MN_21" },
    { memberid: "72", Name: "CMPIN_BWSM_21", parentid: "26", parentname: "PDIN_MN_21" },
    { memberid: "73", Name: "CMPIN_WK_21", parentid: "26", parentname: "PDIN_MN_21" },
    { memberid: "74", Name: "CMPIA_MN_21", parentid: "27", parentname: "PDIA_MN_21" },
    { memberid: "75", Name: "CMPIA_BWSM_21", parentid: "27", parentname: "PDIA_MN_21" },
    { memberid: "76", Name: "CMPIA_WK_21", parentid: "27", parentname: "PDIA_MN_21" },
    { memberid: "77", Name: "CMPMI_MN_25", parentid: "28", parentname: "PDMI_MN_25" },
    { memberid: "78", Name: "CMPMI_BWSM_25", parentid: "28", parentname: "PDMI_MN_25" },
    { memberid: "79", Name: "CMPMI_WK_25", parentid: "28", parentname: "PDMI_MN_25" },
    { memberid: "80", Name: "CMPMN_MN_50", parentid: "29", parentname: "PDMN_MN_50" },
    { memberid: "81", Name: "CMPMN_BWSM_50", parentid: "29", parentname: "PDMN_MN_50" },
    { memberid: "82", Name: "CMPMN_WK_50", parentid: "29", parentname: "PDMN_MN_50" },
    { memberid: "83", Name: "TestCampaign", parentid: "30", parentname: "PDSC_MN_8.75" },
    { memberid: "84", Name: "CMPSC_MN_8_75", parentid: "30", parentname: "PDSC_MN_8.75" },
    { memberid: "85", Name: "CMPSC_BWSM_8_75", parentid: "30", parentname: "PDSC_MN_8.75" },
    { memberid: "86", Name: "CMPSC_WK_8_75", parentid: "30", parentname: "PDSC_MN_8.75" },
    { memberid: "87", Name: "TitleCABMonthly50", parentid: "31", parentname: "PDWI_MN_5" },
    { memberid: "88", Name: "TitleCABMonthly500", parentid: "31", parentname: "PDWI_MN_5" },
    { memberid: "89", Name: "CMPWI_MN_5", parentid: "31", parentname: "PDWI_MN_5" },
    { memberid: "90", Name: "CMPWI_BWSM_5", parentid: "31", parentname: "PDWI_MN_5" },
    { memberid: "91", Name: "CMPWI_WK_5", parentid: "31", parentname: "PDWI_MN_5" },
    { memberid: "92", Name: "EggvyCAMP", parentid: "32", parentname: "EggvyProduct" },
    { memberid: "93", Name: "CPReturnCABMonthly40", parentid: "33", parentname: "CSO2025julTesting" },
    { memberid: "94", Name: "CPReturnCABBiWeekly25", parentid: "33", parentname: "CSO2025julTesting" },
    { memberid: "95", Name: "TestCampaign", parentid: "33", parentname: "CSO2025julTesting" },
    { memberid: "96", Name: "CNPDTN_15", parentid: "33", parentname: "CSO2025julTesting" },
    { memberid: "97", Name: "testWEB", parentid: "33", parentname: "CSO2025julTesting" },
    { memberid: "98", Name: "CSOjul2025", parentid: "33", parentname: "CSO2025julTesting" },
    { memberid: "99", Name: "Thanjsgiving Rebate", parentid: "34", parentname: "CABBiWeekly25" },
    { memberid: "100", Name: "Thanjsgiving Rebate", parentid: "51", parentname: "SplitFeePaymentWeekly" },
    { memberid: "101", Name: "Thanjsgiving Rebate", parentid: "53", parentname: "CabTypeCampWeekly" },
    { memberid: "102", Name: "Thanjsgiving Rebate", parentid: "54", parentname: "CabTypeCampMonth" },
    { memberid: "103", Name: "Thanjsgiving Rebate", parentid: "57", parentname: "ScheduleIntallType%Weekly" },
    { memberid: "104", Name: "Thanksgiving Rebate", parentid: "66", parentname: "CMPMO_WK_400" },
    { memberid: "105", Name: "Thanksgiving Rebate", parentid: "67", parentname: "CMPMO_BWSM_400" },
];

// ─── Transform flat API rows → nested HierarchyNode tree ────────────────────────
function buildTree(rows: ApiTableRow[]): HierarchyNode {
    const nodeMap = new Map<string, HierarchyNode>();

    // 1. Create a HierarchyNode for every row
    for (const row of rows) {
        nodeMap.set(row.memberid, { id: row.memberid, label: row.Name });
    }

    // 2. Wire children to parents; track the root (no parentid)
    let root: HierarchyNode | null = null;

    for (const row of rows) {
        const node = nodeMap.get(row.memberid)!;
        if (row.parentid) {
            const parent = nodeMap.get(row.parentid);
            if (parent) {
                if (!parent.children) parent.children = [];
                parent.children.push(node);
            }
        } else {
            root = node;
        }
    }

    return root ?? { id: "empty", label: "No data" };
}

const hierarchyTreeData: HierarchyNode = buildTree(apiTableData);

// ─── Tree Node Card ─────────────────────────────────────────────────────────────
const CONNECTOR_WIDTH = 28;
const CONNECTOR_LEFT = 14;    // offset past rounded-xl (12px) so line drops from card bottom, not side
const LINE_COLOR = "#D1D5DB"; // slate-300
const CARD_HEIGHT = 46;       // border(1) + py-3(12) + text-sm lineH(20) + py-3(12) + border(1)
const CARD_CENTER = CARD_HEIGHT / 2; // vertical center of card where icon sits
const CARD_MARGIN_BOTTOM = 12; // spacing between sibling nodes

const LEVEL_BG: Record<number, string> = {
    0: "#FFFFFF",   // Pure white
    1: "#F9FAFB",   // Very light gray
    2: "#F3F4F6",   // Soft gray mix
    3: "#EDEEF1",   // Slightly darker gray
};

const getLevelBg = (level: number) => LEVEL_BG[level] ?? LEVEL_BG[3];

interface TreeNodeCardProps {
    node: HierarchyNode;
    level: number;
    defaultExpanded: boolean;
    isLast?: boolean;
}

const TreeNodeCard = ({ node, level, defaultExpanded, isLast = false }: TreeNodeCardProps) => {
    const [expanded, setExpanded] = useState(defaultExpanded);
    const hasChildren = node.children && node.children.length > 0;
    const isRoot = level === 0;

    return (
        <div className="relative" style={{
            paddingLeft: isRoot ? 0 : CONNECTOR_WIDTH,
            paddingTop: isRoot ? 0 : CARD_MARGIN_BOTTOM,
        }}>
            {/* Vertical trunk line — offset inward so it drops from below cards, not alongside */}
            {!isRoot && (
                <div
                    className="absolute"
                    style={{
                        left: CONNECTOR_LEFT,
                        top: 0,
                        width: 1,
                        backgroundColor: LINE_COLOR,
                        height: isLast
                            ? CARD_MARGIN_BOTTOM + CARD_CENTER
                            : "100%",
                    }}
                />
            )}

            {/* Horizontal branch — from vertical trunk to child card */}
            {!isRoot && (
                <div
                    className="absolute"
                    style={{
                        left: CONNECTOR_LEFT,
                        top: CARD_MARGIN_BOTTOM + CARD_CENTER,
                        width: CONNECTOR_WIDTH - CONNECTOR_LEFT + 1,
                        height: 1,
                        backgroundColor: LINE_COLOR,
                    }}
                />
            )}

            {/* Card */}
            <div
                onClick={() => hasChildren && setExpanded(!expanded)}
                style={{ backgroundColor: getLevelBg(level) }}
                className={`
                    flex items-center gap-3 px-4 py-3
                    border border-[#E6E8EC] rounded-xl
                    transition-all duration-200 ease-in-out
                    ${hasChildren ? "cursor-pointer" : "cursor-default"}
                    hover:shadow-md hover:border-slate-300
                `}
            >
                {/* Icon — folder (open/closed) for levels 0–2, file for level 3+ */}
                {level >= 3 ? (
                    <File size={16} className="text-blue-500 shrink-0" />
                ) : expanded ? (
                    <FolderOpen size={16} className={`shrink-0 ${level === 0 ? "text-amber-500" : level === 1 ? "text-indigo-500" : "text-emerald-500"}`} />
                ) : (
                    <Folder size={16} className={`shrink-0 ${level === 0 ? "text-amber-500" : level === 1 ? "text-indigo-500" : "text-emerald-500"}`} />
                )}

                {/* Label + count badge inline */}
                <span className={`text-sm ${level === 0 ? "font-semibold text-slate-900" : "font-medium text-slate-700"} inline-flex items-center gap-2`}>
                    {node.label}
                    {hasChildren && (
                        <span className="text-[11px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                            {node.children!.length}
                        </span>
                    )}
                </span>

                {/* Arrow — right side */}
                {hasChildren && (
                    <ChevronRight
                        size={16}
                        className={`ml-auto text-slate-400 shrink-0 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`}
                    />
                )}
            </div>

            {/* Bridge connector — drops from below card into children area */}
            {hasChildren && expanded && (
                <div
                    className="absolute"
                    style={{
                        left: (isRoot ? 0 : CONNECTOR_WIDTH) + CONNECTOR_LEFT,
                        top: (isRoot ? 0 : CARD_MARGIN_BOTTOM) + CARD_HEIGHT - 2,
                        height: 2,
                        width: 1,
                        backgroundColor: LINE_COLOR,
                        zIndex: 2,
                    }}
                />
            )}

            {/* Children with smooth animation */}
            <div
                className="overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: expanded ? `${(node.children?.length || 0) * 500}px` : "0px",
                    opacity: expanded ? 1 : 0,
                }}
            >
                {hasChildren && node.children!.map((child, index) => (
                    <TreeNodeCard
                        key={child.id}
                        node={child}
                        level={level + 1}
                        defaultExpanded={defaultExpanded}
                        isLast={index === node.children!.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};

// ─── Main Hierarchical View Component ───────────────────────────────────────────
const HierarchicalView = () => {
    const [allExpanded, setAllExpanded] = useState(false);
    const [expandKey, setExpandKey] = useState(0);

    return (
        <div className="w-full py-2">
            <div className="flex justify-end gap-2 mb-3">
                <button
                    onClick={() => { setAllExpanded(true); setExpandKey((k) => k + 1); }}
                    className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
                >
                    Expand All
                </button>
                <button
                    onClick={() => { setAllExpanded(false); setExpandKey((k) => k + 1); }}
                    className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-red-600 border border-red-400 hover:bg-red-50 rounded-md transition-colors"
                >
                    Collapse All
                </button>
            </div>
            <hr className="border-t border-slate-200 mb-4" />
            <div className="max-w-[1000px] mx-auto">
                <TreeNodeCard key={expandKey} node={hierarchyTreeData} level={0} defaultExpanded={allExpanded} />
            </div>
        </div>
    );
};

export default HierarchicalView;
