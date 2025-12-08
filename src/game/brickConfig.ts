
export const brickRows = 5;
export const brickCols = 8;

export const brickWidth = 10;
export const brickHeight = 5;
export const brickPadding = 5;

export const brickOffsetTop = 40;
export const brickOffsetLeft = 30;

export interface Brick{
    x: number;
    y: number;
    width: number;
    height: number;
    status: number; //either a 1 for alive or 0 for destroyed
}

