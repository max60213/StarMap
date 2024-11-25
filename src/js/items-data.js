export const group = [2, 4, 4];
export const itemsData = {
    "items": {
        "principles": {
            "name": {
                "zh": "成像與機身",
                "en": "Principles"
            },
            "description": "感光元件與機身結構",
            "content": "感光元件是相機中負責捕捉光線並將其轉換為電子信號的重要部分。常見類型包括CMOS和CCD。CMOS常用於多數數位相機因其低功耗特性；CCD則因其出色的光線捕捉能力在高品質影像方面表現卓越。",
            "states": ["1\"", "APS-C", "Full Frame"],
            "initState" : 1,
            "url": "/articles/principles/principles.json"
        },
        "storage-methods": {
            "name": {
                "zh": "儲存與格式",
                "en": "Storage Methods"
            },
            "description": "不同格式的用途與特性",
            "content": "影像或視頻的格式決定了其數據的組織方式，如 JPEG、RAW、MP4 等。不同的格式有不同的特點，如壓縮比、編輯靈活性和檔案大小。",
            "url": "/articles/storage-methods/storage-methods.json"
        },
        "exposure-value": {
            "name": {
                "zh": "曝光值",
                "en": "Exposure Value"
            },
            "description": "影像的總曝光量",
            "content": "曝光值是根據 ISO、光圈和快門速度的設定來確定的，它決定了照片的總光量。正確的曝光能夠使照片展現出最佳的亮度和對比，避免過曝或欠曝。"
        },
        "aperture": {
            "name": {
                "zh": "光圈",
                "en": "Aperture"
            },
            "description": "鏡頭中用於控制進光量的開口大小",
            "content": "光圈的大小直接影響到影像的景深和亮度。開大光圈可以增加背景模糊，使主體更突出，適合肖像攝影；縮小光圈則能提高景深，保持更多的場景焦點清晰，適合風景攝影。",
            "states": ["f/2.8", "f/3.5", "f/4.6", "f/6.3", "f/13"],
            "initState" : 2,
            "url": "/articles/aperture.json"
        },
        "shutter-speed": {
            "name": {
                "zh": "快門速度",
                "en": "Shutter Speed"
            },
            "description": "控制接收光線的時間長短",
            "content": "快門速度決定了相機感光元件曝光的時間長短。快門速度越快，適合拍攝運動或快速移動的主題，可以凍結畫面；慢快門則適合拍攝夜景或流水等靜態場景，產生流暢的效果。",
            "states": ["1/4", "1/15", "1/60", "1/250", "1/1000"],
            "initState" : 2,
            "url": "/articles/shutter-speed/shutter-speed.json"
        },
        "iso": {
            "name": {
                "zh": "感光度",
                "en": "ISO"
            },
            "description": "感光元件對光的敏感程度",
            "content": "ISO 的設置影響攝影中的光線捕捉能力。提高 ISO 可以在低光環境中拍攝，但同時會增加影像的雜訊。適當的控制 ISO 能夠在不同光線條件下獲得清晰的照片。",
            "states": ["100", "500", "2500", "12800", "64000"],
            "initState" : 2,
            "url": "/articles/iso.json"
        },
        "focal-length": {
            "name": {
                "zh": "焦距",
                "en": "Focal Length"
            },
            "description": "鏡頭與成像感光元件之間的距離",
            "content": "焦距影響鏡頭的視角，短焦距鏡頭提供廣闊的視野，適合風景或建築攝影；長焦距鏡頭能放大遠處物體，常用於野生動物或運動攝影。",
            "states": ["14mm", "24mm", "50mm", "70mm", "120mm"],
            "initState" : 2,
            "url": "/articles/focal-length.json"
        },
        "white-balance": {
            "name": {
                "zh": "白平衡",
                "en": "White Balance"
            },
            "description": "調整相機色溫的設定",
            "content": "白平衡用於調整攝影圖像中的色溫，使色彩呈現自然。根據不同光源的色溫差異調整，可以消除不自然的色彩偏差，如日光、螢光燈或白熾燈下的攝影。"
        },
        "focus": {
            "name": {
                "zh": "對焦",
                "en": "Focus"
            },
            "description": "調整鏡頭使畫面清晰的過程",
            "content": "對焦是確保照片中所需部分清晰可見的過程。自動對焦系統可以快速定位到主題，而手動對焦則允許攝影師更精確地控制焦點。"
        },
        "frame-rate": {
            "name": {
                "zh": "幀率",
                "en": "Frame Rate"
            },
            "description": "每秒顯示的影格數",
            "content": "幀率決定了視頻播放的流暢程度。高幀率如60幀/秒，可以使動作看起來更流暢自然，適合高速動作的拍攝；較低的幀率可能產生較為跳躍的效果，有時用於特殊效果或節省儲存空間。"
        }
    }
};