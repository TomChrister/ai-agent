import Icon from "./ui/core/Icon";

function TopBar() {
    return (
        <header className="px-4 pt-4 md:px-8">
            <div className="mx-auto flex max-w-[1200px] items-center justify-between rounded-full bg-(--surface-card) py-2.5 pl-6 pr-3 shadow-(--shadow-sm)">
                <span className="flex items-center gap-2 text-xl font-bold tracking-[-0.02em] text-(--text-strong)">
                    <span aria-hidden="true" className="size-4 rounded-full bg-(image:--gradient-prism)" />
                    Planbase
                </span>
                <div className="flex items-center gap-4">
                    <Icon name="bell" size={18} />
                    <span className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-(--surface-sunken) text-[13px] font-medium text-(--text-primary)">
                        A
                    </span>
                </div>
            </div>
        </header>
    );
}

export default TopBar;
