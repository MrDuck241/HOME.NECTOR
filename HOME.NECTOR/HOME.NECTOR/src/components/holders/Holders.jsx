import "./HoldersStyle.css";

export const PanelNavHolder = ({ children }) => {
  return <div className="panelNavHolder">{children}</div>;
};

export const PanelNavDevicesHolder = ({ children }) => {
  return <div className="panelNavDevicesHolder">{children}</div>;
};

export const PanelNavBtnsHolder = ({ children }) => {
  return <div className="panelNavBtnsHolder">{children}</div>;
};
