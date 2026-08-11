export type Allergen =
    | "えび"
    | "かに"
    | "くるみ"
    | "小麦"
    | "そば"
    | "卵"
    | "乳"
    | "落花生"
    | "アーモンド"
    | "大豆"
    | "ごま"
    | "ゼラチン";

export interface SnackItem {
    id: string;
    name: string;
    /** 横幅（cm） */
    widthCm: number;
    /** 縦幅（cm） */
    depthCm: number;
    /** 価格（円） */
    price: number;
    description: string;
    /** 空の配列はアレルゲンなしを表す */
    allergens: Allergen[];
}

export const initItems: SnackItem[] = [
    { id: "snack-01", name: "いちごクッキー", widthCm: 6, depthCm: 6, price: 180, description: "甘酸っぱいいちごのひとくちクッキー。", allergens: ["小麦", "卵", "乳"] },
    { id: "snack-02", name: "塩キャラメル", widthCm: 5, depthCm: 5, price: 120, description: "ほどよい塩味のやわらかいキャラメル。", allergens: ["乳"] },
    { id: "snack-03", name: "抹茶フィナンシェ", widthCm: 9, depthCm: 7, price: 250, description: "香り高い抹茶を使ったしっとり焼き菓子。", allergens: ["小麦", "卵", "乳", "アーモンド"] },
    { id: "snack-04", name: "レモンマドレーヌ", widthCm: 8, depthCm: 8, price: 220, description: "レモンの爽やかな香りが広がるマドレーヌ。", allergens: ["小麦", "卵", "乳"] },
    { id: "snack-05", name: "黒ごまクランチ", widthCm: 7, depthCm: 5, price: 160, description: "黒ごまの香ばしさを楽しむ軽い食感のお菓子。", allergens: ["小麦", "乳", "大豆", "ごま"] },
    { id: "snack-06", name: "ミルクチョコサブレ", widthCm: 10, depthCm: 10, price: 280, description: "ミルクチョコを練り込んだサクサクのサブレ。", allergens: ["小麦", "卵", "乳", "大豆"] },
    { id: "snack-07", name: "りんごパイ", widthCm: 12, depthCm: 9, price: 320, description: "角切りりんごを包んだ小さなパイ。", allergens: ["小麦", "卵", "乳"] },
    { id: "snack-08", name: "アーモンドボール", widthCm: 6, depthCm: 6, price: 170, description: "アーモンドのコクを楽しめる丸いクッキー。", allergens: ["小麦", "乳", "アーモンド"] },
    { id: "snack-09", name: "きなこもち", widthCm: 11, depthCm: 7, price: 210, description: "きなこをまぶした、もっちり食感の和菓子。", allergens: ["大豆"] },
    { id: "snack-10", name: "フルーツゼリー", widthCm: 5, depthCm: 8, price: 140, description: "果汁感のある、カラフルなスティックゼリー。", allergens: ["ゼラチン"] },
    { id: "snack-11", name: "バターラスク", widthCm: 14, depthCm: 6, price: 230, description: "バターの香り豊かな薄焼きラスク。", allergens: ["小麦", "乳"] },
    { id: "snack-12", name: "くるみブラウニー", widthCm: 9, depthCm: 9, price: 300, description: "くるみが入った濃厚なチョコレートブラウニー。", allergens: ["小麦", "卵", "乳", "くるみ", "大豆"] },
    { id: "snack-13", name: "メープルワッフル", widthCm: 13, depthCm: 10, price: 290, description: "メープルが香る、ふんわり食感のワッフル。", allergens: ["小麦", "卵", "乳"] },
    { id: "snack-14", name: "えびせんべい", widthCm: 15, depthCm: 12, price: 260, description: "えびの旨みを閉じ込めた薄焼きせんべい。", allergens: ["えび", "小麦", "大豆"] },
    { id: "snack-15", name: "ほうじ茶クッキー", widthCm: 7, depthCm: 7, price: 190, description: "ほうじ茶の香ばしさが広がるクッキー。", allergens: ["小麦", "卵", "乳"] },
    { id: "snack-16", name: "ココナッツメレンゲ", widthCm: 8, depthCm: 5, price: 150, description: "軽やかな口どけのココナッツメレンゲ。", allergens: ["卵"] },
    { id: "snack-17", name: "チーズスティック", widthCm: 16, depthCm: 5, price: 240, description: "チーズの風味を効かせた細長い焼き菓子。", allergens: ["小麦", "卵", "乳"] },
    { id: "snack-18", name: "栗まんじゅう", widthCm: 10, depthCm: 8, price: 270, description: "栗あんを包んだ、しっとりまんじゅう。", allergens: ["小麦", "卵"] },
    { id: "snack-19", name: "カカオビスコッティ", widthCm: 18, depthCm: 6, price: 310, description: "カカオの風味と硬めの食感が楽しい焼き菓子。", allergens: ["小麦", "卵", "アーモンド"] },
    { id: "snack-20", name: "みたらし団子", widthCm: 12, depthCm: 12, price: 200, description: "甘じょっぱいたれを絡めた三連団子。", allergens: ["小麦", "大豆"] },
    { id: "snack-21", name: "白桃キャンディ", widthCm: 5, depthCm: 5, price: 100, description: "白桃の香りが広がる小粒キャンディ。", allergens: [] },
    { id: "snack-22", name: "アプリコットタルト", widthCm: 15, depthCm: 15, price: 360, description: "甘酸っぱいアプリコットをのせたタルト。", allergens: ["小麦", "卵", "乳", "アーモンド"] },
    { id: "snack-23", name: "海苔あられ", widthCm: 8, depthCm: 8, price: 170, description: "海苔の風味が香るひとくちあられ。", allergens: ["小麦", "大豆"] },
    { id: "snack-24", name: "ピーナッツバー", widthCm: 20, depthCm: 6, price: 330, description: "ピーナッツをたっぷり使った香ばしいバー。", allergens: ["落花生", "乳", "大豆"] },
    { id: "snack-25", name: "ハニーカステラ", widthCm: 20, depthCm: 20, price: 380, description: "はちみつのやさしい甘さが広がるカステラ。", allergens: ["小麦", "卵", "乳"] },
];
