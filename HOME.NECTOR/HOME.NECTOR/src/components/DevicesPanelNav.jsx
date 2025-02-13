import '../styles/DevicesPanelNavStyle.css'

const DevicesPanelNav = () => {
    return (
        <div className="devicesPanelNav">
            <div className='devicesHolder'>

            </div>
            <button type = "button" className='navPanelBtn'>
                Connect to Device
            </button>
            <button type = "button" className='navPanelBtn'>
                Disconnect from Device
            </button>
        </div>
    )
}

export default DevicesPanelNav;