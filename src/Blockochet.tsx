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

    const paddleSpeed = 10;

    //will keep record of what button is pressed
    const controls = useRef({
        left: false,
        right: false
    });

    //key listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") controls.current.left = true;
            if (e.key === "ArrowRight") controls.current.right = true;
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") controls.current.left = false;
            if(e.key === "ArrowRight") controls.current.right = false;
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return() => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        }
    }, []);

    //the game loop
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

            //PADDLE
            //movement
            if (controls.current.left){
                paddle.x -= paddleSpeed
            }

            if (controls.current.right){
                paddle.x += paddleSpeed
            }

            //keeping the paddle within the canvas
            if (paddle.x < 0) paddle.x = 0;
            if (paddle.x + paddle.width > canvas.width){
                paddle.x = canvas.width - paddle.width
            }

            //wall collision
            //Left and right walls
            if (ball.x-ball.radius < 0 || ball.x + ball.radius > canvas.width){
                ball.dx *= -1;
            }

            //top wall - only collision on the ceiling as the balls  bottom
            if (ball.y - ball.radius < 0){
                ball.dy *= -1;
            }

            //PADDLE COLLISION
            const ballBottom = ball.y + ball.radius;
            const paddleTop = paddle.y;

            //checking for collision
            if (ballBottom >= paddleTop){
                if (
                    ball.x + ball.radius >= paddle.x &&
                    ball.x - ball.radius <= paddle.x + paddle.width
                ){
                    ball.dy = -Math.abs(ball.dy);

                    const hitPoint = ball.x - (paddle.x + paddle.width / 2);
                    ball.dx = hitPoint * 0.05;
                }
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