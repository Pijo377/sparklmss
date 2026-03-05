import { type RouteObject } from "react-router-dom";
import AddLeadsPage from "./Pages/AddLeadsPage";

export const addLeadsRoutes: RouteObject = {
    path: "/customers",
    children: [
        {
            path: "leads",
            element: <AddLeadsPage />,
        },
    ],
};
