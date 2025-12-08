// brickCreation.ts
import {
    brickRows,
    brickCols,
    brickWidth,
    brickHeight,
    brickPadding,
    brickOffsetLeft,
    brickOffsetTop,
    type Brick
} from "./brickConfig";

export function brickCreation(): Brick[][] {
    const grid: Brick[][] = [];

    for (let row = 0; row < brickRows; row++) {
        const rowArr: Brick[] = [];
        for (let col = 0; col < brickCols; col++) {
            rowArr.push({
                x: brickOffsetLeft + col * (brickWidth + brickPadding),
                y: brickOffsetTop + row * (brickHeight + brickPadding),
                width: brickWidth,
                height: brickHeight,
                status: 1 //brick is present and not destroyed
            });
        }
        grid.push(rowArr);
    }

    return grid;
}
