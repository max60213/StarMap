import { useRef, useEffect, useState } from 'react';
import './css/slider.scss';

const Slider = ({ currentStep, setCurrentStep, articleData, setCurrentImageIndex }) => {
    const states = articleData?.landing?.states || [];
    const isSwitchable = articleData?.landing?.switchable || false;
    const [isActive, setIsActive] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    
    const sliderRef = useRef(null);
    const thumbRef = useRef(null);
    const isDraggingRef = useRef(false);
    
    // 設定初始狀態
    useEffect(() => {
        setCurrentStep(articleData?.landing?.initState || 0);
        console.log(articleData);
    }, [setCurrentStep, articleData]);

    // 計算步驟像素
    const getStepPixel = () => {
        if (!sliderRef.current || !thumbRef.current) return 0;
        return (sliderRef.current.offsetWidth - thumbRef.current.offsetWidth) / (states.length - 1);
    };

    // 處理滑桿點擊
    const handleSliderClick = (event) => {
        if (isDraggingRef.current) return;
        
        const slider = sliderRef.current;
        const clickPosition = event.clientX - slider.getBoundingClientRect().left;
        const newStep = Math.min(
            Math.max(0, Math.round(clickPosition / getStepPixel())),
            states.length - 1
        );
        
        setCurrentStep(newStep);
    };

    // 處理拖曳
    const handleMouseDown = (event) => {
        event.preventDefault();
        isDraggingRef.current = true;
        const shiftX = event.clientX - thumbRef.current.getBoundingClientRect().left;

        const handleMouseMove = (event) => {
            const newLeft = event.clientX - shiftX - sliderRef.current.getBoundingClientRect().left;
            const newStep = Math.min(
                Math.max(0, Math.round(newLeft / getStepPixel())),
                states.length - 1
            );
            setCurrentStep(newStep);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            isDraggingRef.current = false;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    // 處理圖片切換
    const handleSwitchImage = () => {
        setCurrentImageIndex(prev => prev === 1 ? 0 : 1);
        setIsActive(prev => !prev);
    };

    return (
        <div className="slider-container">
            <div className="slider-wrapper">
                <div
                    ref={sliderRef}
                    className="slider"
                    onClick={handleSliderClick}
                >
                    <div className="slider-bar" />
                    <div
                        ref={thumbRef}
                        className="slider-thumb"
                        style={{ left: `${currentStep * getStepPixel()}px` }}
                        onMouseDown={handleMouseDown}
                        onDragStart={() => false}
                    >
                        <div className="slider-thumb-btn" />
                        <div className="slider-thumb-highlight" />
                        <h3 className="slider-thumb-state">{states[currentStep]}</h3>
                    </div>
                </div>
                {isSwitchable && (
                    <button 
                        className={`slider-switch-btn text-center ${isActive ? 'active' : ''}`}
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={handleSwitchImage}
                    >
                        <img src="/auto_brightness.svg" alt="Auto Brightness" />
                        <span className={`custom-tooltip ${showTooltip ? 'show' : ''}`}>
                            自動曝光
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default Slider;