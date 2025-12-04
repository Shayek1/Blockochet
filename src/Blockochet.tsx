import {useRef, useEffect} from "react";

export default function Blockochet() {
const canvasReference = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const canvas = canvasReference.current;
        if(!canvas) return;

        const ccontext = canvas.getContext("2d");
        if(!ccontext) return;

        //creating the ball
        const ball = {
            color: "white",
            x: canvas.height / 2,
            y: canvas.width / 2,
            radius: 10
        }

        let animationFrameId: number;

        const loop = () => {
            ccontext.clearRect(0, 0, canvas.width, canvas.height);

            ccontext.fillStyle = ball.color; //will fill the ball as white
            ccontext.beginPath(); //starts the new shape
            ccontext.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); //draws the circle
            ccontext.fill(); //renders the filled shape

            //drawing the border
            ccontext.strokeStyle = "black";
            ccontext.lineWidth = 2;

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