import {useRef, useEffect, useState} from "react";
/* import {brickHeight,
    brickWidth,
    brickOffsetLeft,
    brickOffsetTop,
    brickPadding,
    brickRows,
    brickCols
} from "./game/brickConfig.ts"; */
import {brickCreation} from "./game/brickCreation.ts";


export default function Blockochet() {
const canvasReference = useRef<HTMLCanvasElement | null>(null)


    //creating the paddle
    const paddle = useRef({
        height: 20,
        width: 100,
        x: 250,
        y:550,
        color: "purple"
    });

    const paddleSpeed = 10;

    const[gameOver, setGameOver] = useState(false);
    const[resetButton, setResetButton] = useState(0);
    function restartGame(){
        setGameOver(false);
        setResetButton(prev => prev + 1);

    }

    //will keep record of what button is pressed
    const controls = useRef({
        left: false,
        right: false
    });

    const bricksRef = useRef(brickCreation());




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



        const bricks = bricksRef.current;

        //when game resets - bricks
        bricks.forEach(row =>
        row.forEach(b => b.status = 1)
        );


            function showGameOver(ccontext: CanvasRenderingContext2D, canvas:HTMLCanvasElement) {
                // dark overlay
                ccontext.fillStyle = "rgba(0, 0, 0, 0.6)";
                ccontext.fillRect(0, 0, canvas.width, canvas.height);

                // text
                ccontext.fillStyle = "white";
                ccontext.font = "48px Arial";
                ccontext.textAlign = "center";
                ccontext.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
            }



            let animationFrameId: number;

        const loop = () => {
            ccontext.clearRect(0, 0, canvas.width, canvas.height);

            //updating ball positions
            ball.x += ball.dx;
            ball.y += ball.dy;

            //PADDLE
            //movement
            if (controls.current.left){
                paddle.current.x -= paddleSpeed
            }

            if (controls.current.right){
                paddle.current.x += paddleSpeed
            }

            //keeping the paddle within the canvas
            if (paddle.current.x < 0) paddle.current.x = 0;
            if (paddle.current.x + paddle.current.width > canvas.width){
                paddle.current.x = canvas.width - paddle.current.width
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
            const paddleTop = paddle.current.y;

            //checking for collision
            if (ballBottom >= paddleTop){
                if (
                    ball.x + ball.radius >= paddle.current.x &&
                    ball.x - ball.radius <= paddle.current.x + paddle.current.width
                ){
                    ball.dy = -Math.abs(ball.dy);

                    const hitPoint = ball.x - (paddle.current.x + paddle.current.width / 2);
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
            ccontext.fillStyle = paddle.current.color;
            ccontext.fillRect(paddle.current.x, paddle.current.y, paddle.current.width, paddle.current.height);

            ccontext.strokeStyle = "black";
            ccontext.lineWidth = 2;
            ccontext.strokeRect(paddle.current.x, paddle.current.y, paddle.current.width, paddle.current.height)

            //drawing the bricks
            for (let row = 0; row < bricks.length; row++){
                for(let col =0; col < bricks[row].length; col++){
                    const brick = bricks[row][col];

                    if(brick.status === 1){
                        ccontext.fillStyle = "red";
                        ccontext.fillRect(brick.x, brick.y, brick.width, brick.height);

                        ccontext.strokeStyle = "black";
                        ccontext.lineWidth = 2;
                        ccontext.strokeRect(brick.x, brick.y, brick.width, brick.height);
                    }
                }
            }

            //brick collision
            for (let row = 0; row < bricks.length; row++) {
                for (let col = 0; col < bricks[row].length; col++) {

                    const brick = bricks[row][col];

                    if (brick.status === 1) {
                        // Collision check
                        if (
                            ball.x + ball.radius > brick.x &&
                            ball.x - ball.radius < brick.x + brick.width &&
                            ball.y + ball.radius > brick.y &&
                            ball.y - ball.radius < brick.y + brick.height
                        ) {
                            ball.dy *= -1;        // go in opposite direction/bounce off
                            brick.status = 0;     // remove brick
                        }
                    }
                }
            }


            //Game Over
            if (ball.y - ball.radius > canvas.height){
                cancelAnimationFrame(animationFrameId);
                showGameOver(ccontext, canvas);
                setGameOver(true);
                return;


            }




            animationFrameId = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(animationFrameId);
    },
        [resetButton, paddle]);

    return(
        <div     style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
        <canvas  ref={canvasReference} height={600} width={600}       style={{
            display: "block",
            border: "2px solid white",
        }}/>

            {gameOver && (
                <button onClick={restartGame}
                        style={{
                            position:"absolute",
                            padding: "12px 24px",
                            fontSize: "18px",
                            cursor: "pointer",
                            borderRadius: "8px",
                            marginTop: "75px"
                        }}>
                    Restart
                </button>
            )}

            <div style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "20px",
                touchAction: "none"
            }}>
                <button
                    style={{
                        width: "80px",
                        height: "80px",
                        fontSize: "32px"
                    }}
                    onTouchStart={() => (controls.current.left = true)}
                    onTouchEnd={() => (controls.current.left = false)}
                    onMouseDown={() => (controls.current.left = true)}
                    onMouseUp={() => (controls.current.left = false)}
                >
                    ⬅
                </button>

                <button
                    style={{
                        width: "80px",
                        height: "80px",
                        fontSize: "32px"
                    }}
                    onTouchStart={() => (controls.current.right = true)}
                    onTouchEnd={() => (controls.current.right = false)}
                    onMouseDown={() => (controls.current.right = true)}
                    onMouseUp={() => (controls.current.right = false)}
                >
                    ➡
                </button>
            </div>


        </div>
    );
}