import Icon from "./ui/core/Icon";

function TopBar() {
    return (
        <header className="flex items-center justify-between border-b border-(--border-subtle) px-8 py-4">
            <span className="text-2xl font-bold tracking-tight text-(--accent-primary)">Planbase</span>
            <div className="flex items-center gap-4">
                <Icon name="bell" size={18} />
                <span className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-(--teal-200) text-[13px] font-bold text-(--teal-800)">
                    A
                </span>
            </div>
        </header>
    );
}

export default TopBar;
