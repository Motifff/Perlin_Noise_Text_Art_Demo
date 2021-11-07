var inputArray;
var inputWord;
var imitateImage;
var imitateImage0;
var imitateImage1;
var imitateImage2;
var theNoise;
var count = 0;
var sensitivity = 3;
var doubvarouch = false;
var myFont;
var tmpSize = 10;
var fstword = "滚滚长江东逝水，浪花淘尽英雄。是非成败转头空。青山依旧在，几度夕阳红。" +
    "白发渔樵江渚上，惯看秋月春风。一壶浊酒喜相逢。古今多少事，都付笑谈中。";

var rhythm = new Array();    
var rhythm1 = "海客谈瀛洲，烟涛微茫信难求； 越人语天姥，云霞明灭或可睹。 天姥连天向天横，势拔五岳掩赤城。 天台四万八千丈，对此欲倒东南倾。 我欲因之梦吴越，一夜飞度镜湖月。 湖月照我影，送我至剡溪。 谢公宿处今尚在，渌水荡漾清猿啼。 脚著谢公屐，身登青云梯。 半壁见海日，空中闻天鸡。 千岩万转路不定，迷花倚石忽已暝。 熊咆龙吟殷岩泉，栗深林兮惊层巅。 云青青兮欲雨，水澹澹兮生烟。 列缺霹雳，丘峦崩摧。 洞天石扉，訇然中开。 青冥浩荡不见底，日月照耀金银台。 霓为衣兮风为马，云之君兮纷纷而来下。 虎鼓瑟兮鸾回车，仙之人兮列如麻。 忽魂悸以魄动，恍惊起而长嗟。 惟觉时之枕席，失向来之烟霞。 世间行乐亦如此，古来万事东流水。 别君去兮何时还？且放白鹿青崖间。须行即骑访名山。 安能摧眉折腰事权贵，使我不得开心颜！";
var rhythm2 = "吾友太乙子，餐霞卧赤城。欲寻华顶去，不惮恶溪名。歇马凭云宿，扬帆截海行。高高翠微里，遥见石梁横。";
var rhythm3 = "孤山寺北贾亭西，水面初平云脚低。几处早莺争暖树，谁家新燕啄春泥。乱花渐欲迷人眼，浅草才能没马蹄。最爱湖东行不足，绿杨阴里白沙堤。";

function preload() {
    //myFont = loadFont('assets/fzdys.ttf');
    imitateImage0 = loadImage('assets/0.jpg');
    imitateImage1 = loadImage('assets/1.jpg');
    imitateImage2 = loadImage('assets/2.jpg');
}


function setup() {
    var cvs = createCanvas(windowWidth, windowHeight);
    cvs.mouseReleased(detect);
    //frameRate(30);
    noStroke();
    //colorMode(HSB,360,100,100,1);
    ellipseMode(CENTER);
    fill(100);
    background(255,255,255);
    imitateImage = createImage(windowWidth,windowHeight);

    //imitateImage0.resize(windowWidth/3,windowHeight);
    imitateImage2.resize(windowWidth,windowHeight);
    //imitateImage1.resize(windowWidth/3,windowHeight);
    //imitateImage2.resize(windowWidth/3,windowHeight);

    imitateImage.loadPixels();
    for(let i = 0 ;i < windowWidth; i++) {
        for(let j = 0; j< windowWidth;j++){
            let c = imitateImage2.get(i,j);
            imitateImage.set(i,j,c);
        }
    }
    imitateImage.updatePixels();
    /*
    imitateImage.loadPixels();
    for(let i = 0 ;i < windowWidth; i++){
        for(let j = 0; j< windowHeight; j++){
            if(i < windowWidth/3){
                var c = imitateImage0.get(i,j);
                imitateImage.set(i,j,c);
            }else if(i < windowWidth/3 *2){
                var c = imitateImage1.get(i-width/3,j);
                imitateImage.set(i,j,c);
            }else{
                var c = imitateImage2.get(i-width/3*2,j);
                imitateImage.set(i,j,c);
            }
        }
    }
    imitateImage.updatePixels();
    */

    inputArray = new myPoints();
    inputWord = new myWordConsole(fstword);
    theNoise = new perlinController(600,2);
    theNoise.generate();

    rhythm[0] = rhythm1;
    rhythm[1] = rhythm2;
    rhythm[2] = rhythm3;
    //print(windowWidth," ",windowHeight);
    //console.log(rhythm);
    //image(imitateImage,0,windowWidth/3);
}

