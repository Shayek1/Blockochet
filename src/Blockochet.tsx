import {useRef, useEffect} from "react";

export default function Blockochet() {
const canvasReference = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasReference.current;
        if(!canvas) return;

        const ccontext = canvas.getContext("2d");
        if(!ccontext) return;

        let animationFrameId: number;

        const loop = () => {
            ccontext.clearRect(0, 0, canvas.width, canvas.height);
            ccontext.fillStyle = "purple";
            ccontext.fillRect(10,10,30,30);

            animationFrameId = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(animationFrameId);
    },
        []);

    return(
        <canvas ref={canvasReference} height={400} width={600}/>
    );
}