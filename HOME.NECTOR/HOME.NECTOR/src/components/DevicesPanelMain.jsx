import '../styles/DevicesPanelMainStyle.css'
import { useState } from 'react';

const DevicesPanelMain = () => {

    const [isDeviceSelected, setIsDeviceSelected] = useState(true);

    return (
        <div className='devicesPanelMain'>
            {
                isDeviceSelected && (
                    <>
                        <span className='deviceFullNameHolder'>Multi Sensor Deivce</span>
                        <div className='deviceDataBoxesGrid'>
                            <div className='deviceDescriptionAndButtonsHolder'>
                                <span className='descriptionHolderTitle'>Device Description</span>
                                <div className='descriptionHolder'>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum
                                </div>
                                <div className='descriptionButtonsHolder'>
                                    <input type='text' placeholder='Enter current device location' className='deviceLocationHolder'></input>
                                    <button type='button' className='deviceLocationChangeBtn cyanStyleBtn'>Change</button>
                                </div>
                            </div>
                            <div className='deviceDataAndButtonsHolder'>
                                <div className='deviceDataHolder'>
                                    <span className='deviceDataHolderTitle'>Device Data: </span>
                                    <div className='deviceDataTextHolder'>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum

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
                                3D Model
                                
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