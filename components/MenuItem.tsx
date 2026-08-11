type MenuItemProps = {
    children: React.ReactNode;
    onClick?: () => void;
    variant: "menuItem";
}

export default function MenuItem({
    children,
    onClick,
    variant,
}: MenuItemProps){
    return (
        <button
            className={`button ${variant}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
}