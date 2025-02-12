import { useState, useEffect, useRef, useMemo } from 'react';
import '../styles/CamerasPanelMainStyle.css';

// Hook do obsługi WebSocket
const useWebSocket = (device, cameraViewRef) => {
    const [connection, setConnection] = useState(null);
    const [src, setSrc] = useState(null);

    useEffect(() => {
        if (!device) return;
        const ws = new WebSocket(`ws://${device.IP_Address}`);
        setConnection(ws);

        const handleOpen = () => console.log(`${device.IP_Address} connection established`);
        ws.onclose = () => {
            console.log(`${device.IP_Address} connection closed`);
            setSrc('assets/noCameraSignal.jpg');
            if(cameraViewRef.current){
                cameraViewRef.current.classList.remove("flipped");
                cameraViewRef.current.classList.remove("mirrored");
                cameraViewRef.current.classList.remove("negative");
                cameraViewRef.current.classList.remove("blured");
            }
        };
        const handleError = () => console.log(`${device.IP_Address} connection error`);
        const handleMessage = (event) => {
            const blob = new Blob([event.data], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);
            setSrc((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return imageUrl;
            });
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

    return { connection, src };
};

// Komponent główny
const CamerasPanelMain = ({ view1CamDevice, view2CamDevice }) => {
    const cameraView1Ref = useRef(null);
    const cameraView2Ref = useRef(null);

    const { connection: view1CamConn, src: view1ConnSrc } = useWebSocket(view1CamDevice, cameraView1Ref);
    const { connection: view2CamConn, src: view2ConnSrc } = useWebSocket(view2CamDevice, cameraView2Ref);

    const [cameraStates, setCameraStates] = useState({
        view1: { led: false, signalLed: false, buzzer: false },
        view2: { led: false, signalLed: false, buzzer: false },
    });

    const toggleState = (camera, stateKey, connection, commandOn, commandOff) => {
        setCameraStates((prev) => {
            const newState = !prev[camera][stateKey];
            if (connection) {
                connection.send(newState ? commandOn : commandOff);
            }
            return {
                ...prev,
                [camera]: { ...prev[camera], [stateKey]: newState },
            };
        });
    };

    const toggleEffect = (cameraRef, effectClass) => {
        if (cameraRef.current) {
            cameraRef.current.classList.toggle(effectClass);
        }
    };

    const defaultCamBtns = useMemo(
        () => (cameraRef, connection, camera) => [
            {
                src: "closeConn.png",
                event: () => connection?.close(),
            },
            "recordIcon.png",
            "stopRecording.png",
            {
                src: "upsideDown.png",
                event: () => toggleEffect(cameraRef, "flipped"),
            },
            {
                src: "mirrorFlip.png",
                event: () => toggleEffect(cameraRef, "mirrored"),
            },
            "zoomIcon.png",
            {
                src: "invertColors.png",
                event: () => toggleEffect(cameraRef, "negative"),
            },
            {
                src: "blurIcon.png",
                event: () => toggleEffect(cameraRef, "blured"),
            },
            {
                src: "signalLedIcon.png",
                event: () =>
                    toggleState(camera, "signalLed", connection, "SIGNAL_LED_ON", "SIGNAL_LED_OFF"),
            },
            {
                src: "flashLedIcon.png",
                event: () =>
                    toggleState(camera, "led", connection, "LED_ON", "LED_OFF"),
            },
            {
                src: "buzzerIcon.png",
                event: () =>
                    toggleState(camera, "buzzer", connection, "STILL_SOUND", "NO_SOUND"),
            },
        ],
        []
    );

    const renderCameraBtn = (icon_src, index, connection) => {
        if (typeof icon_src === 'object') {
            return (
                <img
                    key={index}
                    src={`assets/camera_icons/${icon_src.src}`}
                    alt={icon_src.src}
                    className="cameraBtn"
                    onClick={icon_src.event}
                />
            );
        }
        return (
            <img
                key={index}
                src={`assets/camera_icons/${icon_src}`}
                alt={icon_src}
                className="cameraBtn"
            />
        );
    };

    return (
        <div className="main">
            {[{ ref: cameraView1Ref, src: view1ConnSrc, conn: view1CamConn, cam: "view1" },
              { ref: cameraView2Ref, src: view2ConnSrc, conn: view2CamConn, cam: "view2" }].map(
                ({ ref, src, conn, cam }, idx) => (
                    <div className="cameraViewBox" key={idx}>
                        <div className="cameraViewAndLocationHolder">
                            <img
                                ref={ref}
                                className="cameraView"
                                src={src || 'assets/noCameraSignal.jpg'}
                                alt={`camera${idx + 1} view`}
                            />
                            <div className="mb-[20px] ml-[15px]">
                                <span className="cameraLocationText">Camera Location</span>
                                <div className="flex flex-row w-[100%]">
                                    <input
                                        type="text"
                                        className="location_input"
                                        placeholder="Enter new location"
                                    />
                                    <button type="button" className="changeLocationBtn">Change</button>
                                </div>
                            </div>
                        </div>
                        <div className="verticalCameraBtnsHolder">
                            {
                                conn ? 
                                defaultCamBtns(ref, conn, cam).map((element, index) =>
                                    renderCameraBtn(element, index, conn)
                                ) : null
                            }
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default CamerasPanelMain;
