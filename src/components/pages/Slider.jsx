import { useRef, useEffect, useContext } from 'react';
import GalaxyContext from '../GalaxyContext.jsx';
import { itemsData } from '../../js/items-data.js';
import "./css/slider.css";

const Slider = ({ currentStep, setCurrentStep }) => {
    const { currentItem } = useContext(GalaxyContext);
    const currentItemData = itemsData.items[currentItem];
    const states = currentItemData?.states || [];
    const initState = currentItemData?.initState || 0;
    
    const sliderRef = useRef(null);
    const thumbRef = useRef(null);
    const isDraggingRef = useRef(false);
    
    // Set initial state when currentItem changes
    useEffect(() => {
        setCurrentStep(initState);
    }, [currentItem, initState, setCurrentStep]);

    // Calculate step size
    const getStepPixel = () => {
        if (!sliderRef.current || !thumbRef.current) return 0;
        return (sliderRef.current.offsetWidth - thumbRef.current.offsetWidth) / (states.length - 1);
    };

    // Handle click on slider
    const handleSliderClick = (event) => {
        if (isDraggingRef.current) return;
        
        const slider = sliderRef.current;
        const thumb = thumbRef.current;
        if (!slider || !thumb) return;

        const stepPixel = getStepPixel();
        const clickPosition = event.clientX - slider.getBoundingClientRect().left;
        const newStep = Math.min(
            Math.max(0, Math.round(clickPosition / stepPixel)),
            states.length - 1
        );
        
        setCurrentStep(newStep);
    };

    // Handle drag start
    const handleMouseDown = (event) => {
        event.preventDefault();
        const thumb = thumbRef.current;
        const slider = sliderRef.current;
        if (!thumb || !slider) return;

        isDraggingRef.current = true;
        const shiftX = event.clientX - thumb.getBoundingClientRect().left;
        const stepPixel = getStepPixel();

        const handleMouseMove = (event) => {
            const newLeft = event.clientX - shiftX - slider.getBoundingClientRect().left;
            const newStep = Math.min(
                Math.max(0, Math.round(newLeft / stepPixel)),
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

    // Calculate thumb position
    const thumbPosition = currentStep * getStepPixel();

    return (
        <div 
            ref={sliderRef}
            className="slider"
            onClick={handleSliderClick}
        >
            <div className="slider-bar" />
            <div
                ref={thumbRef}
                className="slider-thumb"
                style={{ left: `${thumbPosition}px` }}
                onMouseDown={handleMouseDown}
                onDragStart={() => false}
            >
                <div className="slider-thumb-btn" />
                <div className="slider-thumb-highlight" />
                <h3 className="slider-thumb-state">
                    {states[currentStep]}
                </h3>
            </div>
        </div>
    );
};

export default Slider;