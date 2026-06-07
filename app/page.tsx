"use client";

import { useState } from "react";
import Button from "@/components/Button"

export default function Home(){
    const [name, setName] = useState("");
    const [size, setSize] = useState({
        width: 215,
        height: 156,
    });

    const handleClick = () => {
        console.log("押された！");
    };

    const [OlisOpen, setOlIsOpen] = useState(false);
    const [SbisOpen, setSbIsOpen] = useState(false);

    
    return(
        <main className="container">

            <header className="header">
                <h1>UI Design Practice</h1>
                <div className="buttonGroup">
                    <Button onClick={() => setOlIsOpen(true)} variant="choiceBox">
                        箱を選ぶ
                    </Button>
                    
                    <Button variant="done">
                        お会計へ
                    </Button>
                </div>

            </header>

            <div className="layout">
                <aside className={`sidebar ${SbisOpen ? "open" : "close"}`}>
                    <h2>Menu</h2>
                    <ul>
                        <li>Home</li>
                        <li>Projects</li>
                        <li>Settings</li>
                    </ul>
                </aside>


                <section className="main">
                    <Button onClick={() => setSbIsOpen(!SbisOpen)} variant="≡">
                        ≡
                    </Button>
                    <h2>Next.js UI練習</h2>
                    <p>
                        コンポーネント・余白・ボタンデザインを学ぶサンプル
                    </p>
                    
                    <div 
                        className="card"
                        style={{
                            width: `${size.width}px`,
                            height: `${size.height}px`,
                        }}
                    >
                        カード
                    </div>
                </section>
                {OlisOpen && (
                    <div className="overlay">
                        <div className="model">
                            <h2>設定</h2>
                            <p>ここに内容を書く</p>

                            <Button onClick={ () => setOlIsOpen(false)} variant="x">
                                X
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
    
}