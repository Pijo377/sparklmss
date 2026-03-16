import DraggableConfig from "../ui/DraggableConfig";
import { INITIAL_QUEUES } from "../config/generalconfig";

const QueueConfiguration = () => {
    return (
        <DraggableConfig
            title="Queues Configuration"
            initialData={INITIAL_QUEUES}
            onSave={(data) => console.log("Saving Queue Config:", data)}
        />
    );
};

export default QueueConfiguration;
