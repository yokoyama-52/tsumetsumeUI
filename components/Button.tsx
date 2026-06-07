type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant: "done" | "choiceBox" | "x" | "≡";
}

export default function Button({
    children,
    onClick,
    variant,
}: ButtonProps){
    return (
        <button
            className={`button ${variant}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}