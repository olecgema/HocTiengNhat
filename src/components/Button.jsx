export default function Button({
    children,
    onClick,
    className = '',
    variant = 'primary',
    type = 'button',
    disabled = false,
    ...props
}) {
    const baseClass = className.includes('btn-') ? className : `btn btn-${variant} ${className}`;

    return (
        <button
            type={type}
            className={baseClass.trim()}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
