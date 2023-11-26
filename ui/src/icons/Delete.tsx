import "../styles/Button.css"

interface DeleteProps {
    fill: string;
    width: number;
    height: number;
    [key: string]: any;
};

const Delete = (props: DeleteProps) => {
    return (
        <svg className="icon"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 50 46"
            preserveAspectRatio="xMidYMid meet"
            {...props}
        >
            <path className="path-cont" d="m36.021 8.444 3.536 3.536L11.98 39.557 8.443 36.02z"
                fill={props.fill}
            />
            <path className="path-cont"
                d="m39.555 36.023-3.536 3.535L8.445 11.976l3.536-3.535z"
                fill={props.fill}
            />
        </svg>
    )
}

export default Delete;