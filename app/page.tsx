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
    xCm: number;
    yCm: number;
}
type DropPosition = {
    xCm: number;
    yCm: number;
    isValid: boolean;
    isOutside: boolean;
};

type BoxCandidate = {
    boxIndex: number;
    position: DropPosition;
};

/** 箱とお菓子の表示縮尺。箱が変わっても大きさを変えない。 */
const PIXELS_PER_CM = 12;
const GRID_CM = 1;
const BOX_PADDING = 0;
const filterLabels = ["アレルギー", "新商品", "季節のおすすめ", "あまい", "しょっぱい"];

const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min),max);
};

const getBoxExpansionOffset = (fromBoxIndex: number, toBoxIndex: number) => {
    const fromBox = initBoxes[fromBoxIndex];
    const toBox = initBoxes[toBoxIndex];

    return {
        xCm: Math.floor((toBox.widthCm - fromBox.widthCm) / 2),
        yCm: Math.floor((toBox.depthCm - fromBox.depthCm) / 2),
    };
};

const rectanglesOverlap = (
    left: number,
    top: number,
    width: number,
    height: number,
    other: PlacedItem,
) => {
    return left < other.xCm + other.widthCm && left + width > other.xCm
        && top < other.yCm + other.depthCm && top + height > other.yCm;
};

const findAvailablePosition = (
    placedItems: PlacedItem[],
    width: number,
    height: number,
    boxWidth: number,
    boxHeight: number,
) => {
    for (let y = BOX_PADDING; y <= boxHeight - height; y += GRID_CM) {
        for (let x = BOX_PADDING; x <= boxWidth - width; x += GRID_CM) {
            if (!placedItems.some((item) => rectanglesOverlap(x, y, width, height, item))) {
                return { xCm: x, yCm: y };
            }
        }
    }

    return null;
};

