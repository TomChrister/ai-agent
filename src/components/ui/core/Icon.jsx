/** Icon: renders a Lucide icon via the lucide-static CDN. name = kebab-case lucide icon name. */
function Icon({ name, size = 18, className = "", ...rest }) {
    return (
        <img
            src={`https://unpkg.com/lucide-static@latest/icons/${name}.svg`}
            width={size}
            height={size}
            alt=""
            aria-hidden="true"
            className={`inline-block align-middle ${className}`}
            {...rest}
        />
    );
}

export default Icon;
