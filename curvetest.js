var inputArray;
var inputWord;
var theNoise;
var count = 0;
var sensitivity = 3;
var doubvarouch = false;
var myFont;
var tmpSize = 20;
var fstword = "滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。" +
    "白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢。古今多少事，都付笑谈中。";

function preload() {
    //myFont = loadFont('assets/fzdys.ttf');
}

function setup() {
    var cvs = createCanvas(windowWidth, windowHeight);
    cvs.mouseReleased(detect);
    noStroke();
    colorMode(HSB,360,100,100,1);
    ellipseMode(CENTER);
    fill(100);
    background(0,0,100);
    inputArray = new myPoints();
    inputWord = new myWordConsole(fstword);
    theNoise = new perlinController(1000,2);
    theNoise.generate();
}

class myPoints{
    constructor() {
        this.list = [];
        this.color = createVector(random(360),100,100);
        this.prePos = createVector(0,0);
        this.color = createVector(random(360),100,100);
        this.updateByMouse = function () {
            var nowPos = createVector(mouseX,mouseY);
            if (this.prePos !== nowPos) {
                this.list[this.list.length] = new myPoint(mouseX, mouseY);
                this.prePos = nowPos;
            }
        }
        this.updateByNoise = function (x,y) {
            this.list[this.list.length] = new myPoint(x, y);
        }
        this.reset = function () {
            this.list = [];
        }
        this.draw = function () {
            if(this.list.length>0) {
                for(var i = 1; i < this.list.length - 1; i++) {
                    fill(this.color.x,this.color.y,this.color.z);
                    stroke(360,0,0);
                    beginShape()
                    curveVertex(this.list[i-1].x, this.list[i-1].y);
                    curveVertex(this.list[i-1].x, this.list[i-1].y);
                    curveVertex(this.list[i].x, this.list[i].y);
                    curveVertex(this.list[i+1].x, this.list[i+1].y);
                    curveVertex(this.list[i+1].x, this.list[i+1].y);
                    endShape();

                    //line(this.list[i].x,this.list[i].y,this.list[i+1].x,this.list[i+1].y)
                    //最后一个项就是初始值0
                    this.list[i].dis = Math.pow(Math.pow(this.list[i].x-this.list[i+1].x,2)+Math.pow(this.list[i].y-this.list[i+1].y,2),0.5);
                }
            }
        }
        this.clear = function () {
            this.list = [];
        }
    }
}

class myPoint{
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.size = 10;
        this.dis = 0 ;
    }
}

class myWordConsole {
    constructor(word,theArray) {
        this.array = theArray;
        this.word = word;
        this.maxLength = 5;
        this.lowDis = 20;
        this.list = [];
        this.reset = function (theArray) {
            this.array = theArray;
            this.list = [];
            this.maxLength = 5;
        }
        this.update = function () {
            var lineLen = 0;
            //全部扫一遍获得总长度
            if(this.array.list.length > 0) {
                for (var i = 0; i < this.array.list.length; i++) {
                    lineLen += this.array.list[i].dis;
                }
                this.maxLength = int(lineLen/this.lowDis);
                var singleDis = this.lowDis;
                //算出每节的长度
                //var singleDis = lineLen / (this.word.length + 2);

                var currentDis = 0;
                var currentVertex = 0;

                for (var i = 0; i < this.maxLength-1; i++) {
                    currentDis += singleDis;
                    //print(currentVertex);
                    if (currentDis < this.array.list[currentVertex].dis) {

                    } else {
                        while(currentDis >= this.array.list[currentVertex].dis && currentVertex < this.array.list.length-1) {
                            var nowDis = this.array.list[currentVertex].dis;
                            currentDis -= nowDis;
                            currentVertex += 1;
                        }
                    }
                    var solution = KandB(this.array.list[currentVertex].x, this.array.list[currentVertex].y, this.array.list[currentVertex + 1].x, this.array.list[currentVertex + 1].y);
                    var rate = currentDis / this.array.list[currentVertex].dis;
                    var x = (this.array.list[currentVertex + 1].x - this.array.list[currentVertex].x) * rate + this.array.list[currentVertex].x;
                    if(this.array.list[currentVertex + 1].x - this.array.list[currentVertex].x === 0){
                        var y = (this.array.list[currentVertex+1].y - this.array.list[currentVertex].y)* rate + this.array.list[currentVertex].y;
                    }
                    else {
                        var y = solution.x * x + solution.y;
                    }
                    if(this.list[i] !== new myWord(x, y, tmpSize, this.word[i], solution.x,1))
                        this.list[i] = new myWord(x, y, tmpSize, this.word[i], solution.x,1);
                }
            }
        }
        this.draw = function () {
            for(var i = 0; i < this.list.length; i++) {
                if(this.list[i].drew === false)
                    this.list[i].draw();
                //print("drawn");
            }
        }
    }
}

