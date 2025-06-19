const carCanvas=document.getElementById("carCanvas");
const carCtx=carCanvas.getContext("2d");
const networkCanvas=document.getElementById("networkCanvas");
const networkCtx=networkCanvas.getContext("2d");
carCanvas.width=200;
networkCanvas.width=300;


const road= new Road(carCanvas.width/2,carCanvas.width*0.9);
const N=100;
let gen=1;
let genMax=50;
let temperature=0.3;
simulateGenerations();


function simulateGenerations(){
    if(gen>genMax) return;
    const cars=generateCars(N);
    let bestCar=cars[0];
    if(localStorage.getItem("bestBrain")){
        for(let i=0;i<cars.length;i++){
            cars[i].brain=JSON.parse(localStorage.getItem("bestBrain"));
            if(i!=0){
                NeuralNetwork.mutate(cars[i].brain,temperature);
            }
        }
    }
    let carsTraffic=[];
    let amounOftraffic=13;
    for(let i=0;i<amounOftraffic;i++) carsTraffic.push(new randomCar(road));
    const traffic=carsTraffic;

    let startTime=null;
    animate();

    function animate(time){
        if(startTime==null) startTime=time;
        if(time-startTime>10000){
            save(bestCar);
            console.log(gen+" "+temperature);
            gen++;
            temperature-=0;
            simulateGenerations();
            return;
        }
        for(let i=0;i<traffic.length;i++) traffic[i].update(road.borders,[]);
        for(let i=0;i<cars.length;i++) cars[i].update(road.borders,traffic);
        
        bestCar=cars.find(
            c=>c.y==Math.min(
            ...cars.map(
                c=>c.y
            )
        ));

        drawMovingObjects(bestCar,traffic,cars);
        
        networkCtx.lineDashOffset=-time/50;
        Visualizer.drawNetwork(networkCtx,bestCar.brain);
        requestAnimationFrame(animate);
    }
}

function drawMovingObjects(bestCar,traffic,cars){
    carCanvas.height=window.innerHeight;
        networkCanvas.height=window.innerHeight;
        carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);
        road.draw(carCtx);
        for(let i=0;i<traffic.length;i++) traffic[i].draw(carCtx,"red");
        carCtx.globalAlpha=0.2;
        for(let i=0;i<cars.length;i++) cars[i].draw(carCtx,"blue");
        carCtx.globalAlpha=1;
        bestCar.draw(carCtx,"blue",true);
}
function save(bestCar){
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(Math.floor(road.laneCount/2)),100,30,50,"Ai"));
    }
    return cars;
}

function randomCar(road){
    lane=Math.round(Math.random()*(road.laneCount-1));
    x=road.getLaneCenter(lane);
    y=-(110+Math.round(Math.random()*10)*150);
    width=30;
    height=50;
    speed=2;    
    return new Car(x,y,width,height,"Dummy",speed);
}
