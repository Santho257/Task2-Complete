function Button(props){
    return(
        <a href={props.href}><button>{props.value}</button></a>
    );
}

export default Button;