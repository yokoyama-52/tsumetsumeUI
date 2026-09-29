"use client";

export type TutorialStep = "welcome" | "choose" | "move" | "expand" | "finish";

type TutorialProps = {
    step: TutorialStep;
    onStart: () => void;
    onSkip: () => void;
    onComplete: () => void;
    onNext: () => void;
};

const content: Record<Exclude<TutorialStep, "welcome">, { title: string; body: string }> = {
    choose: {
        title: "1. おかしを選びます",
        body: "左のメニューから、光っているおかしをタップしてください。箱の空いている場所に自動で入ります。",
    },
    move: {
        title: "2. 箱の中で動かします",
        body: "箱に入ったおかしをドラッグして、好きな場所へ移動してください。重なる場所には置けません。",
    },
    expand: {
        title: "3. 箱を大きくできます",
        body: "おかしを箱の外へドラッグすると、入る大きさの箱を提案します。試すか、この手順を飛ばして進められます。",
    },
    finish: {
        title: "これで準備完了です",
        body: "おかしはクリックして選択し、まとめて削除できます。配置後は「小さい箱を探す」で、より小さな箱も検討できます。",
    },
};

export default function Tutorial({ step, onStart, onSkip, onComplete, onNext }: TutorialProps) {
    if (step === "welcome") {
        return (
            <div className="tutorialDialog" role="dialog" aria-labelledby="tutorial-title">
                <p className="eyebrow">WELCOME</p>
                <h2 id="tutorial-title">箱詰めをはじめましょう</h2>
                <p>約1分で、基本の使い方を実際に試せます。</p>
                <div className="tutorialButtons">
                    <button className="tutorialSecondaryButton" type="button" onClick={onSkip}>今はしない</button>
                    <button className="tutorialPrimaryButton" type="button" onClick={onStart}>はじめる</button>
                </div>
            </div>
        );
    }

    const current = content[step];
    const isFinish = step === "finish";

    return (
        <div className="tutorialDialog" role="status" aria-live="polite">
            <p className="tutorialProgress">{isFinish ? "完了" : "使い方ガイド"}</p>
            <h2>{current.title}</h2>
            <p>{current.body}</p>
            <div className="tutorialButtons">
                {!isFinish && <button className="tutorialSecondaryButton" type="button" onClick={onSkip}>スキップ</button>}
                {step === "expand" && <button className="tutorialSecondaryButton" type="button" onClick={onNext}>この手順を飛ばす</button>}
                {isFinish && <button className="tutorialPrimaryButton" type="button" onClick={onComplete}>使ってみる</button>}
            </div>
        </div>
    );
}
