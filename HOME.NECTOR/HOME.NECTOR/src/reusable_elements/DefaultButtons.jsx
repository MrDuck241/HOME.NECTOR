import "../reusable_elements_styles/DefaultButtonsStyle.css"

export const CyanBtn = ({ text, onClickFunction }) => {
    return <button type="button" className="cyanBtn cyanHoverEffect" onClick={() => onClickFunction()}>
        { text }
    </button>
}

export const InfoBtn = ({ onClickFunction }) => {
    return <button type="button" className="infoBtn cyanHoverEffect" onClick={() => onClickFunction()} />
}

export const ExpandableMenu = ({ onClickFunction }) => {
    return <button type="button" className="expandableBtn cyanHoverEffect" onClick={() => onClickFunction()} />
}