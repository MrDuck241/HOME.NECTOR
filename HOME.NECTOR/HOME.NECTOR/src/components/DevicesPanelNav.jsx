import '../styles/DevicesPanelNavStyle.css'
import { useEffect, useState } from 'react';

const DevicesPanelNav = ({onSelectDevice}) => {

    const [loading, setLoading] = useState(false);
    const [fetchedDevices, setFetchedDevices] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedDeviceBuffor, setSelectedDeviceBuffor] = useState(null);

    useEffect(() => {
        const backendUrl = import.meta.env.VITE_GET_DEVICES_PHP_SCRIPT_ADDRESS;
        fetch(backendUrl)
            .then((response) => {
                if (!response.ok) {
                    errorMsg("Error during loading data");
                    throw new Error('Error during loading data');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setFetchedDevices(data.data);
                setLoading(false);
            })
            .catch(() => {
                setFetchedDevices("Failed to download devices from database");
                setLoading(false);
            });
    }, []);

    const onDeviceClick = (element) => {
        setSelectedDeviceBuffor(element);
    }

    const renderDeviceBox = (element, index) => {
        return (
            <button type='button' className='deviceBtn' key={index} onClick={() => onDeviceClick(element)}>{element.Device_Name}</button>
        )
    }

    const connectToDevice = () => {
        if(selectedDeviceBuffor){
            onSelectDevice(selectedDeviceBuffor);
        }
    }

    return (
        <div className="devicesPanelNav">
            <div className='devicesHolder'>
                {loading ? (
                        <p className="text-cyan-400 text-lg italic font-semibold">Loading...</p>
                    ) : errorMsg ? (
                        <div className="text-cyan-400 text-lg italic font-semibold">{errorMsg}</div>
                    ) : (
                        fetchedDevices && fetchedDevices.length > 0 ? (
                            fetchedDevices.map((element, index) => renderDeviceBox(element, index))
                        ) : (
                            <p>No devices available</p>
                        )
                )}
            </div>
            <div className='scanBtnElementsHolder'>
                <button type = "button" className='navPanelSmallBtn'>
                    Scan Devices
                </button>
                <div className='scanBtnOptionsHolder'>
                    <div><input type='checkbox'></input> Get Server Devices List</div>
                    <div><input type='checkbox'></input> Send ping message to devices</div>
                </div>
            </div>
            <button type = "button" className='navPanelBtn' onClick={connectToDevice}>
                Connect to Device
            </button>
            <button type = "button" className='navPanelBtn'>
                Disconnect from Device
            </button>
        </div>
    )
}

export default DevicesPanelNav;