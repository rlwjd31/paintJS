// reference : https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/moveTo
// canvas에 width와 height를 주지 않으면 그려지지 않는다.
// nico는 여기서 width와 height를 추가했지만 난 index.html에 속성으로 추가함!!
const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const brushWidth = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const save = document.getElementById("jsSave");
// set initial color
const INITIAL_COLOR = "#2c2c2c";

// 이 부분은 fill을 하지 않고 paint만 하고 저장을 했을 때 배경이 투명으로 저장되는 것을 방지하기 위함
// 우리가 설정한 건 html배경이지 canvas의 배경을  지정하지는 않아서 버그가 발생한다.
ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);
//
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

// add EventListener each colors
Array.from(colors).forEach((color) =>
    color.addEventListener("click", handleColorClick)
);

if (brushWidth) {
    brushWidth.addEventListener("input", handleRangeChange);
}

if (mode) {
    mode.addEventListener("click", handleModeClick);
}

function handleCM(event) {
    // event를 막아서 저장하지 못하게 한다.
    event.preventDefault();
}

function handleSave(event) {
    // image를 저장하기 위한 절차
    // 1. canvas의 데이터를 image처럼 얻는다.
    // 2. toDataURL()함수를 이용한다. -> from canvas api docs(mdn)
    // toDataURL()은 이미지 표현을 포함한 dataURL를 반환한다.
    const image = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");
    // anchor 태그안에 download 속성이 있다.
    link.href = image;
    // click()을 하면 download된다. 자동으로 click되게 설정함!!
    link.download = "painJS[🖊]";
    link.click();
}

function handleCanvasClick(event) {
    if (filling) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function handleModeClick(event) {
    if (filling === true) {
        filling = false;
        event.target.innerHTML = "Fill";
    } else {
        filling = true;
        event.target.innerHTML = "Paint";
    }
}

function handleRangeChange(event) {
    const changedWidth = event.target.value;
    ctx.lineWidth = changedWidth;
}

function handleColorClick(event) {
    const color = event.target.style["backgroundColor"];
    ctx.strokeStyle = color;
    ctx.fillStyle = color; // 배경을 채우기 위해서
}

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
}

// onMouseMove 함수에서 clientX와 clientY는
// 윈도우 전체 내에서 마우스 위치값을 나타내는 값이다.
// offset은 canvas내에서의 마우스 위치이다. -> 이걸로 진행!!!
const onMouseMove = (event) => {
    const { offsetX: x, offsetY: y } = event;

    if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        // path는 선으로 생각하면 되며 moveTo는 x, y좌표로 path를 옮기는 것이다.
    } else {
        ctx.lineTo(x, y);
        ctx.stroke(); // 그리는 것을 rendering한다. 즉, 적용한다.
        // ctx.closePath();
    }

    // 시작점에서 끝점까지 라인을 이어져서 그리기 위함.

    // beginPath() : Starts a new path by emptying the list of sub-paths. Call this method
    // when you want to create a new path.

    // moveTo() : Moves the starting point of a new sub-path to the (x, y) coordinates

    // lineTo() : Connects the last point in the current sub-path to the specified (x, y)
    //  coordinates straight line.
};

// mouse가 계속 눌려있는 상태
const onMouseDown = (event) => {
    startPainting();
};

if (canvas) {
    // mouse가 움직일 때 event
    canvas.addEventListener("mousemove", onMouseMove);
    // 마우스를 누르고 있는 상태 이벤트
    canvas.addEventListener("mousedown", startPainting);
    // 마우스를 놓았을 때
    // mouseup에서 mouseleave와 같이 painting=fasle만 넣지 않는 이유는 line을 그려야 하기 때문이다?
    canvas.addEventListener("mouseup", stopPainting);
    // canvas를 벗어났을 때 event
    canvas.addEventListener("mouseleave", stopPainting);
    // add click event -> 배경색을 채우기 위해서
    canvas.addEventListener("click", handleCanvasClick);
    // 사진을 우클릭해서 저장할 수 있는데 우클릭해서 나오는 것이 contextmenu이다.
    // 사람들이 다운로드를 받지 못하게 설정하고 싶을 때 사용한다.
    canvas.addEventListener("contextmenu", handleCM);
}

if (save) {
    save.addEventListener("click", handleSave);
}

// 캔버스를 클릭하는 순간을 인지하고 painting을 시작해야 한다.
// mouse를 놓게 되면 끝내게 해야 함.

// Array.from(colors) -> colors가 collection인 object이므로 array로 변환해준다.
// Array.from()은 object를 array로 바꿔준다.