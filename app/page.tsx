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

    const [isOpen, setIsOpen] = useState(false);

    
    return(
        <main className="container">

            <header className="header">
                <h1>UI Design Practice</h1>
                
                <div className="buttonGroup">
                    <Button onClick={() => setIsOpen(true)} variant="choiceBox">
                        箱を選ぶ
                    </Button>
                    
                    <Button variant="done">
                        お会計へ
                    </Button>
                </div>

            </header>


            <section className="hero">
                <h2>Next.js UI練習</h2>
                <p>
                    コンポーネント・余白・ボタンデザインを学ぶサンプル
                </p>
            </section>

            <div 
                className="card"
                style={{
                    width: `${size.width}px`,
                    height: `${size.height}px`,
                }}
            >
                カード
            </div>
            {isOpen && (
                <div className="overlay">
                    <div className="model">
                        <h2>設定</h2>
                        <p>ここに内容を書く</p>

                        <Button onClick={ () => setIsOpen(false)} variant="x">
                            X
                        </Button>
                    </div>
                </div>
            )}
        </main>
    );
    
}