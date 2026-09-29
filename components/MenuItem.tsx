type MenuItemProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant: "menuItem";
    className?: string;
}

export default function MenuItem({
    children,
    onClick,
    variant,
    className = "",
}: MenuItemProps){
    return (
        <button
            className={`button ${variant} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
