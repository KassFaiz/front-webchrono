function Button ({text}) {
    function gererClick () {
        console.log(text)
    }
    
    return (
        <button onClick={gererClick}>{text}</button>
    )
}

export default Button

