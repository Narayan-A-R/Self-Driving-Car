const carCanvas=document.getElementById("carCanvas");
const carCtx=carCanvas.getContext("2d");
const networkCanvas=document.getElementById("networkCanvas");
const networkCtx=networkCanvas.getContext("2d");
carCanvas.width=200;
networkCanvas.width=300;


const road= new Road(carCanvas.width/2,carCanvas.width*0.9);
const N=1;
let gen=1;
let genMax=50;
let temperature=0.5;
simulateGenerations();


function simulateGenerations(){
    if(gen>genMax) return;
    const cars=generateCars(N);
    let bestCars=cars.slice(0,N/10);
    if(localStorage.getItem("bestBrains")){
        let parentBrains=JSON.parse(localStorage.getItem("bestBrains"));
        let k = 0;
        for (let i = 0; i < parentBrains.length; i++) {
            if (k >= cars.length) break;
            for (let j = 0; j < parentBrains.length; j++,k++) {
                if (k >= cars.length) break;
                if(k==0){
                    cars[i].brain=parentBrains[i];
                    continue;
                }
                if (i === j) {
                    cars[k].brain=parentBrains[i];
                    NeuralNetwork.mutate(cars[k].brain, temperature);
                } else {
                    cars[k].brain = NeuralNetwork.breed(parentBrains[i], parentBrains[j], temperature);
                }
            }
        }
    }
    let carsTraffic=[];
    let amounOftraffic=10;
    for(let i=0;i<amounOftraffic;i++) carsTraffic.push(new randomCar(road));
    const traffic=carsTraffic;

    let startTime=null;
    animate();

    function animate(time){
        if(startTime==null) startTime=time;
        if(time-startTime>5000*Math.log(gen+1)){
            save(bestCars);
            console.log(gen+" "+temperature);
            gen++;
            temperature+=0;
            simulateGenerations();
            return;
        }
        for(let i=0;i<traffic.length;i++) traffic[i].update(road.borders,[]);
        for(let i=0;i<cars.length;i++) cars[i].update(road.borders,traffic);
        
        bestCars=fitnessFunc(cars);

        drawMovingObjects(bestCars[0],traffic,cars);
        

        Visualizer.drawNetwork(networkCtx,bestCars[0].brain);
        requestAnimationFrame(animate);
    }
}

function fitnessFunc(cars){
    return cars.sort((a,b)=>b.fitness-a.fitness).slice(0,Math.max(1,cars.length/10));
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
function save(bestCars){
    let bestBrains=[];
    for(let i=0;i<bestCars.length;i++) bestBrains.push(bestCars[i].brain);
    localStorage.setItem("bestBrains",JSON.stringify(bestBrains));
}
function discard(){
    localStorage.removeItem("bestBrains");
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
    y=-(Math.round(Math.random()*10)*200);
    width=30;
    height=50;
    speed=2;    
    return new Car(x,y,width,height,"Dummy",speed);
}
