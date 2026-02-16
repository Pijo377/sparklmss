import type { RouteObject } from "react-router-dom";
import { DashboardPage } from "./pages";
import DashboardLayout from "./layout/DashboardLayout";
import DummyPage from "./pages/Dummy"; 
import CampaignConfigPage from "./pages/CampaignConfig";

export const dashboardRoutes: RouteObject = {
  path: "dashboard",
  element: <DashboardLayout />,
  children: [
    {
      index: true,
      element: <DashboardPage />,
    },
    // Add more dashboard routes here
     {
       path: "dummy", 
       element: <DummyPage title="Campaign Config" />,
    },
    {
       path: "dummy", 
       element: <DummyPage title="Campaign" />,
    },
     {
      path: "campaign-config",
      element: <CampaignConfigPage />,
    },
  ],
};
