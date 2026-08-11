"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ItemProps = {
    id: string;
    imageId: string;
    text: string;
    x: number;
    y: number;
    widthPx: number;
    heightPx: number;
    isDropInvalid: boolean;
    isSelected: boolean;
    onSelect: () => void;
};

export default function Item({
    id,
    imageId,
    text,
    x,
    y,
    widthPx,
    heightPx,
    isDropInvalid,
    isSelected,
    onSelect,
}: ItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        isDragging,
    } = useSortable ({ id });

    const style = {
        position: "absolute" as const,
        left: `${x}px`,
        top: `${y}px`,
        width: `${widthPx}px`,
        height: `${heightPx}px`,
        transform: CSS.Transform.toString(
            transform
        ),
        transition: isDragging ? "none" : "left 0.15s, top 0.15s",
        zIndex: isDragging ? 10 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`item ${isDragging ? "isDragging" : ""} ${isDropInvalid ? "isDropInvalid" : ""} ${isSelected ? "isSelected" : ""}`}
            {...attributes}
            {...listeners}
            aria-pressed={isSelected}
            onPointerDownCapture={onSelect}
        >
            <img
                src={`/images/${imageId}.png`}
                alt={text}
                className="itemImage"
            />
            <p className="itemName">{text}</p>
        </div>
    );
}
