import type { HierarchyNode } from './HierarchyTree';

// Transform flat API response to hierarchical structure
interface FlatNode {
  memberid: number;
  Name: string;
  parentid: string | null;
  parentname: string | null;
}

const apiResponse: FlatNode[] = [
  { memberid: 2, Name: "sparklms", parentid: null, parentname: null },
  { memberid: 3, Name: "TXCABCSO_MN", parentid: "2", parentname: "sparklms" },
  { memberid: 4, Name: "TitleCABCSO_MN", parentid: "2", parentname: "sparklms" },
  { memberid: 5, Name: "TXCABCSO_BW20", parentid: "2", parentname: "sparklms" },
  { memberid: 6, Name: "InstallProduct", parentid: "2", parentname: "sparklms" },
  { memberid: 7, Name: "LOC_MN", parentid: "2", parentname: "sparklms" },
  { memberid: 8, Name: "PDTN_15", parentid: "2", parentname: "sparklms" },
  { memberid: 9, Name: "Equal Payments", parentid: "2", parentname: "sparklms" },
  { memberid: 10, Name: "ATMND50", parentid: "2", parentname: "sparklms" },
  { memberid: 11, Name: "TXCABCSO_BW", parentid: "2", parentname: "sparklms" },
  { memberid: 12, Name: "TitleCABCSO_MN18", parentid: "2", parentname: "sparklms" },
  { memberid: 13, Name: "SplitFeePaymentProduct", parentid: "2", parentname: "sparklms" },
  { memberid: 14, Name: "CABTypeProduct", parentid: "2", parentname: "sparklms" },
  { memberid: 15, Name: "PDMO_MN_400", parentid: "2", parentname: "sparklms" },
  { memberid: 16, Name: "ScheduleIntallType%", parentid: "2", parentname: "sparklms" },
  { memberid: 17, Name: "PDMO_WK_400", parentid: "2", parentname: "sparklms" },
  { memberid: 18, Name: "SchedInstallProduct", parentid: "2", parentname: "sparklms" },
  { memberid: 19, Name: "PDMO_BWSM_400", parentid: "2", parentname: "sparklms" },
  { memberid: 20, Name: "PDIN_MN_21", parentid: "2", parentname: "sparklms" },
  { memberid: 21, Name: "PDIA_MN_21", parentid: "2", parentname: "sparklms" },
  { memberid: 22, Name: "CAB_NEW", parentid: "2", parentname: "sparklms" },
  { memberid: 23, Name: "AutoTitleCABProduct", parentid: "2", parentname: "sparklms" },
  { memberid: 24, Name: "CAB2024", parentid: "2", parentname: "sparklms" },
  { memberid: 25, Name: "PDMN_MN_50", parentid: "2", parentname: "sparklms" },
  { memberid: 26, Name: "PDMI_MN_25", parentid: "2", parentname: "sparklms" },
  { memberid: 27, Name: "PDWI_MN_5", parentid: "2", parentname: "sparklms" },
  { memberid: 28, Name: "PDSC_MN_8.75", parentid: "2", parentname: "sparklms" },
  { memberid: 29, Name: "CAB/CSO19", parentid: "2", parentname: "sparklms" },
  { memberid: 30, Name: "CAB_NEW2", parentid: "2", parentname: "sparklms" },
  { memberid: 31, Name: "EggvyProduct_Auto_Title", parentid: "2", parentname: "sparklms" },
  { memberid: 32, Name: "EggvyProduct", parentid: "2", parentname: "sparklms" },
  { memberid: 33, Name: "string", parentid: "2", parentname: "sparklms" },
  { memberid: 34, Name: "TitleCABMonthly40", parentid: "4", parentname: "TitleCABCSO_MN" },
  { memberid: 35, Name: "CABMonthly40", parentid: "3", parentname: "TXCABCSO_MN" },
  { memberid: 36, Name: "CABBiWeekly20", parentid: "5", parentname: "TXCABCSO_BW20" },
  { memberid: 37, Name: "CABBiWeeklyAddLeads", parentid: "5", parentname: "TXCABCSO_BW20" },
  { memberid: 38, Name: "CABBiWeekly25", parentid: "11", parentname: "TXCABCSO_BW" },
  { memberid: 39, Name: "TitleCABMonthly18", parentid: "12", parentname: "TitleCABCSO_MN18" },
  { memberid: 40, Name: "TestCampaign", parentid: "7", parentname: "LOC_MN" },
  { memberid: 41, Name: "TESTCampUpdate", parentid: "6", parentname: "InstallProduct" },
  { memberid: 42, Name: "CabTypeCampWeekly", parentid: "14", parentname: "CABTypeProduct" },
  { memberid: 43, Name: "CabTypeCampMonth", parentid: "14", parentname: "CABTypeProduct" },
  { memberid: 44, Name: "SplitFeePaymentWeekly", parentid: "13", parentname: "SplitFeePaymentProduct" },
  { memberid: 45, Name: "ScheduleInstallCampMonthl", parentid: "18", parentname: "SchedInstallProduct" },
  { memberid: 46, Name: "ScheduleIntallType%Monthl", parentid: "16", parentname: "ScheduleIntallType%" },
  { memberid: 47, Name: "ScheduleInstallCampWeekly", parentid: "18", parentname: "SchedInstallProduct" },
  { memberid: 48, Name: "ScheduleIntallType%Weekly", parentid: "16", parentname: "ScheduleIntallType%" },
  { memberid: 49, Name: "CPCABMonthly40", parentid: "13", parentname: "SplitFeePaymentProduct" },
  { memberid: 50, Name: "LendMeCampaign", parentid: "6", parentname: "InstallProduct" },
  { memberid: 51, Name: "PaydayCampaign", parentid: "8", parentname: "PDTN_15" },
  { memberid: 52, Name: "CPCABBiWeekly25", parentid: "4", parentname: "TitleCABCSO_MN" },
  { memberid: 53, Name: "EqualCampaign", parentid: "9", parentname: "Equal Payments" },
  { memberid: 54, Name: "SplitFeePaymentMonthly", parentid: "13", parentname: "SplitFeePaymentProduct" },
  { memberid: 55, Name: "CAM19", parentid: "29", parentname: "CAB/CSO19" },
  { memberid: 56, Name: "CAB_NEW_CAM", parentid: "22", parentname: "CAB_NEW" },
  { memberid: 57, Name: "CMPMO_MN_400", parentid: "15", parentname: "PDMO_MN_400" },
  { memberid: 58, Name: "CMPWI_WK_5", parentid: "27", parentname: "PDWI_MN_5" },
  { memberid: 59, Name: "CMPSC_MN_8_75", parentid: "28", parentname: "PDSC_MN_8.75" },
  { memberid: 60, Name: "CMPSC_BWSM_8_75", parentid: "28", parentname: "PDSC_MN_8.75" },
  { memberid: 61, Name: "CMPMN_MN_50", parentid: "25", parentname: "PDMN_MN_50" },
  { memberid: 62, Name: "CMPMO_WK_400", parentid: "17", parentname: "PDMO_WK_400" },
  { memberid: 63, Name: "CMPSC_WK_8_75", parentid: "28", parentname: "PDSC_MN_8.75" },
  { memberid: 64, Name: "CMPMN_BWSM_50", parentid: "25", parentname: "PDMN_MN_50" },
  { memberid: 65, Name: "CMPMN_WK_50", parentid: "25", parentname: "PDMN_MN_50" },
  { memberid: 66, Name: "CMPMI_BWSM_25", parentid: "26", parentname: "PDMI_MN_25" },
  { memberid: 67, Name: "CMPMI_MN_25", parentid: "26", parentname: "PDMI_MN_25" },
  { memberid: 68, Name: "CMPMI_WK_25", parentid: "26", parentname: "PDMI_MN_25" },
  { memberid: 69, Name: "CMPIA_WK_21", parentid: "21", parentname: "PDIA_MN_21" },
  { memberid: 70, Name: "CMPIA_BWSM_21", parentid: "21", parentname: "PDIA_MN_21" },
  { memberid: 71, Name: "CMPIA_MN_21", parentid: "21", parentname: "PDIA_MN_21" },
  { memberid: 72, Name: "CMPIN_MN_21", parentid: "20", parentname: "PDIN_MN_21" },
  { memberid: 73, Name: "CMPWI_MN_5", parentid: "27", parentname: "PDWI_MN_5" },
  { memberid: 74, Name: "CAM_NEW2_CAM2", parentid: "30", parentname: "CAB_NEW2" },
  { memberid: 75, Name: "CMPIN_BWSM_21", parentid: "20", parentname: "PDIN_MN_21" },
  { memberid: 76, Name: "CMPWI_BWSM_5", parentid: "27", parentname: "PDWI_MN_5" },
  { memberid: 77, Name: "CMPMO_BWSM_400", parentid: "19", parentname: "PDMO_BWSM_400" },
  { memberid: 78, Name: "EggvyCAMP", parentid: "32", parentname: "EggvyProduct" },
  { memberid: 79, Name: "EggvyAutoCampaign", parentid: "31", parentname: "EggvyProduct_Auto_Title" },
  { memberid: 80, Name: "CMPIN_WK_21", parentid: "20", parentname: "PDIN_MN_21" },
  { memberid: 81, Name: "CABMonthlyAddLeads", parentid: "23", parentname: "AutoTitleCABProduct" },
  { memberid: 82, Name: "CPReturnCABMonthly40", parentid: "23", parentname: "AutoTitleCABProduct" },
  { memberid: 83, Name: "Thanjsgiving Rebate", parentid: "47", parentname: "ScheduleInstallCampWeekly" },
  { memberid: 84, Name: "CABFeeDiscount", parentid: "38", parentname: "CABBiWeekly25" },
  { memberid: 85, Name: "Thanjsgiving Rebate", parentid: "42", parentname: "CabTypeCampWeekly" },
  { memberid: 86, Name: "Thanjsgiving Rebate", parentid: "43", parentname: "CabTypeCampMonth" },
  { memberid: 87, Name: "testRebate1", parentid: "35", parentname: "CABMonthly40" }
];

// Build hierarchy from flat data
function buildHierarchy(flatData: FlatNode[]): HierarchyNode[] {
  const map = new Map<string, HierarchyNode>();
  const roots: HierarchyNode[] = [];

  // Create all nodes
  flatData.forEach(item => {
    map.set(String(item.memberid), {
      id: String(item.memberid),
      name: item.Name,
      type: 'portfolio', // Will be determined by depth
      children: []
    });
  });

  // Build parent-child relationships
  flatData.forEach(item => {
    const node = map.get(String(item.memberid))!;
    
    if (item.parentid === null) {
      node.type = 'root';
      roots.push(node);
    } else {
      const parent = map.get(item.parentid);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(node);
      }
    }
  });

  // Assign types based on depth
  function assignTypes(node: HierarchyNode, depth: number) {
    if (depth === 0) node.type = 'root';
    else if (depth === 1) node.type = 'portfolio';
    else if (depth === 2) node.type = 'campaign';
    else node.type = 'offer';

    node.children?.forEach(child => assignTypes(child, depth + 1));
  }

  roots.forEach(root => assignTypes(root, 0));

  return roots;
}

export const hierarchyData = buildHierarchy(apiResponse);
