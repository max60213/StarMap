function Navigate(props) {
    return (
        <div id="navigate" className={`arrows-container ${props.className == undefined ? "" : props.className}`}>
            <div className="arrows">
                <div className="mx-button" id="button-left"></div>
                <div className="mx-button" id="button-right"></div>
                <div className="mx-button" id="button-up"></div>
                <div className="mx-button" id="button-down"></div>
            </div>
        </div>
    );
}

export default Navigate;