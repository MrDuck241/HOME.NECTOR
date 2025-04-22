import "./ButtonsStyles.css";

export const CyanBtn = ({ text, onClickFunction }) => {
  return (
    <button
      type="button"
      className="cyanBtn cyanHoverEffect"
      onClick={() => onClickFunction()}
    >
      {text}
    </button>
  );
};

export const InfoBtn = ({ onClickFunction }) => {
  return (
    <button
      type="button"
      className="infoBtn cyanHoverEffect"
      onClick={() => onClickFunction()}
    />
  );
};

export const ExpandableMenu = ({ onClickFunction }) => {
  return (
    <button
      type="button"
      className="expandableBtn cyanHoverEffect"
      onClick={() => onClickFunction()}
    />
  );
};

export const DeviceTile = ({ children, key, onClickFunction }) => {
  return (
    <button className="deviceTile" key={key} onClick={onClickFunction}>
      {children}
    </button>
  );
};
