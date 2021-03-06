import React from "react";
import { Stage } from "react-konva";
import Map from './map/Map';
import EditMap from './map/EditMap';
import Robot from './map/Robot';
import LinearProgress from '@material-ui/core/LinearProgress';
import indigo from '@material-ui/core/colors/indigo';
import { drawerWidth, MATERIAL_UI_APP_BAR_HEIGHT } from '../Configuration';

class MonitorInterface extends React.PureComponent {
    constructor(props) {
        super(props);
        let newParameters = this.calculateNewParameters();
        this.state = {
            stageHeight: newParameters.stageHeight,
            stageWidth: newParameters.stageWidth,
            horizontalPaddingInGridCells: newParameters.horizontalPaddingInGridCells,
            gridCellSize: newParameters.gridCellSize,
            visualGridOffset: newParameters.visualGridOffset,
        };
        this.checkForResize = this.checkForResize.bind(this);
        this.fromGridToCanvas = this.fromGridToCanvas.bind(this);
        this.fromCanvasToGrid = this.fromCanvasToGrid.bind(this);
    }

    calculateNewParameters() {
        let stageHeight = Math.max(window.innerHeight - MATERIAL_UI_APP_BAR_HEIGHT, 1);
        let stageWidth = Math.max(window.innerWidth - drawerWidth, 1);
        let horizontalPaddingInGridCells = (stageWidth / stageHeight > 16 / 9) ? 2 : 1;
        let gridCellSize = {
            height: stageHeight / (this.props.configuration.length + 1), // vertical padding is always 1 grid cell high
            width: stageWidth / (this.props.configuration[0].length + horizontalPaddingInGridCells)
        };
        let visualGridOffset = {
            x: gridCellSize.width * horizontalPaddingInGridCells / 2, // divide padding into left and right padding
            y: gridCellSize.height / 2
        };

        if (gridCellSize.height < 80 || gridCellSize.width < 160)
            this.tinyMap = true;
        else
            this.tinyMap = false;

        return {
            stageHeight: stageHeight,
            stageWidth: stageWidth,
            horizontalPaddingInGridCells: horizontalPaddingInGridCells,
            gridCellSize: gridCellSize,
            visualGridOffset: visualGridOffset,
        }
    }

    checkForResize() {
        let newParameters = this.calculateNewParameters();
        this.setState({
            stageHeight: newParameters.stageHeight,
            stageWidth: newParameters.stageWidth,
            horizontalPaddingInGridCells: newParameters.horizontalPaddingInGridCells,
            gridCellSize: newParameters.gridCellSize,
            visualGridOffset: newParameters.visualGridOffset
        });
    }

    componentDidMount() {
        window.addEventListener("resize", this.checkForResize);
    }

    componentDidUpdate(prevProps) {
        // Moving from simulator to parking lot or the other way around:
        if (this.props.simulatorInterface !== prevProps.simulatorInterface)
            this.checkForResize();
    }

    fromGridToCanvas(position) {
        return {
            x: this.state.visualGridOffset.x + position.col * this.state.gridCellSize.width,
            y: this.state.visualGridOffset.y + position.row * this.state.gridCellSize.height - this.state.gridCellSize.height / 50
        };
    }

    fromCanvasToGrid(position) {
        // The upper left of tile (0, 0) is (- gridCellSize.width / 2, - gridCellSize.height / 2)
        // visualGridOffset is:
        // (gridCellSize.width / 2, gridCellSize.height / 2) when horizontalPaddingInGridCells is 1
        // (gridCellSize.width, gridCellSize.height / 2) when horizontalPaddingInGridCells is 2
        var cellColumn = Math.floor(
            (position.x
                + this.state.gridCellSize.width / 2
                - this.state.gridCellSize.width / 2 * this.state.horizontalPaddingInGridCells
            )
            / this.state.stageWidth
            * (this.props.configuration[0].length + this.state.horizontalPaddingInGridCells) // horizontal padding cells are variable (1 or 2)
        );
        var cellRow = Math.floor(
            position.y
            / this.state.stageHeight
            * (this.props.configuration.length + 1) // vertical padding cells are always 1 height tall in total
        );

        return { row: cellRow, col: cellColumn };
    }

    static whyDidYouRender = true
    render() {
        var canvasRobotLocation = this.fromGridToCanvas(this.props.robotLocation);

        return (
            <main
                style={{ marginRight: drawerWidth, background: indigo }}
            >
                <div style={{ height: MATERIAL_UI_APP_BAR_HEIGHT }} />
                <Stage
                    width={this.state.stageWidth}
                    height={this.state.stageHeight}
                >
                    <Map
                        configuration={this.props.configuration}
                        gridCellSize={this.state.gridCellSize}
                        visualGridOffset={this.state.visualGridOffset}
                    />
                    <Robot
                        changeRobotTarget={this.props.changeRobotTarget}
                        simulatorLocalPathsProgress={this.props.simulatorLocalPathsProgress}
                        changeRobotIsCarrying={this.props.changeRobotIsCarrying}
                        fromCanvasToGrid={this.fromCanvasToGrid}
                        fromGridToCanvas={this.fromGridToCanvas}
                        globalPlanView={this.props.globalPlanView}
                        visualGridOffset={this.state.visualGridOffset}
                        simulatorInterface={this.props.simulatorInterface}
                        configuration={this.props.configuration}
                        // Prevents re-render because of different object with same values
                        cavasRobotLocationX={canvasRobotLocation.x}
                        cavasRobotLocationY={canvasRobotLocation.y}
                        carriedCar={this.props.carriedCar}
                        gridCellSize={this.state.gridCellSize}
                        simulationAboutToStartOrStarted={this.props.simulationAboutToStartOrStarted}
                        simulationStarted={this.props.simulationStarted}
                        robotCommands={this.props.robotCommands}
                        liftCarFromTile={this.props.liftCarFromTile}
                        dropCarOnTile={this.props.dropCarOnTile}
                        toggleSimulation={this.props.toggleSimulation}
                        changeRobotGridLocation={this.props.changeRobotGridLocation}
                    />
                    <EditMap
                        horizontalPaddingInGridCells={this.horizontalPaddingInGridCells}
                        tinyMap={this.tinyMap}
                        simulationAboutToStartOrStarted={this.props.simulationAboutToStartOrStarted}
                        fromCanvasToGrid={this.fromCanvasToGrid}
                        visualGridOffset={this.state.visualGridOffset}
                        simulatorInterface={this.props.simulatorInterface}
                        configuration={this.props.configuration}
                        gridCellSize={this.state.gridCellSize}
                        changeTileType={this.props.changeTileType}
                        changeCarStatusOnTile={this.props.changeCarStatusOnTile}
                        debugMode={this.props.debugMode}
                        simulationStarted={this.props.simulationStarted}
                        carRetrievedReplan={this.props.carRetrievedReplan}
                        carRequestedReplan={this.props.carRequestedReplan}
                        carArrivedReplan={this.props.carArrivedReplan}
                        robotTargetSimulator={this.props.robotTargetSimulator}
                    />
                </Stage>
                {
                    this.props.showLoader ?
                        <LinearProgress style={{ position: "fixed", left: 0, right: 0, bottom: 0 }} variant="query" />
                        :
                        null
                }
            </main>
        );
    }
}

export default MonitorInterface;