class myPoints{
    constructor() {
        this.list = [];
        this.color = createVector(100,100,100);
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
                    fill(255,255,255,0);
                    stroke(255,255,255,0);
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
        this.wordPos = 0;
        this.maxLength = 5;
        this.lowDis = 10;
        this.list = [];
        this.currentPos = 0;
        this.color = color(0,0,0);
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
                if(this.list.length<this.maxLength-1){
                    currentDis += singleDis;
                    //print(this.currentPos);
                    if (currentDis < this.array.list[this.currentPos].dis) {

                    } else {
                        while(currentDis >= this.array.list[this.currentPos].dis && this.currentPos < this.array.list.length-1) {
                            var nowDis = this.array.list[this.currentPos].dis;
                            currentDis -= nowDis;
                            this.currentPos += 1;
                        }
                    }
                    var solution = KandB(this.array.list[this.currentPos].x, this.array.list[this.currentPos].y, this.array.list[this.currentPos + 1].x, this.array.list[this.currentPos + 1].y);
                    var rate = currentDis / this.array.list[this.currentPos].dis;
                    var x = (this.array.list[this.currentPos + 1].x - this.array.list[this.currentPos].x) * rate + this.array.list[this.currentPos].x;
                    if(this.array.list[this.currentPos + 1].x - this.array.list[this.currentPos].x === 0){
                        var y = (this.array.list[this.currentPos+1].y - this.array.list[this.currentPos].y)* rate + this.array.list[this.currentPos].y;
                    }
                    else {
                        var y = solution.x * x + solution.y;
                    }
                    //print(this.word);
                    this.list[this.list.length] = new myWord(x, y, tmpSize, rhythm[this.word][this.wordPos], solution.x,1,this.color);
                    this.wordPos += 1;
                }
            }
        }
        this.draw = function () {
            /*
            for(let i = 0; i < this.list.length; i++) {
                if(this.list[i].drew === false)
                    this.list[i].draw();
                //print("drawn");
            }
            */
            if(this.list.length>0)
                this.list[this.list.length-1].draw();
        }
    }
}

class myWord{
    constructor(x,y,s,str,k,dir,inColor) {
        this.drew = false;
        this.x = x;
        this.y = y;
        this.size = s*(random(1)+0.5);
        this.word = str;
        //决定字的朝向
        this.ang = abs(atan2( k,1));
        this.dir = dir;
        this.color = inColor;
        this.draw = function () {
            this.color = imitateImage.get(this.x,this.y);
            translate(this.x,this.y);
            rotate(this.dir*this.ang);
            textSize(this.size);
            //fill(random(360),100,100);
            fill(this.color);
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
    //print("relesed");
}

class perlinController{
    constructor(num,len) {
        this.list = [];
        this.maxNum = num;
        this.stepLength = len;
        this.generate = function () {
            while(this.list.length < this.maxNum){
                this.list[this.list.length] = new noisePoint(random(3)+2);
            }
        }
        this.update = function () {
            for(let i = 0;i < this.list.length;i++) {
                if(this.list[i].life > 0) {
                    this.list[i].update();
                }else{
                    this.list[i] = new noisePoint(random(3)+2);
                }
            }
        }
    }
}

//actually this the brush place
class noisePoint{
    constructor(stepLength) {
        this.step = stepLength*2;
        this.scale = 800.0;
        this.array = new myPoints();
        this.life = int(random(500))+100;
        this.color = createVector(int(random(360)),100,100);
        this.pos = createVector(int(random(windowWidth)),int(random(imitateImage.height)));
        this.area = int(this.pos.x/(windowWidth/3));
        this.console = new myWordConsole(this.area,this.array);

        this.update = function () {
            var arg = 0.0;
            arg = noise(this.pos.x/this.scale,this.pos.y/this.scale) *8 *PI;
            this.pos.x += cos(arg)*this.step;
            this.pos.y += sin(arg)*this.step;
            this.life -= 1;
            this.array.updateByNoise(this.pos.x,this.pos.y);
            this.array.draw();
            if(this.array.list.length>2){
                this.console.update();
                this.console.draw();
            }
            if(this.pos.x>windowWidth/3*(this.area+1) || this.pos.x<windowWidth/3*(this.area) || this.pos.y>imitateImage.height || this.pos.y<0){
                this.life = 0;
                //print(this.pos.x,"+",this.pos.y,"+",this.area);
                //print("killed");
            }
        }
    }
}

//主程序
function draw() {
    //background(360,0,100);
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
