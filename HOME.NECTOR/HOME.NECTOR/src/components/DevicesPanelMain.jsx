import '../styles/DevicesPanelMainStyle.css'
import { useState, useEffect, useRef, useMemo } from 'react';
import DeviceModel from './DeviceModel';

// Hook do obsługi WebSocket
const useWebSocket = (device, setDeviceData) => {
    const [connection, setConnection] = useState(null);

    useEffect(() => {
        if (!device) return;
        const ws = new WebSocket(`ws://${device.IP_Address}`);
        setConnection(ws);

        const handleOpen = () => console.log(`${device.IP_Address} connection established`);

        ws.onclose = () => {
            console.log(`${device.IP_Address} connection closed`);
        };

        const handleError = () => console.log(`${device.IP_Address} connection error`);

        const handleMessage = (event) => {
            try {
                const data = JSON.parse(event.data); // Parsowanie JSON
                setDeviceData(data);
                console.log("Odebrane dane:", data);
            } catch (error) {
                console.error("Błąd parsowania JSON:", error);
            }
        };

        ws.addEventListener('open', handleOpen);
        ws.addEventListener('error', handleError);
        ws.addEventListener('message', handleMessage);

        return () => {
            ws.removeEventListener('open', handleOpen);
            ws.removeEventListener('error', handleError);
            ws.removeEventListener('message', handleMessage);
            ws.close();
        };
    }, [device]);

    return { connection };
};

const DevicesPanelMain = ({device}) => {

    const [deviceData, setDeviceData] = useState([]);
    const [isDeviceSelected, setIsDeviceSelected] = useState(false);
    const [deviceModelSrc, setDeviceModelSrc] = useState(""); 

    useEffect(() => {

        if (device){
            setIsDeviceSelected(true);
            let path = String(device.Device_Name).split('-')[0];
            path = "devices/" + path;

            setDeviceModelSrc(path);
            } 
        else {
            setDeviceModelSrc("");
            setIsDeviceSelected(false);
        }
    }, [device])

    const { connection: deviceConn} = useWebSocket(device, setDeviceData);
    return (
        <div className='devicesPanelMain'>
            {
                isDeviceSelected && (
                    <>
                        <span className='deviceFullNameHolder'>{device.Full_Name}</span>
                        <div className='deviceDataBoxesGrid'>
                            <div className='deviceDescriptionAndButtonsHolder'>
                                <span className='descriptionHolderTitle'>Device Description</span>
                                <div className='descriptionHolder'>
                                    {device.Description}
                                </div>
                                <div className='descriptionButtonsHolder'>
                                    <input type='text' placeholder='Enter current device location' defaultValue = {device.Location} className='deviceLocationHolder'></input>
                                    <button type='button' className='deviceLocationChangeBtn cyanStyleBtn'>Change</button>
                                </div>
                            </div>
                            <div className='deviceDataAndButtonsHolder'>
                                <div className='deviceDataHolder'>
                                    <span className='deviceDataHolderTitle'>Device Data: </span>
                                    <div className='deviceDataTextHolder'>
                                        {
                                            Object.entries(deviceData).map(([key, value]) => (
                                                key != "devices" ? (
                                                    <span key={key}>
                                                    <strong>{key}:</strong> {String(value)}
                                                    </span>
                                                ) : null
                                            ))
                                        }
                                    </div>
                                    <div className='deviceDataOptionsHolder'>
                                        <button type='button' className='startSavingDataBtn cyanStyleBtn'>Start Saving Data</button>
                                        <button type='button' className='savingDataSettingBtn'></button>
                                        <button type = "button" className='showDataHistoryBtn cyanStyleBtn'>Show Data History</button>
                                    </div>
                                </div>
                                <div className='deviceButtonHolder'>
                                    <div className='buttonsHolder'>
                                        <div className='buttonScroll'>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum

                                        </div>
                                    </div>
                                    <button type='button' className='hideDeviceButtonsBtn cyanStyleBtn'>Hide Device Buttons</button>
                                </div>
                            </div>
                            <div className='device3DModelHolder'>
                                <DeviceModel path = {deviceModelSrc}/>
                            </div>
                            <div className='deviceDataChartHolder'>
                                
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}

export default DevicesPanelMain;