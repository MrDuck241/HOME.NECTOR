import { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/RobotsPanelMainStyle.css';
import RobotModel from './RobotModel';

const RobotsPanelMain = ({ onCancelSelection, selectedRobot }) => {
    const [model3DPath, setModel3DPath] = useState("");
    const [selectedRobotDevice, setSelectedRobotDevice] = useState(null);
    const [robotConn, setRobotConn] = useState(null);
    const [src, setSrc] = useState("assets/noCameraSignal.jpg");
    const [ledActive, setLedActive] = useState(false);
    const robotCameraViewRef = useRef(null);

    const [robotStates, setRobotStates] = useState({
        led: false
    });

    const toggleState = (stateKey, connection, commandOn, commandOff) => {
        if (!connection) {
            console.error("Invalid connection: cannot send commands.");
            return;
        }
    
        setRobotStates((prevStates) => {
            const newState = !prevStates[stateKey]; // Przełączanie stanu
            const command = newState ? commandOn : commandOff;
            connection.send(command); // Wysyłanie komendy przez WebSocket
            console.log(newState ? `Turning ON ${stateKey}` : `Turning OFF ${stateKey}`);
            return {
                ...prevStates,
                [stateKey]: newState, // Aktualizacja stanu
            };
        });
    };
    

    const toggleEffect = (cameraRef, effectClass) => {
        if (cameraRef.current) {
            cameraRef.current.classList.toggle(effectClass);
        }
    };

    const defaultCamBtns = useMemo(() => (robotCameraViewRef, connection, camera) => [
        {
            src: "closeConn.png",
            event: () => {
                if (connection) {
                    connection.close(); // Zamykamy połączenie WebSocket
                    setRobotConn(null); // Czyszczenie stanu połączenia
                    console.log("Connection closed.");
                } else {
                    console.warn("No connection to close.");
                }
            },
        },
        "recordIcon.png",
        "stopRecording.png",
        {
            src: "upsideDown.png",
            event: () => toggleEffect(robotCameraViewRef, "flipped"),
        },
        {
            src: "mirrorFlip.png",
            event: () => toggleEffect(robotCameraViewRef, "mirrored"),
        },
        "zoomIcon.png",
        {
            src: "invertColors.png",
            event: () => toggleEffect(robotCameraViewRef, "negative"),
        },
        {
            src: "blurIcon.png",
            event: () => toggleEffect(robotCameraViewRef, "blured"),
        },
        {
            src: "move_up.png",
            event: () => {
                if (connection) {
                    connection.send("FORWARD")
                } else {
                    console.warn("No connection to send.");
                }
            },
        },
        {
            src: "move_down.png",
            event: () => {
                if (connection) {
                    connection.send("BACK")
                } else {
                    console.warn("No connection to send.");
                }
            },
        },
        {
            src: "move_left.png",
            event: () => {
                if (connection) {
                    connection.send("LEFT")
                } else {
                    console.warn("No connection to send.");
                }
            },
        },
        {
            src: "move_right.png",
            event: () => {
                if (connection) {
                    connection.send("RIGHT")
                } else {
                    console.warn("No connection to send.");
                }
            },
        },
        {
            src: "stop.png",
            event: () => {
                if (connection) {
                    connection.send("STOP")
                } else {
                    console.warn("No connection to send.");
                }
            },
        },
        {
            src: "flashLedIcon.png",
            event: () =>
                toggleState("led", connection, "LED_ON", "LED_OFF"), // Przełączanie LED
        },
    ], []);

    const connectToRobot = () => {
        if (selectedRobotDevice) {
            const ws = new WebSocket(`ws://${selectedRobotDevice.IP_Address}`);
            ws.binaryType = 'arraybuffer';
            ws.onclose = () => {
                console.log(`Robot connection closed with IP: ${selectedRobotDevice.IP_Address}`);
                setSrc('assets/noCameraSignal.jpg');
                setRobotConn(null);
            };

            ws.onopen = () => {
                console.log(`Robot connection open with IP: ${selectedRobotDevice.IP_Address}`);
                setRobotConn(ws);
            };

            ws.onerror = () => {
                console.log(`Robot connection error with IP: ${selectedRobotDevice.IP_Address}`);
            };

            ws.onmessage = (event) => {
                const byteArray = new Uint8Array(event.data);

                if (byteArray.length === 0) {
                    console.warn("Received empty data packet.");
                    return;
                }

                const header = byteArray[0];
                const payload = byteArray.slice(1);

                if (header === 0x01) {
                    console.log("Image Received!");
                    const blob = new Blob([payload], { type: 'image/jpeg' });
                    const imageUrl = URL.createObjectURL(blob);
                    setSrc((prev) => {
                        if (prev) URL.revokeObjectURL(prev);
                        return imageUrl;
                    });
                } else {
                    console.warn("Unsupported header:", header);
                }
            };
            setRobotConn(ws);
        }
    };

    const renderCameraBtn = (iconSrc, index, connection) => {
        if (typeof iconSrc === 'object') {
            return (
                <img
                    key={index}
                    src={`assets/camera_icons/${iconSrc.src}`}
                    alt={iconSrc.src}
                    className="robotBtn"
                    onClick={iconSrc.event}
                />
            );
        }
        return (
            <img
                key={index}
                src={`assets/camera_icons/${iconSrc}`}
                alt={iconSrc}
                className="cameraBtn"
            />
        );
    };

    useEffect(() => {
        if (selectedRobot) {
            setSelectedRobotDevice(selectedRobot);
            const path = selectedRobot.ID_Name.split('-')[0];
            setModel3DPath(path);
        } else {
            setModel3DPath("");
        }
    }, [selectedRobot]);

    return (
        <div className="robots_panel_main">
            <div className="robotControlPanel">
                <div className="robotDataPanelsHolder">
                    <img
                        ref={robotCameraViewRef}
                        className="w-[90%] h-[300px] bg-red-600 rounded-[15px] shrink-0"
                        src={src}
                        alt="Robot Camera View"
                    />
                    <div className="w-[90%] h-[150px] bg-pink-400 rounded-[15px] shrink-0">Microphone data</div>
                    <div className="w-[90%] h-[150px] bg-pink-400 rounded-[15px] shrink-0">Distance sensor</div>
                </div>
                <div className="robotButtonsHolder">
                    {robotConn &&
                        defaultCamBtns(robotCameraViewRef, robotConn, "camera").map((element, index) =>
                            renderCameraBtn(element, index, robotConn)
                        )}
                </div>
            </div>
            <div className="robot3DModelAndBtns">
                <div style={{ width: "100%", height: "80%" }}>
                    {model3DPath && <RobotModel path={model3DPath} />}
                </div>
                <div className="flex h-[20%] justify-evenly">
                    <button className="robotConnBtn" onClick={connectToRobot}>
                        Connect to selected robot
                    </button>
                    <button className="robotCancelBtn" onClick={() => { setSelectedRobotDevice(null); onCancelSelection(); }}>
                        Cancel robot selection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RobotsPanelMain;
