
export const brickRows = 5;
export const brickCols = 9;

export const brickWidth = 50;
export const brickHeight = 15;
export const brickPadding = 10;

export const brickOffsetTop = 40;
export const brickOffsetLeft = 30;

export interface Brick{
    x: number;
    y: number;
    width: number;
    height: number;
    status: number; //either a 1 for alive or 0 for destroyed
}