class myWord{
    constructor(x,y,s,str,k,dir) {
        this.drew = false;
        this.x = x;
        this.y = y;
        this.size = s*(random(1)+0.5);
        this.word = str;
        //决定字的朝向
        this.ang = abs(atan2( k,1));
        this.dir = dir;
        this.draw = function () {
            this.drew = true;
            translate(this.x,this.y);
            rotate(this.dir*this.ang);
            textSize(this.size);
            //fill(random(360),100,100);
            fill(360,0,0);
            text(this.word, 0, 0);
            rotate(-this.dir*this.ang);
            translate(-this.x,-this.y);
        }
    }
}

function KandB(x1,y1,x2,y2) {
    var ans = createVector(0,0);
    ans.x = (y1-y2)/(x1-x2);
    ans.y = (x1*y2-x2*y1)/(x1-x2);
    return ans;
}

function mouseReleased(){
    var one = 1;
}
function detect() {
    doubvarouch = true;
    inputArray.color = createVector(random(360),100,100);
    inputWord.update();
    inputWord.draw();
    print("relesed");
}

class perlinController{
    constructor(num,len) {
        this.list = [];
        this.maxNum = num;
        this.stepLength = len;
        this.generate = function () {
            while(this.list.length < this.maxNum){
                this.list[this.list.length] = new noisePoint(this.stepLength);
            }
        }
        this.update = function () {
            for(let i = 0;i < this.list.length;i++) {
                if(this.list[i].life > 0) {
                    this.list[i].update();
                }else{
                    this.list[i] = new noisePoint(this.stepLength);
                }
            }
        }
    }
}
class noisePoint{
    constructor(stepLength) {
        this.step = stepLength;
        this.scale = 800.0;
        this.array = new myPoints();
        this.console = new myWordConsole(fstword,this.array);
        this.life = int(random(500))+100;
        this.color = createVector(int(random(360)),100,100);
        this.pos = createVector(int(random(windowWidth/10)*10),int(random(windowHeight/10)*10));

        this.update = function () {
            var arg = 0.0;
            arg = noise(this.pos.x/windowWidth,this.pos.y/windowHeight) *2 *PI;
            this.pos.x += cos(arg)*this.step;
            this.pos.y += sin(arg)*this.step;
            this.life -= 1;
            this.array.updateByNoise(this.pos.x,this.pos.y);
            this.array.draw();
            if(this.array.list.length>5){
                this.console.update();
                this.console.draw();
            }
            if(this.pos.x>windowWidth || this.pos.x<0 || this.pos.y>windowHeight || this.pos.y<0){
                this.life = 0;
            }
        }
    }
}

//主程序
function draw() {
    background(360,0,100);
    /*
    if(doubvarouch){
        inputArray.clear();
        inputWord.clear();
        doubvarouch = false;
        inputArray.color = createVector(random(360),100,100);
    }
    if(mouseIsPressed) {
        inputArray.updatePyMouse();
    }
    inputArray.draw();
    */
    theNoise.update();
}
