import React from 'react';
import logo from './Logo.svg'; 

function Logo(props) {

    const color = props.color || "#C84630"; // Default color if not provided
    const aspectRatio = 238 / 262; // Default aspect ratio

    let width = 262;
    let height = 238;

    if (props.size) {
        switch (props.size) {
            case "sm":
                width = 80 * aspectRatio;
                height = 80;
                break;
            case "md":
                width = 100 * aspectRatio;
                height = 100;
                break;
            case "lg":
                width = 400 * aspectRatio;
                height = 400;
                break;
            default:
                console.warn("Invalid size prop:", props.size);
                break;
        }
    } else if (props.width) {
        width = props.width;
        height = width / aspectRatio;
    } else if (props.height) {
        height = props.height;
        width = height * aspectRatio;
    }

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
            <filter id="colorFilter">
                <feFlood floodColor={color} result="color" />
                <feComposite in="SourceGraphic" in2="color" operator="in" />
                <feMorphology radius="100" operator="dilate" /> 
            </filter>
            <image href={logo} width={width} height={height} />
        </svg>
    );
}

export default Logo; 
