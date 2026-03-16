import DraggableConfig from "../ui/DraggableConfig";
import { COLLECTION_AGENT_QUEUES } from "../config/generalconfig";

const CollectionAgentQueueConfiguration = () => {
    return (
        <DraggableConfig
            title="Collection Agent Queues Configuration"
            initialData={COLLECTION_AGENT_QUEUES}
            onSave={(data) => console.log("Saving Collection Agent Queue Config:", data)}
        />
    );
};

export default CollectionAgentQueueConfiguration;
