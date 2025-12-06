import {useRef, useEffect, useState} from "react";

export default function Blockochet() {
const canvasReference = useRef<HTMLCanvasElement | null>(null)


    //creating the paddle
    const [paddle, setPaddle] = useState({
        height: 20,
        width: 100,
        x: 150,
        y:450,
        color: "purple"
    });

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
            radius: 10,

            //speeds
            dx: 2, //horizontal
            dy: 2 //vertical
        };

        let animationFrameId: number;

        const loop = () => {
            ccontext.clearRect(0, 0, canvas.width, canvas.height);

            //updating ball positions
            ball.x += ball.dx;
            ball.y += ball.dy;

            //wall collision
            //Left and right walls
            if (ball.x-ball.radius < 0 || ball.x + ball.radius > canvas.width){
                ball.dx *= -1;
            }

            //top wall - only collision on the ceiling as the balls  bottom
            if (ball.y - ball.radius < 0){
                ball.dy *= -1;
            }

            //drawing the ball
            ccontext.fillStyle = ball.color; //will fill the ball as white
            ccontext.beginPath(); //starts the new shape
            ccontext.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); //draws the circle
            ccontext.fill(); //renders the filled shape

            //drawing the border
            ccontext.strokeStyle = "black";
            ccontext.lineWidth = 2;

            //drawing the paddle
            ccontext.fillStyle = paddle.color;
            ccontext.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

            ccontext.strokeStyle = "black";
            ccontext.lineWidth = 2;
            ccontext.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height)

            animationFrameId = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(animationFrameId);
    },
        []);

    return(
        <canvas ref={canvasReference} height={600} width={600}/>
    );
}