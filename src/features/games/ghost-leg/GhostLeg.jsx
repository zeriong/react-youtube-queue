import React, { useEffect, useRef, useState } from "react";
import {jsonDeepCopy} from "../../../../shared/utils/common";
import {isDev} from "../../../../App";
import Prepare from "../../../components/common/Prepare";



const GhostLeg = () => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [ctx, setCtx] = useState();
    const [isDrawing, setIsDrawing] = useState(false);

    const [users, setUsers] = useState(8);

    const [coordinates, setCoordinates] = useState([]);
    const [bridgeCoordinates, setBridgeCoordinates] = useState([]);
    const [sortedCoordinates, setSortedCoordinates] = useState([]);

    const startTouchPoint = useRef(null);

    // todo: 1. coordinates 를 활용해서 하단 인풋에 해당하는 녀석에 결과 추가할 수 있도록 만들고
    //       2. 전체 결과보기 기능도 마찬가지로 추가해주어야함
    //       3. 시작 전에 인원을 정할지 이후 정책 만들어보기
    //       4. 현재는 선을 추가하는 방식이지만 전체 랜덤으로 돌릴지?... 그럴거면 제비뽑기가 낫잖아...
    //       5. 제비뽑기로 변경할까?

    useEffect(() => {
        console.log("이것은 데이터", coordinates)
    }, [coordinates]);

    const center = (array) => array.sort((a, b) => a - b).at(Math.floor(array.length / 2));
    const sort = (arr) => {
        const deepCopyArr = jsonDeepCopy(arr);
        deepCopyArr.map((arg) => {
            arg.sort((a, b) => a.y - b.y);
            return arg;
        });
        return deepCopyArr;
    };

    const init = () => {
        if (!ctx) return;
        const { width, height } = canvasRef.current;
        if (!width || !height) return;
        ctx.save();
        ctx.clearRect(0, 0, width, height);
        ctx.restore();
    };

    // 시작 시 직선 라인을 그리는 함수
    const drawBaseLine = () => {
        init();
        setBridgeCoordinates([]);

        const canvas = canvasRef.current;

        // canvas ref가 있을 때만 동작
        if (!canvas) return;

        const width = canvas.width;
        const height = canvas.height;
        const _arr = [];

        for (let i = 0; i < users; i++) {
            let startPosX = (i / users) * width + ((1 / users) * width) / 2;
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";
            ctx.moveTo(startPosX, 0);
            ctx.lineTo(startPosX, height);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            let arr = [
                { x: startPosX, y: 0 },
                { x: startPosX, y: height }
            ];
            _arr.push(arr);
        }
        setCoordinates(_arr);
    };
    function drawBridge() {
        if (!ctx) return;

        const { width, height } = canvasRef.current;
        if (!width || !height) return;

        for (let i = 0; i < users; i++) {
            let startPosX = (i / users) * width + ((1 / users) * width) / 2;
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";
            ctx.moveTo(startPosX, 0);
            ctx.lineTo(startPosX, height);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
        if (bridgeCoordinates.length < 1) return;
        bridgeCoordinates.forEach((item) => {
            let { startBridge, endBridge } = item;
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";
            ctx.moveTo(startBridge.x, startBridge.y);
            ctx.lineTo(endBridge.x, endBridge.y);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        });
    }

    const getTargetIndex = (x) => {
        const diff = coordinates.map((d) => Math.abs(d[0].x - x));
        const closest = Math.min(...diff);
        return diff.findIndex((d) => d === closest);
    };

    const startDrawing = ({ nativeEvent }) => {
        if (coordinates.length < 1) return;
        setIsDrawing(true);
        const { offsetX, offsetY } = nativeEvent;
        const targetIndex = getTargetIndex(offsetX);
        startTouchPoint.current = { targetIndex, x: offsetX, y: offsetY };
    };

    const finishDrawing = ({ nativeEvent }) => {
        if (coordinates.length < 1) return;
        setIsDrawing(false);
        const { offsetX, offsetY } = nativeEvent;
        const targetIndex = getTargetIndex(offsetX);

        const _startTouch = startTouchPoint.current;
        const _endTouch = { targetIndex, x: offsetX, y: offsetY };
        let startTouch = _startTouch;
        let endTouch = _endTouch;

        if (_startTouch.targetIndex > _endTouch.targetIndex) {
            startTouch = _endTouch;
            endTouch = _startTouch;
        }

        const startTargetX = coordinates[startTouch.targetIndex][0].x;
        const maxS = Math.max(startTargetX, endTouch.x, startTouch.x);
        const minS = Math.min(startTargetX, endTouch.x, startTouch.x);
        const centerS = center([startTargetX, endTouch.x, startTouch.x]);
        const xRatioS = (maxS - centerS) / (maxS - minS);
        const startYLen =
            startTouch.x - startTargetX >= 0 ? (endTouch.y - startTouch.y) / xRatioS : (endTouch.y - startTouch.y) * xRatioS;
        const startY = endTouch.y - startYLen;

        const endTargetX = coordinates[endTouch.targetIndex][0].x;
        const maxE = Math.max(endTargetX, endTouch.x, startTouch.x);
        const minE = Math.min(endTargetX, endTouch.x, startTouch.x);
        const centerE = center([endTargetX, endTouch.x, startTouch.x]);
        const xRatioE = (centerE - minE) / (maxE - minE);
        const endYLen =
            endTouch.x - endTargetX >= 0 ? (endTouch.y - startTouch.y) * xRatioE : (endTouch.y - startTouch.y) / xRatioE;
        const endY = endYLen + startTouch.y;

        if ((endTouch.targetIndex - startTouch.targetIndex) !== 1) {
            init();
            drawBridge();
            return;
        }
        const linkId = new Date().getTime() * Math.random();
        const newBridge = {
            startBridge: {
                targetIndex: startTouch.targetIndex,
                x: startTargetX,
                y: startY,
                linkId,
                linkIndex: endTouch.targetIndex
            },
            endBridge: {
                targetIndex: endTouch.targetIndex,
                x: endTargetX,
                y: endY,
                linkId,
                linkIndex: startTouch.targetIndex
            }
        };
        setBridgeCoordinates((prev) => {
            return [...prev, newBridge];
        });
    };

    const drawing = ({ nativeEvent }) => {
        if (ctx) {
            if (!isDrawing) return;

            const { offsetX, offsetY } = nativeEvent;
            const {x, y} = startTouchPoint.current;

            init();
            drawBridge();

            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
    };
    const clearContext = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setCoordinates([]);
        setBridgeCoordinates([]);
        setSortedCoordinates([]);
        console.clear();
    };

    const tracePath = (idx) => {
        if (sortedCoordinates.length < 1) return;
        init();
        drawBridge();
        const path = [];
        let currentLine = idx;
        let nodeIdx = 0;
        const usedBridge = new Set();
        let breakPoint = 0; // 무한 루프 방지

        while (breakPoint < 1000) {
            if (sortedCoordinates[currentLine].length === nodeIdx) break;
            const node = sortedCoordinates[currentLine][nodeIdx];
            path.push({ i: currentLine, x: node.x, y: node.y });

            if (!node.linkId) {
                nodeIdx++;
            } else if (usedBridge.has(node.linkId)) {
                const start = path[path.length - 2].i;
                const end = currentLine;

                if (start !== end) nodeIdx++;
                else {
                    currentLine = node.linkIndex;
                    nodeIdx = sortedCoordinates[currentLine].findIndex((el) => node.linkId === el.linkId);
                }
            } else {
                currentLine = node.linkIndex;
                nodeIdx = sortedCoordinates[currentLine].findIndex((el) => node.linkId === el.linkId);
                usedBridge.add(node.linkId);
            }
            breakPoint++;
        }

        for (let i = 0; i < path.length - 1; i++) {
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = "blue";
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.lineWidth = 5;

            ctx.moveTo(path[i].x, path[i].y);
            ctx.lineTo(path[i + 1].x, path[i + 1].y);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
    };

    const canvasResize = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth * 0.9;
            canvasRef.current.height = window.innerHeight * 0.7;
        }
    }

    useEffect(() => {
        if (bridgeCoordinates.length < 1) return;
        init();
        drawBridge();

        const temp = jsonDeepCopy(coordinates);

        bridgeCoordinates.forEach(({ startBridge, endBridge }) => {
            temp[startBridge.targetIndex].push(startBridge);
            temp[endBridge.targetIndex].push(endBridge);
        });

        setSortedCoordinates(sort(temp, "y"));
    }, [bridgeCoordinates]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerHeight * 0.7;

        const context = canvas.getContext("2d");
        context.strokeStyle = "red";
        context.lineJoin = "round";
        context.lineWidth = 3;
        contextRef.current = context;

        setCtx(context);

        // 리사이즈 이벤트
        window.addEventListener("resize", canvasResize);
        return () => {
            window.removeEventListener("resize", canvasResize);
        }
    }, []);

    return (
        <div className="min-w-full">
            {!isDev ? <Prepare/> :
                <div className="w-full grid place-items-center overflow-auto">
                    <div>
                        <label htmlFor="user-count">users : </label>
                        <input
                            type="number"
                            id="user-count"
                            value={users}
                            onChange={({target: {value}}) => {
                                if (value < 0) return;
                                setUsers(value);
                            }}
                        />

                        <button
                            className="p-4 bg-red-300"
                            onClick={drawBaseLine}
                        >
                            apply
                        </button>
                        <button
                            className="p-4 bg-gray-200"
                            onClick={clearContext}
                        >
                            reset
                        </button>
                        <div style={{width: window.innerWidth * 0.9}}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    border: "1px solid black",
                                    marginLeft: ((1 / users) * window.innerWidth * 0.9) / 2,
                                    marginRight: ((1 / users) * window.innerWidth * 0.9) / 2
                                }}
                            >
                                {coordinates.map((item, idx) => (
                                    <button key={idx} onClick={() => tracePath(idx)}>
                                        {idx + 1}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <canvas
                            className="border border-red-500 block"
                            ref={canvasRef}
                            onMouseDown={startDrawing}
                            onMouseMove={drawing}
                            onMouseUp={finishDrawing}
                        ></canvas>

                        <div style={{width: window.innerWidth * 0.9}}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    border: "1px solid black",
                                    marginLeft: ((1 / users) * window.innerWidth * 0.9) / 2,
                                    marginRight: ((1 / users) * window.innerWidth * 0.9) / 2
                                }}
                            >
                                {coordinates.map((item, idx) => (
                                    <input key={new Date().getTime() * idx} style={{maxWidth: 20}}/>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};


export default GhostLeg;
