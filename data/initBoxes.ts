export interface BoxItem {
    id: string;
    name: string;
    /** 横幅（cm） */
    widthCm: number;
    /** 縦幅（cm） */
    depthCm: number;
    /** 価格（円） */
    price: number;
}

/** 面積が小さい順の仮の箱データ */
export const initBoxes: BoxItem[] = [
    { id: "box-01", name: "ミニボックス", widthCm: 16, depthCm: 14, price: 500 },
    { id: "box-02", name: "スクエアボックス", widthCm: 22, depthCm: 20, price: 650 },
    { id: "box-03", name: "ミドルボックス", widthCm: 30, depthCm: 26, price: 700 },
    { id: "box-04", name: "スタンダードボックス", widthCm: 34, depthCm: 28, price: 850 },
    { id: "box-05", name: "ラージボックス", widthCm: 42, depthCm: 35, price: 1_100 },
];
