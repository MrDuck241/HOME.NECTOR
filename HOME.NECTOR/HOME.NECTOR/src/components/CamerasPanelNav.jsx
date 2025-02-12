import { useState, useEffect } from 'react';
import '../styles/CamerasPanelNavStyle.css';

const CamerasPanelNav = ({onSelectCamDevice}) => {
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    const [fetchedCameras, setFetchedCameras] = useState(null);
    const [view1CamDevice, setView1CamDevice] = useState(null);
    const [view2CamDevice, setView2CamDevice] = useState(null);
    const [showSelectDeviceViewID, setShowSelectDeviceViewID] = useState(false);
    const [bufforCamDevice, setBufforCamDeivce] = useState(null);

    useEffect(() => {
        const backendUrl = "http://192.168.1.101:80/php/get_cameras.php";
        fetch(backendUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error during loading data');
                }
                return response.json();
            })
            .then((data) => {
                setFetchedCameras(data.data);
                setLoading(false);
            })
            .catch((err) => {
                setErrorMsg("Failed to download cameras from database");
                setLoading(false);
            });
    }, []);

    const onCamDeviceClick = (element) => {
        setShowSelectDeviceViewID(true);
        setBufforCamDeivce(element);
    }

    const renderCameraBox = (element, index) => {
        return (
            <button className="cameraDeviceBox" key={index} onClick={() => onCamDeviceClick(element)}>{element.ID_Name}</button>
        );
    };

    return (
        <>
            {
                showSelectDeviceViewID && (
                    <div className='w-[100vw] h-[100vh] bg-transparent backdrop-blur-md fixed top-0 left-0 z-[9999]'>
                        <div className='w-[25vw] h-[30vh] bg-gray-700 relative top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 rounded-[12px] border-solid border-2 border-gray-400 flex flex-col justify-between'>
                            <div className='w-[100%]'>
                                <button className='closeSelectViewBtn' onClick={() => setShowSelectDeviceViewID(false)}></button>
                            </div>
                            <div className='w-[100%] flex flex-row  justify-evenly mb-[20px]'>
                                <button type = "button" className='selectCamViewBtn' onClick={() => {onSelectCamDevice(1, bufforCamDevice);}}>Camera View Box 1</button>
                                <button type = "button" className='selectCamViewBtn' onClick={() => {onSelectCamDevice(2, bufforCamDevice);}}>Camera View Box 2</button>
                            </div>
                        </div>
                    </div>
                )
            }
            <div className='cameras_panel_nav'>
                <div className='cameraDevicesHolder'>
                    {loading ? (
                        <p className="text-cyan-400 text-lg italic font-semibold">Loading...</p>
                    ) : errorMsg ? (
                        <div className="text-cyan-400 text-lg italic font-semibold">{errorMsg}</div>
                    ) : (
                        fetchedCameras && fetchedCameras.length > 0 ? (
                            fetchedCameras.map((element, index) => renderCameraBox(element, index))
                        ) : (
                            <p>No cameras available</p>
                        )
                    )}
                </div>
                <div className='navControlBtnsHolder'>
                    <div className='viewCamera3DModel'>
                        {/* Możesz dodać coś tutaj */}
                    </div>
                    <div className='closeConnectionsBtn'>
                        <span className='w-[90%] h-[auto] text-center absolute top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4'>
                            Close All Active Connections
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CamerasPanelNav;
