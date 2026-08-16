"use client";

import { useRef, useState } from "react";

import {
    DndContext,
    DragOverlay,
    type DragEndEvent,
    type DragMoveEvent,
    type DragStartEvent,
    type Modifier,
} from "@dnd-kit/core";
import { initItems, type SnackItem } from "@/data/initItems";
import { initBoxes } from "@/data/initBoxes";

import Button from "@/components/Button";
import Item from "../components/Item";
import MenuItem from "@/components/MenuItem";

type PlacedItem = SnackItem & {
    imageId: string;
    x: number;
    y: number;
}

type DropPosition = {
    x: number;
    y: number;
    isValid: boolean;
};

//表示上の縮尺を調整。実機での見え方に合わせて後から調整する。
const PIXELS_PER_CM = 12;
const GRID_SIZE = PIXELS_PER_CM;
const BOX_PADDING = 0;
const filterLabels = ["アレルギー", "新商品", "季節のおすすめ", "あまい", "しょっぱい"];

//移動時にスナップを適用
const snaptoGrid: Modifier = ({ transform }) => ({
    ...transform,
    x: Math.round(transform.x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(transform.y / GRID_SIZE) * GRID_SIZE,
});

//?
const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min),max);
};

//はみ出しを検知
const rectanglesOverlap = (
    left: number,
    top: number,
    width: number,
    height: number,
    other: PlacedItem,
) => {
    const otherWidth = other.widthCm * PIXELS_PER_CM;
    const otherHeight = other.depthCm * PIXELS_PER_CM;

    return left < other.x + otherWidth && left + width > other.x && top < other.y + otherHeight && top + height > other.y;
};

//配置できる場所を探す
const findAvailablePosition = (
    placedItems: PlacedItem[],
    width: number,
    height: number,
    boxWidth: number,
    boxHeight: number,
) => {
    for (let y = BOX_PADDING; y <= boxHeight - height; y += GRID_SIZE) {
        for (let x = BOX_PADDING; x <= boxWidth - width; x += GRID_SIZE) {
            if (!placedItems.some((item) => rectanglesOverlap(x, y, width, height, item))) {
                return { x, y };
            }
        }
    }

    return null;
};

