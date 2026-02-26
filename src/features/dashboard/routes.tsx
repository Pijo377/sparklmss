import { type RouteObject } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import { DashboardPage } from "./pages";
import UsersTablePage from "./pages/UsersTablePage";
import CampaignConfig from "./pages/CampaignConfig";
import Portfolio from "@/features/manageleads/pages/portfolio";
import RebatePromoCode from "@/features/manageleads/pages/RebatePromoCode";
import Campaign from "@/features/manageleads/pages/Campaign";
import ProductPage from "@/features/manageleads/pages/Product";
import ScoringCostPage from "@/features/manageleads/pages/ScoringCost";
import PortfolioMapping from "@/features/manageleads/pages/PortfolioMapping";
import BlacklistManagement from "@/features/blacklist/pages/BlacklistManagement";
import DummyPage from "./pages/Dummy";

export const dashboardRoutes: RouteObject = {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
        { index: true, element: <DashboardPage /> },
        { path: "users", element: <UsersTablePage /> },
        { path: "campaign-config", element: <CampaignConfig /> },
        { path: "leads/portfolio", element: <Portfolio /> },
        { path: "dummy", element: <DummyPage title="Campaign" /> },
        { path: "activity-tab", element: <DummyPage title="Activity" /> },
        { path: "vitals-tab", element: <DummyPage title="Vitals" /> },
        { path: "leads/product", element: <ProductPage /> },
        { path: "leads/rebate", element: <RebatePromoCode /> },
        { path: "leads/campaign", element: <Campaign /> },
        { path: "leads/mapping", element: <PortfolioMapping /> },
        { path: "leads/blacklist", element: <BlacklistManagement /> },
        { path: "leads/lead", element: <DummyPage title="Lead" /> },
        { path: "leads/scoring", element: <ScoringCostPage /> },
        { path: "transaction/approve", element: <DummyPage title="Approve Loans" /> },
        { path: "transaction/credits", element: <DummyPage title="Pending Credits" /> },
        { path: "transaction/debits", element: <DummyPage title="Pending Debits" /> },
        { path: "transaction/create-ach", element: <DummyPage title="Create ACH File" /> },
        { path: "transaction/return-file", element: <DummyPage title="Return File Processing" /> },
        { path: "profile/user-profile", element: <DummyPage title="Manage User Profile" /> },
        { path: "profile/user-menu", element: <DummyPage title="Manage User Menu" /> },
        { path: "profile/password", element: <DummyPage title="Change Password" /> },
        { path: "config/documents", element: <DummyPage title="Documents" /> },
        { path: "config/email", element: <DummyPage title="Email" /> },
        { path: "config/sms", element: <DummyPage title="SMS" /> },
        { path: "config/ach-file", element: <DummyPage title="ACH File" /> },
        { path: "config/ach-provider", element: <DummyPage title="ACH Provider" /> },
        { path: "config/bureau", element: <DummyPage title="Bureau" /> },
        { path: "config/auto-origination", element: <DummyPage title="Auto Origination" /> },
        { path: "config/underwriting", element: <DummyPage title="Underwriting" /> },
        { path: "config/general", element: <DummyPage title="General" /> },
        { path: "config/quick-links", element: <DummyPage title="Quick Links" /> },
        { path: "reporting/overview", element: <DummyPage title="Reporting" /> },
        { path: "quick-link/main", element: <DummyPage title="Quick Link" /> },
    ],
};
