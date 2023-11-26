import "../styles/Button.css";

interface IconProps {
    fill: string;
    width: number;
    height: number;
}

interface ButtonProps {
    Click?: () => void;
    IconComponent: (props: IconProps) => JSX.Element;
    Color: string;
    classCss: string;
    display?: string;
}

const Button = ({ Click, Color, IconComponent, classCss, display }: ButtonProps) => (

    <button className={classCss}  style={{backgroundColor: Color, display: display}}  onClick={Click} >
        <IconComponent fill={'#000'} width={24} height={24} />
    </button>
);

export default Button;