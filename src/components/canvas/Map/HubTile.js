import React from "react";
import { Rect, Image } from "react-konva";

function HubTile({ parkingLot, spacesAvailable, gridCellSize, hubImage, carImage }) {
    return (
        <>
            <Rect
                x={parkingLot.x * gridCellSize.width}
                y={parkingLot.y * gridCellSize.height}
                width={gridCellSize.width}
                height={gridCellSize.height}
                fillRadialGradientStartPoint={{ x: gridCellSize.width / 2, y: gridCellSize.height / 2 }}
                fillRadialGradientEndPoint={{ x: gridCellSize.width / 2, y: gridCellSize.height / 2 }}
                fillRadialGradientStartRadius={gridCellSize.width > gridCellSize.height ? gridCellSize.height : gridCellSize.width}
                fillRadialGradientColorStops={[0, "rgb(14, 82, 165)", 1, "rgb(19, 115, 236)"]}
                shadowBlur={5}
                stroke={"black"}
                strokeWidth={3}
            />
            <Image
                x={parkingLot.x * gridCellSize.width}
                y={parkingLot.y * gridCellSize.height + gridCellSize.height / 4}
                width={gridCellSize.width}
                height={gridCellSize.height / 2}
                image={hubImage}
                shadowBlur={5}
            />
            {!spacesAvailable.includes("R" + parkingLot.y + "C" + parkingLot.x) ?
                <Image
                    x={parkingLot.x * gridCellSize.width}
                    y={parkingLot.y * gridCellSize.height}
                    width={gridCellSize.width}
                    height={gridCellSize.height}
                    image={carImage}
                    shadowBlur={5}
                /> :
                null
            }
        </>
    );
}

export default HubTile;