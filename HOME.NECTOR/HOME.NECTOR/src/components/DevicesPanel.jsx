import DevicesPanelNav from './DevicesPanelNav';
import DevicesPanelMain from './DevicesPanelMain'
import '../styles/DevicesPanelStyle.css'

const DevicesPanel = () => {
    return (
        <div className="devicesPanel">
            <DevicesPanelNav/>
            <DevicesPanelMain/>
        </div>
    )
}

export default DevicesPanel;