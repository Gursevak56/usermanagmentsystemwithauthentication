let gamePattern=[];
let buttonColors=["red","green","blue","yellow"]; 
let userClickedPattern=[];

var level=0;
var started=false;
$(document).keypress(function(){
if(!started){
  $('#level-title').text("level"+level);
  nextSequence();
  started=true;
}
})
function nextSequence()
{
  level++;
  $('#level-title').text("level"+level);
    let randomNumber=Math.floor(Math.random()*4);

    let randomchosenColor=buttonColors[randomNumber];
    gamePattern.push(randomchosenColor);
    Playsound(randomchosenColor);
    $(`#${randomchosenColor}`).fadeOut(100).fadeIn(100)
}
    $('.btn').click(function(){
      let userChosenColour=this.id;
    userClickedPattern.push(userChosenColour);
    Playsound(this.id);
     animatePress(this.id);
     checkAnswer(userClickedPattern.length-1);
    })
   function handlar(id){
    
  }
  function Playsound(id){
    let audio=new Audio(`./sounds/${id}.mp3`);
    audio.play();
  }
  function animatePress(id){
    $(`#${id}`).addClass("Pressed");
    setTimeout(() => {
      $("#"+id).removeClass("Pressed")
    }, 100);
  }
function checkAnswer(currrentLevel){
  if(userClickedPattern[currrentLevel]===gamePattern[currrentLevel]){
    console.log("success");
  }
  
  if(userClickedPattern.length===gamePattern.length){
    setTimeout(() => {
  nextSequence();      
    },1000);
  }
  else{
    $('body').addClass("game-over");
    var audio=new Audio('./sounds/wrong.mp3');
    audio.play();
    $("#level-title").text("gameover please try again");
  }
}