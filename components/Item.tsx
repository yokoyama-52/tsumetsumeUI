import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ItemProps = {
    id: string;
};

export default function Item({
    id,
}: ItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable ({ id });

    const style = {
        transform: CSS.Transform.toString(
            transform
        ),
        transition,
        padding: "16px",
        marginBottom: "8px",
        border: "1px solid #ccc",
        background: "white",
        cursor: "grab",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
        >
            {id}
        </div>
    );
}