export default function Home(){
    const [items,setItems] = useState<PlacedItem[]>([]);//おかしのデータを持ってくるstate
    const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
    const [activeItemId, setActiveItemId] = useState<string | null>(null);
    const [isDropValid, setIsDropValid] = useState(true);
    const [isOutsideBox, setIsOutsideBox] = useState(false);
    const [isBoxLimitReached, setIsBoxLimitReached] = useState(false);
    const [candidateBoxIndex, setCandidateBoxIndex] = useState<number | null>(null);
    const [shrinkCandidateIndex, setShrinkCandidateIndex] = useState<number | null>(null);
    const [placementMessage, setPlacementMessage] = useState("");
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
    const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
    const currentBox = initBoxes[currentBoxIndex];
    const activeItem = items.find((item) => item.id === activeItemId);
    const selectedItems = items.filter((item) => selectedItemIds.includes(item.id));
    const snackTotal = items.reduce((total, item) => total + item.price, 0);
    const totalPrice = currentBox.price + snackTotal;

    const currentBoxIndexRef = useRef(0);
    const dragScaleRef = useRef(PIXELS_PER_CM);
    const candidateBox = candidateBoxIndex === null ? null : initBoxes[candidateBoxIndex];
    const shrinkCandidateBox = shrinkCandidateIndex === null ? null : initBoxes[shrinkCandidateIndex];
    const previewBox = isOutsideBox ? candidateBox : shrinkCandidateBox;

    const snapToGrid: Modifier = ({ transform }) => {
        const scale = dragScaleRef.current;

        return {
            ...transform,
            x: Math.round(transform.x / scale) * scale,
            y: Math.round(transform.y / scale) * scale,
        };
    };

    //箱の大きさを変更する。お菓子がはみ出たら自動で箱が大きくなる
    const changeToBox = (targetBoxIndex: number) => {
        const currentBoxIndex = currentBoxIndexRef.current;
        if (targetBoxIndex === currentBoxIndex || targetBoxIndex < 0 || targetBoxIndex >= initBoxes.length) return false;

        const offset = getBoxExpansionOffset(currentBoxIndex, targetBoxIndex);
        currentBoxIndexRef.current = targetBoxIndex;
        setCurrentBoxIndex(targetBoxIndex);
        setItems((currentItems) => currentItems.map((item) => ({
            ...item,
            xCm: item.xCm + offset.xCm,
            yCm: item.yCm + offset.yCm,
        })));
        const targetBox = initBoxes[targetBoxIndex];
        setPlacementMessage(`${targetBox.name}（${targetBox.widthCm} × ${targetBox.depthCm} cm）に変更しました。`);
        return true;
    };

    //おかしを選ぶと箱に表示させる処理
    const addItem = (id: string) => {
        const selectedItem = initItems.find((item) => item.id === id);

        if (!selectedItem) return;

        let targetBoxIndex = currentBoxIndexRef.current;
        let targetBox = initBoxes[targetBoxIndex];
        let position = findAvailablePosition(
            items,
            selectedItem.widthCm,
            selectedItem.depthCm,
            targetBox.widthCm,
            targetBox.depthCm,
        );

        while (!position && targetBoxIndex < initBoxes.length - 1) {
            targetBoxIndex += 1;
            targetBox = initBoxes[targetBoxIndex];
            position = findAvailablePosition(
                items,
                selectedItem.widthCm,
                selectedItem.depthCm,
                targetBox.widthCm,
                targetBox.depthCm,
            );
        }

        if (!position) {
            setPlacementMessage("保存されている箱には置ける空きがありません。");
            return;
        }

        if (targetBoxIndex !== currentBoxIndexRef.current) {
            currentBoxIndexRef.current = targetBoxIndex;
            setCurrentBoxIndex(targetBoxIndex);
            setPlacementMessage(`${targetBox.name}（${targetBox.widthCm} × ${targetBox.depthCm} cm）に変更しました。`);
        } else {
            setPlacementMessage("");
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
    };

    const getDropPosition = (
        id: string,
        delta: { x: number; y: number },
        boxIndex = currentBoxIndexRef.current,
        offset = { xCm: 0, yCm: 0 },
    ): DropPosition | null => {
        const activeItem = items.find((item) => item.id === id);
        if (!activeItem) return null;

        const box = initBoxes[boxIndex];
        const maxX = Math.max(BOX_PADDING, box.widthCm - BOX_PADDING - activeItem.widthCm);
        const maxY = Math.max(BOX_PADDING, box.depthCm - BOX_PADDING - activeItem.depthCm);
        const rawX = Math.round(activeItem.xCm + delta.x / dragScaleRef.current) + offset.xCm;
        const rawY = Math.round(activeItem.yCm + delta.y / dragScaleRef.current) + offset.yCm;
        const x = clamp(rawX, BOX_PADDING, maxX);
        const y = clamp(rawY, BOX_PADDING, maxY);

        return {
            xCm: x,
            yCm: y,
            isValid: !items.some((item) => item.id !== id && rectanglesOverlap(
                x,
                y,
                activeItem.widthCm,
                activeItem.depthCm,
                { ...item, xCm: item.xCm + offset.xCm, yCm: item.yCm + offset.yCm },
            )),
            isOutside: rawX < BOX_PADDING || rawY < BOX_PADDING
                || rawX + activeItem.widthCm > box.widthCm || rawY + activeItem.depthCm > box.depthCm,
        };
    };

    const findBoxCandidate = (id: string, delta: { x: number; y: number }): BoxCandidate | null => {
        const currentIndex = currentBoxIndexRef.current;

        for (let boxIndex = currentIndex + 1; boxIndex < initBoxes.length; boxIndex += 1) {
            const position = getDropPosition(
                id,
                delta,
                boxIndex,
                getBoxExpansionOffset(currentIndex, boxIndex),
            );

            if (position && !position.isOutside && position.isValid) {
                return { boxIndex, position };
            }
        }

        return null;
    };

    const exceedsLargestBox = (id: string, delta: { x: number; y: number }) => {
        const currentIndex = currentBoxIndexRef.current;
        const largestBoxIndex = initBoxes.length - 1;
        const position = getDropPosition(
            id,
            delta,
            largestBoxIndex,
            getBoxExpansionOffset(currentIndex, largestBoxIndex),
        );

        return Boolean(position?.isOutside);
    };

    //より小さい箱に配置できないかを調べる。中央に寄っていないと適用できないため調整が必要。
    const findSmallerBox = () => {
        const currentIndex = currentBoxIndexRef.current;

        for (let boxIndex = 0; boxIndex < currentIndex; boxIndex += 1) {
            const box = initBoxes[boxIndex];
            const offset = getBoxExpansionOffset(currentIndex, boxIndex);
            const fits = items.every((item) => (
                item.xCm + offset.xCm >= BOX_PADDING
                && item.yCm + offset.yCm >= BOX_PADDING
                && item.xCm + offset.xCm + item.widthCm <= box.widthCm
                && item.yCm + offset.yCm + item.depthCm <= box.depthCm
            ));

            if (fits) return boxIndex;
        }

        return null;
    };

    const handleFindSmallerBox = () => {
        const boxIndex = findSmallerBox();

        if (boxIndex === null) {
            setShrinkCandidateIndex(null);
            setPlacementMessage("現在の配置では、これ以上小さい箱に変更できません。");
            return;
        }

        setPlacementMessage("");
        setShrinkCandidateIndex(boxIndex);
    };

    const handleConfirmSmallerBox = () => {
        if (shrinkCandidateIndex === null) return;

        changeToBox(shrinkCandidateIndex);
        setShrinkCandidateIndex(null);
    };

    
    const handleToggleItemSelection = (id: string) => {
        setSelectedItemIds((currentIds) => (
            currentIds.includes(id)
                ? currentIds.filter((currentId) => currentId !== id)
                : [...currentIds, id]
        ));
    };
    //箱の中のお菓子を選択する。部分削除に使う
    const handleDeleteSelectedItems = () => {
        if (selectedItems.length === 0) return;

        const selectedIds = new Set(selectedItemIds);
        setItems((currentItems) => currentItems.filter((item) => !selectedIds.has(item.id)));
        setSelectedItemIds([]);
        setPlacementMessage(`${selectedItems.length}個のお菓子を削除しました。`);
    };

    //箱の中身をリセット
    const handleConfirmReset = () => {
        currentBoxIndexRef.current = 0;
        setItems([]);
        setCurrentBoxIndex(0);
        setSelectedItemIds([]);
        setShrinkCandidateIndex(null);
        setCandidateBoxIndex(null);
        setIsResetConfirmOpen(false);
        setPlacementMessage("箱とお菓子を初期状態に戻しました。");
    };

    const handleDragStart = ({ active }: DragStartEvent) => {
        dragScaleRef.current = PIXELS_PER_CM;
        setActiveItemId(String(active.id));
        setIsDropValid(true);
        setIsOutsideBox(false);
        setIsBoxLimitReached(false);
        setCandidateBoxIndex(null);
        setShrinkCandidateIndex(null);
        setPlacementMessage("");
    };

    const handleDragMove = ({ active, delta }: DragMoveEvent) => {
        const position = getDropPosition(String(active.id), delta);
        if (!position) return;

        if (position.isOutside) {
            const candidate = findBoxCandidate(String(active.id), delta);

            setIsOutsideBox(true);
            setIsBoxLimitReached(exceedsLargestBox(String(active.id), delta));
            setCandidateBoxIndex(candidate?.boxIndex ?? null);
            setIsDropValid(Boolean(candidate));
            return;
        }

        setIsOutsideBox(false);
        setIsBoxLimitReached(false);
        setCandidateBoxIndex(null);
        setShrinkCandidateIndex(null);
        setIsDropValid(position.isValid);
    };

    // 他のお菓子と重なる位置には置かない。
    const handleDragEnd = ({ active, delta }:DragEndEvent) => {
        let position = getDropPosition(String(active.id), delta);

        if (position?.isOutside) {
            const candidate = findBoxCandidate(String(active.id), delta);

            if (candidate) {
                changeToBox(candidate.boxIndex);
                position = candidate.position;
            } else {
                position = null;
            }
        }

        if (position?.isValid) {
            setItems((currentItems) =>
                currentItems.map((item) =>
                    item.id === active.id ? { ...item, xCm: position.xCm, yCm: position.yCm } : item,
                ),
            );
        } else {
            setPlacementMessage("");
        }

        setActiveItemId(null);
        setIsOutsideBox(false);
        setIsBoxLimitReached(false);
        setCandidateBoxIndex(null);
        setShrinkCandidateIndex(null);
    };

    const handleDragCancel = () => {
        setActiveItemId(null);
        setIsDropValid(true);
        setIsOutsideBox(false);
        setIsBoxLimitReached(false);
        setCandidateBoxIndex(null);
        setShrinkCandidateIndex(null);
    };
    return(
        <main
            className="container"
            onPointerDownCapture={(event) => {
                if (!(event.target instanceof Element) || !event.target.closest(".item, [data-selection-control]")) {
                    setSelectedItemIds([]);
                }
            }}
        >

            <header className="header">
                <div>
                    <p className="headerLabel">TUMETUME</p>
                    <h1>シュミレーター</h1>
                </div>

                <div className="orderSummary" aria-label="箱と合計金額">
                    <div>
                        <span>箱</span>
                        <strong>{currentBox.widthCm} × {currentBox.depthCm} cm</strong>
                    </div>
                    <div>
                        <span>合計</span>
                        <strong>¥{totalPrice.toLocaleString()}</strong>
                    </div>
                    <div>
                        <span>おかし</span>
                        <strong>{items.length} 個</strong>
                    </div>
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
                        <div className="workspaceActions">
                            <button className="recommendButton" type="button">
                                おすすめ
                            </button>
                            <button className="shrinkBoxButton" type="button" onClick={handleFindSmallerBox}>
                                小さい箱を探す
                            </button>
                            <button
                                className="deleteItemButton"
                                type="button"
                                onClick={handleDeleteSelectedItems}
                                disabled={selectedItems.length === 0}
                                data-selection-control
                            >
                                選択を削除
                            </button>
                            <button className="resetButton" type="button" onClick={() => setIsResetConfirmOpen(true)}>
                                リセット
                            </button>
                        </div>
                        {isResetConfirmOpen ? (
                            <div className="resetPrompt" role="dialog" aria-label="リセットの確認">
                                <span>箱と配置したお菓子をすべて初期状態に戻しますか？</span>
                                <button type="button" onClick={handleConfirmReset}>リセットする</button>
                                <button type="button" onClick={() => setIsResetConfirmOpen(false)}>キャンセル</button>
                            </div>
                        ) : shrinkCandidateBox ? (
                            <div className="shrinkBoxPrompt" role="status">
                                <span>{shrinkCandidateBox.name}（{shrinkCandidateBox.widthCm} × {shrinkCandidateBox.depthCm} cm）に変更しますか？</span>
                                <button type="button" onClick={handleConfirmSmallerBox}>変更する</button>
                                <button type="button" onClick={() => setShrinkCandidateIndex(null)}>キャンセル</button>
                            </div>
                        ) : placementMessage && <p className="placementMessage" role="status">{placementMessage}</p>}
                    </div>

                    <DndContext
                        onDragStart={handleDragStart}
                        onDragMove={handleDragMove}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                        modifiers={[snapToGrid]}
                    >
                        <div className="boxCanvas">
                            <div className="boxStage">
                                {previewBox && (
                                    <div
                                        className={`nextBoxPreview ${isOutsideBox ? "" : "isShrinkPreview"}`}
                                        aria-hidden="true"
                                        style={{
                                            width: `${previewBox.widthCm * PIXELS_PER_CM}px`,
                                            height: `${previewBox.depthCm * PIXELS_PER_CM}px`,
                                        }}
                                    >
                                        <span>{isOutsideBox ? "提案する箱" : "小さくする候補"}：{previewBox.widthCm} × {previewBox.depthCm} cm</span>
                                    </div>
                                )}
                                <div
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
                                        x={item.xCm * PIXELS_PER_CM}
                                        y={item.yCm * PIXELS_PER_CM}
                                        widthPx={item.widthCm * PIXELS_PER_CM}
                                        heightPx={item.depthCm * PIXELS_PER_CM}
                                        isDropInvalid={item.id === activeItemId && !isDropValid}
                                        isSelected={selectedItemIds.includes(item.id)}
                                        onSelect={() => handleToggleItemSelection(item.id)}
                                    />
                                ))}
                                </div>
                            </div>
                            <p className={`dragHint ${activeItemId ? (isDropValid ? "isValid" : "isInvalid") : ""}`} aria-live="polite">
                                {activeItemId
                                    ? isBoxLimitReached
                                        ? "これ以上大きい箱はありません"
                                        : isDropValid
                                            ? "配置できます"
                                            : "他のお菓子と重なっています"
                                    : ""}
                            </p>
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
                    </DndContext>

                </section>




            </div>
        </main>
    );
}
