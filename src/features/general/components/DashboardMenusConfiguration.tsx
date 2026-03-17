import DraggableConfig from "../ui/DraggableConfig";
import { DASHBOARD_MENUS } from "../config/generalconfig";

const DashboardMenusConfiguration = () => {
    return (
        <DraggableConfig
            title="Dashboard Menus Configuration (Drag and Drop)"
            initialData={DASHBOARD_MENUS}
            onSave={(data) => console.log("Saving Dashboard Menus Config:", data)}
        />
    );
};

export default DashboardMenusConfiguration;