export default function Home(){
    const [items,setItems] = useState<PlacedItem[]>([]);//おかしのデータを持ってくるstate
    const [activeItemId, setActiveItemId] = useState<string | null>(null);
    const [isDropValid, setIsDropValid] = useState(true);
    const [placementMessage, setPlacementMessage] = useState("");
    const currentBox = initBoxes[0];
    const activeItem = items.find((item) => item.id === activeItemId);
    const snackTotal = items.reduce((total, item) => total + item.price, 0);
    const totalPrice = currentBox.price + snackTotal;
    
    const boxRef = useRef<HTMLDivElement>(null);
    
    //おかしを選ぶと箱に表示させる処理
    const addItem = (id: string) => {
        const selectedItem = initItems.find((item) => item.id === id);

        if (!selectedItem) return;

        const itemWidth = selectedItem.widthCm * PIXELS_PER_CM;
        const itemHeight = selectedItem.depthCm * PIXELS_PER_CM;
        const boxWidth = boxRef.current?.clientWidth ?? currentBox.widthCm * PIXELS_PER_CM;
        const boxHeight = boxRef.current?.clientHeight ?? currentBox.depthCm * PIXELS_PER_CM;
        const position = findAvailablePosition(items, itemWidth, itemHeight, boxWidth, boxHeight);

        if (!position) {
            setPlacementMessage("この箱には置ける空きがありません。");
            return;
        }

        setItems((prev) => [
            ...prev,
            {
                ...selectedItem,
                id: crypto.randomUUID(),
                imageId: selectedItem.id,
                ...position,
            },
        ]);
        setPlacementMessage("");
    };

    const getDropPosition = (id: string, delta: { x: number; y: number }): DropPosition | null => {
        const box = boxRef.current;
        const activeItem = items.find((item) => item.id === id);
        if (!box || !activeItem) return null;

        const itemWidth = activeItem.widthCm * PIXELS_PER_CM;
        const itemHeight = activeItem.depthCm * PIXELS_PER_CM;
        const maxX = Math.max(BOX_PADDING, box.clientWidth - BOX_PADDING - itemWidth);
        const maxY = Math.max(BOX_PADDING, box.clientHeight - BOX_PADDING - itemHeight);
        const x = clamp(Math.round((activeItem.x + delta.x) / GRID_SIZE) * GRID_SIZE, BOX_PADDING, maxX);
        const y = clamp(Math.round((activeItem.y + delta.y) / GRID_SIZE) * GRID_SIZE, BOX_PADDING, maxY);

        return {
            x,
            y,
            isValid: !items.some((item) => item.id !== id && rectanglesOverlap(x, y, itemWidth, itemHeight, item)),
        };
    };

    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveItemId(String(active.id));
        setIsDropValid(true);
        setPlacementMessage("");
    };

    const handleDragMove = ({ active, delta }: DragMoveEvent) => {
        const position = getDropPosition(String(active.id), delta);
        if (position) setIsDropValid(position.isValid);
    };

    // 他のお菓子と重なる位置には置かない。
    const handleDragEnd = ({ active, delta }:DragEndEvent) => {
        const position = getDropPosition(String(active.id), delta);

        if (position?.isValid) {
            setItems((currentItems) =>
                currentItems.map((item) =>
                    item.id === active.id ? { ...item, x: position.x, y: position.y } : item,
                ),
            );
        } else {
            setPlacementMessage("");//重なっている時のエラーメッセージ
        }

        setActiveItemId(null);
    };

    const handleDragCancel = () => {
        setActiveItemId(null);
        setIsDropValid(true);
    };
    return(
        <main className="container">

            <header className="header">
                <div>
                    <p className="headerLabel">TUMETUME</p>
                    <h1>シュミレーター</h1>
                </div>

                <div className="headerActions">
                    <button className="confirmButton" type="button">確認</button>
                    <Button variant="done">お会計へ</Button>
                </div>
            </header>

            
            <div className="layout">
                <aside className="sidebar">
                    <div className="sidebarTitle">
                        <p className="eyebrow">MENU</p>
                        <h2>おかしを選ぶ</h2>
                        <p>タップして箱に追加できます</p>
                    </div>

                    <div className="filterScroller" aria-label="おかしの絞り込み">
                        {filterLabels.map((label) => (
                            <button className="filterChip" key={label} type="button">
                                {label}
                            </button>
                        ))}
                    </div>

                    <ul className="menuList">
                        {initItems.map((item) => (
                            <li key={item.id}>
                                <MenuItem
                                    variant="menuItem"
                                    onClick={() => addItem(item.id)}
                                >
                                <div className="menuItemContent">
                                    <img
                                        src={`/images/${item.id}.png`}
                                        alt={item.name}
                                        className="menuImage"
                                        width={72}
                                        height={72}
                                    />
                                    <span className="menuItemName">{item.name}</span>
                                    <span className="menuItemSize">{item.widthCm} × {item.depthCm} cm</span>
                                </div>
                            </MenuItem>
                            </li>
                        ))}
                    </ul>
                    </aside>
                <section className="main">
                    <div className="workspaceHeader">
                        <button className="recommendButton" type="button">
                            おすすめ
                        </button>
                    </div>

                    <DndContext
                        onDragStart={handleDragStart}
                        onDragMove={handleDragMove}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                        modifiers={[snaptoGrid]}
                    >
                        <div className="boxCanvas">
                        <div
                            ref={boxRef}
                            className="boxArea"
                            data-drag-state={activeItemId ? (isDropValid ? "valid" : "invalid") : undefined}
                            style={{
                                width: `${currentBox.widthCm * PIXELS_PER_CM}px`,
                                height: `${currentBox.depthCm * PIXELS_PER_CM}px`,
                            }}
                        >
                                {items.map((item) => (
                                    <Item 
                                        key={item.id}
                                        id={item.id}
                                        imageId={item.imageId}
                                        text={item.name}
                                        x={item.x}
                                        y={item.y}
                                        widthPx={item.widthCm * PIXELS_PER_CM}
                                        heightPx={item.depthCm * PIXELS_PER_CM}
                                        isDropInvalid={item.id === activeItemId && !isDropValid}
                                    />
                                ))}
                            </div>
                        </div>
                        <DragOverlay dropAnimation={null}>
                            {activeItem ? (
                                <div
                                    className={`dragPreview ${isDropValid ? "" : "isInvalid"}`}
                                    style={{
                                        width: `${activeItem.widthCm * PIXELS_PER_CM}px`,
                                        height: `${activeItem.depthCm * PIXELS_PER_CM}px`,
                                    }}
                                >
                                    <img
                                        src={`/images/${activeItem.imageId}.png`}
                                        alt=""
                                        className="dragPreviewImage"
                                    />
                                    <span>{activeItem.name}</span>
                                </div>
                            ) : null}
                        </DragOverlay>
                        <p className={`dragHint ${activeItemId ? (isDropValid ? "isValid" : "isInvalid") : ""}`} aria-live="polite">
                            {activeItemId
                                ? isDropValid
                                    ? "配置できます"
                                    : "他のお菓子と重なっています"
                                : ""}
                        </p>
                    </DndContext>

                    {placementMessage && <p className="placementMessage" role="status">{placementMessage}</p>}

                    <div className="summaryPanel" aria-label="箱と合計金額">
                        <div className="summaryRow">
                            <span>箱のサイズ</span>
                            <strong>{currentBox.widthCm} × {currentBox.depthCm} cm</strong>
                        </div>
                        <div className="summaryRow summaryTotal">
                            <span>合計</span>
                            <strong>¥{totalPrice.toLocaleString()}</strong>
                        </div>
                        <p>選んだおかし {items.length} 個</p>
                    </div>
                </section>
                    
                
                    
                    
            </div>
        </main>
    );
}
