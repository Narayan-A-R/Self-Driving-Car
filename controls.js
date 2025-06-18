class Controls {
    constructor(type){
        this.forward=false;
        this.right=false;
        this.left=false;
        this.backward=false;

        switch (type) {
            case "Keys":
                this.#addKeyBoardListners();
                break;
            case "Dummy":
                this.forward=true;
                break;
            default:
                break;
        }

    }

    #addKeyBoardListners(){
        document.onkeydown=(event)=>{
            switch (event.key) {
                case "ArrowLeft":
                    this.left=true;
                    break;
                case "ArrowRight":
                    this.right=true;
                    break;
                case "ArrowUp":
                    this.forward=true;
                    break;
                case "ArrowDown":
                    this.backward=true;
                    break;
            
                default:
                    break;
            }
        }
        document.onkeyup=(event)=>{
            switch (event.key) {
                case "ArrowLeft":
                    this.left=false;
                    break;
                case "ArrowRight":
                    this.right=false;
                    break;
                case "ArrowUp":
                    this.forward=false;
                    break;
                case "ArrowDown":
                    this.backward=false;
                    break;
            
                default:
                    break;
            }
        }
    }
}