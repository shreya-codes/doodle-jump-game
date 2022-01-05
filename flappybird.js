document.addEventListener('DOMContentLoaded',()=>{
    const grid=document.querySelector('.grid');
    const doodler=document.createElement('div');
    let doodlerLeftSpace=50
    let startPoint=50;
    let doodlerBottomSpace=startPoint
    let gameover= false
    let isJumping=true
    let platforms=[]
    let upTimerId;
    let downTimerId;
    let isGoingLeft=false
    let isGoingRight=false
    let leftTimerId;
    let rightTimerId;
    let FPS=60
    let score=0
    function createDoodler(){
        grid.appendChild(doodler);
        doodler.classList.add('doodler');
        
        doodlerLeftSpace=platforms[0].left;
        doodler.style.left=doodlerLeftSpace+'px';
        doodler.style.bottom=doodlerBottomSpace+'px';
        console.log(platforms[0].left,doodlerLeftSpace)
    }
    class Platform{
        constructor(platformBottom){
            this.bottom=platformBottom;
            this.left=Math.random()*(grid.offsetWidth-85);// gridwidth-platoformwidth
            this.visual=document.createElement('div');
            const visual=this.visual
            visual.classList.add('platform')
            visual.style.left=this.left+'px'
            visual.style.bottom=this.bottom+'px';
            grid.appendChild(visual)
        }
    }
    function createPlatforms(platformCount){
        for (let i=0; i <platformCount;i++){
            // console.log(grid.offsetHeight)
            let platformGap=grid.offsetHeight/platformCount;
            let platformBottom=100+i*platformGap
            let newPlatform=new Platform(platformBottom)
            platforms.push(newPlatform);
             console.log(platformGap,platformBottom)
        }
    }
    function movePlatforms(){
        
        if(doodlerBottomSpace>200){
            //console.log(platforms)
            platforms.forEach(platform=>{
                platform.bottom-=5;
                let visual=platform.visual;
                visual.style.bottom=platform.bottom+'px';

                if(platform.bottom<10){
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform');
                    platforms.shift()
                    let newPlatform=new Platform(600)
                    platforms.push(newPlatform)
                    score++
                }
           
            })
        }
        
    }
    function jump(){
        clearInterval(downTimerId)
        isJumping=true;
        upTimerId=setInterval(function(){
            doodlerBottomSpace+=10;
            doodler.style.bottom=doodlerBottomSpace+'px';
            if(doodlerBottomSpace>(startPoint+300)){
                fall()
            }
        },1000/FPS)
    }
    function fall(){
        clearInterval(upTimerId);
        isJumping= false;
        downTimerId=setInterval(function(){
            doodlerBottomSpace-=5;
            doodler.style.bottom=doodlerBottomSpace+'px';
            if (doodlerBottomSpace<=0){
                gameOver();
            }
            platforms.forEach(platform => {
                if((doodlerBottomSpace>=platform.bottom)&&(doodlerBottomSpace<platform.bottom+15)&&((doodlerLeftSpace+60)>=platform.left)&&(doodlerLeftSpace)<=(platform.left+85)&& !isJumping){
                    console.log('landed');
                    startPoint=doodlerBottomSpace
                    console.log('here')
                    jump();
                }
            });
        },1000/FPS)
        
    }
    function gameOver(){
        console.log('gamever')
        gameover=true;
        while(grid.firstChild){
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML="Score: "+score
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);

    }
    function control(e){
        if(e.key==="ArrowLeft"){
            moveLeft();

        }
        else if(e.key==="ArrowRight"){
            moveRight();

        }
        else if(e.key==="ArrowUp"){
            moveStraight();
        }
    }
    function moveLeft(){
        clearInterval(rightTimerId)
        isGoingLeft=true;
        leftTimerId=setInterval(function(){
            if(doodlerLeftSpace>=0){
                doodlerLeftSpace-=5
                doodler.style.left=doodlerLeftSpace+'px';
            }
            else{
                moveRight();
            }  
        },1000/FPS)
    }
    function moveRight(){
        clearInterval(leftTimerId)
        isGoingRight=true;
        leftTimerId=setInterval(function(){
            if(doodlerLeftSpace<=340){ //400-60(doodler width)
                doodlerLeftSpace+=5;
                doodler.style.left=doodlerLeftSpace+'px';
            }
            else{
                moveLeft();
            }
        },1000/FPS)

    }
    function moveStraight(){
        isGoingLeft=false
        isGoingRight=false
        clearInterval(leftTimerId);
        clearInterval(rightTimerId)
    }
    function start(){
        if(!gameover){
            createPlatforms(5);
            createDoodler();
            setInterval(movePlatforms,1000/FPS);
            jump();
            document.addEventListener('keyup',control)
        }
    }
    start();
})