var velocity = {x:50,y:0}
var time = isNaN($('#time').val()) || $('#time').val().trim() == "" ? 3 : $('#time').val(); 
var data = {time:0, avelocity: 0, acceleration: 0, angle: 0, gravity: 0 }
var andBeyond = false; 

$('#velocityx').val(velocity.x);
$('#velocityy').val(velocity.y);

$('#velocityx').change( function() { velocity.x = $('#velocityx').val(); });
$('#velocityy').change( function() { velocity.y = $('#velocityy').val(); });

var dragOn = false; 
var previousEvent = null; 
var originOffset = {x:0,y:0}

var startTime = new Date().getTime(); 
var animTimeStart; 
var animTime; 
var storeTime = 0; 
var stopTimeElapsed = false; 

$('#move').click(function(){
	stopTimeElapsed = false;
	animTimeStart = new Date().getTime(); 

	anim.start(); 
}); 

$('#stop').click(function(){
	stopTimeElapsed=true;
	storeTime = timeElapsed; 
	anim.stop(); 
})
		 
function restrictGroundAndBackground()
{
	if(ground.x() < -1000000) {ground.x(-1000000); }
	if(ground.width() > 2000000) {ground.width(2000000); }
	if(ground.height() > 2000000) {ground.height(2000000); }

	if(background.x() < -1000000) {background.x(-1000000); }
	if(background.width() > 2000000) {background.width(2000000); }
	if(background.height() > 2000000) {background.height(2000000); }
}

function animate(frame)
{
	animTime =  new Date().getTime() - animTimeStart; 

	var iVelocity = Number($('#ivelocity').val()); 
	var aVelocity = Number($('#avelocity').val()); 
	var acceleration = Number($('#acceleration').val()); 
	var angle = Number($('#angle').val())
	var gravity = Number($('#gravity').val()); 
	
	// /*Calculate X and Y Rates Here.*/
	var xTravelRate = aVelocity * Math.cos( angle * Math.PI / 180 ) ; 
	var yTravelRate = aVelocity * Math.sin( angle * Math.PI / 180 ) ; 
	/*End of Calculate X and Y Rates Here.*/

	acceleration = 0; 
	timeElapsed = stopTimeElapsed ? timeElapsed : ( storeTime +  animTime ); 
	$('#time').val( timeElapsed / 700 )
	var deltaY = ( ( yTravelRate* (timeElapsed / 700) ) + ( 0.5 * ( acceleration + gravity ) * Math.pow(timeElapsed/700, 2) ) ); 
	ball.setY( (startP.y - deltaY) ); 

	/*Prevents the Ball from going below the ground. */
	if(ball.getY() >= (ground.y() - ball.getRadius()) ) 
	{ 
		ball.setY( (ground.y() - ball.getRadius()) ); 
		stopTimeElapsed = true;
		timeElapsed = ( yTravelRate / (-0.5 * ( gravity )) ) * 700 ; 
		anim.stop(); 
	}
	var deltaX = ( xTravelRate * (timeElapsed / 700) ) + ( 0.5 * acceleration * Math.pow(timeElapsed / 700, 2) )
	ball.setX( (startP.x + deltaX) 	); 		
} 
var finalPointCircle; 
var topPointCircle; 
function showPath()
{
	var iVelocity = Number($('#ivelocity').val()); 
	var aVelocity = Number($('#avelocity').val()); 
	var acceleration = Number($('#acceleration').val()); 
	var angle = Number($('#angle').val())
	var gravity = Number($('#gravity').val()); 
	var xTravelRate = aVelocity * Math.cos( angle * Math.PI / 180 ) ; 
	var yTravelRate = aVelocity * Math.sin( angle * Math.PI / 180 ) ; 

	/*For every 10 distance , create a 3 radius circle to show the path. Ratesepeat until path ends. */
	var timeElapsed = getSolutionToTimeProblem(); 

	if(andBeyond){
		alert("There is no solution. Projectile seems to go on forever. Only partial path is shown.")
	}
	// Determine xlength traveled. 
	var deltaX = ( xTravelRate * timeElapsed ) + ( 0.5 * acceleration * Math.pow(timeElapsed, 2) ); 
	var deltaY = (yTravelRate * (yTravelRate/9.8) ) + (0.5 * (acceleration + gravity) * Math.pow(yTravelRate/9.8,2) ); 
	var points = []; 
	for(var i = 0; i < timeElapsed; i+=(timeElapsed/100) )
	{
		var xValueAt = startP.x + ( xTravelRate * i ) + ( 0.5 * acceleration * Math.pow(i, 2) ); 
		var yValueAt = startP.y - ( (yTravelRate * i ) + (0.5 * (acceleration + gravity) * Math.pow(i,2) ) ); 
		points.push( xValueAt, yValueAt ); 
	}
	quadLine.points( points ); 
	mainGroup.add(quadLine); 
	mainLayer.draw(); 

	/*Marker Code*/
	if(andBeyond){
		var displayTime = 20; 
		var xPortion = startP.x + ( xTravelRate * displayTime ) + ( 0.5 * acceleration * Math.pow(displayTime, 2) ) 
		var yPortion = startP.y - ( (yTravelRate * displayTime ) + (0.5 * (acceleration + gravity) * Math.pow(displayTime,2) ) )
		// returns the boundaries so that the image could be displayed. 
		return { x:xPortion, y:yPortion }
	}
	var topPointTime = (-1*yTravelRate)/(acceleration+gravity); 
	var topPoint = {
		x:startP.x + ( xTravelRate * topPointTime ) + ( 0.5 * acceleration * Math.pow(topPointTime, 2) ) ,
		y:startP.y - ( (yTravelRate * topPointTime ) + (0.5 * (acceleration + gravity) * Math.pow(topPointTime,2) ) )
	};

	var finalPoint = {
		x:startP.x + ( xTravelRate * timeElapsed ) + ( 0.5 * acceleration * Math.pow(timeElapsed, 2) ) ,
		y:startP.y - ( (yTravelRate * timeElapsed ) + (0.5 * (acceleration + gravity) * Math.pow(timeElapsed,2) ) )
	}

	if(mainGroup.find('#topMarker').length != 0)
	{
		var topMarker = mainGroup.find('#topMarker')[0]
		topMarker.setX( topPoint.x );
		topMarker.setY( topPoint.y ); 
		var topMarkerLine = mainGroup.find('#topMarkerLine')[0]
		topMarkerLine.points([ topPointCircle.x() , topPointCircle.y(), topPointCircle.x(), ground.y() ]); 
		topMarker.moveToTop(); 
	}
	else
	{
		topPointCircle = new Kinetic.Circle({
		x:topPoint.x,
		y:topPoint.y,
		radius:5,
		fill:"white",
		stroke:'1',
		id:'topMarker'
		})

		/*Tooltip Code*/
		var topPointTip = new Opentip(
			"#container",
			"<hr style='margin-top:5px;margin-bottom:15px;'/><div class='explaintrigger smalltip minimized'>Explanation</div>",
			{
				// escapeContent:true,
				style: "dark",
				showOn: null,
				hideTrigger:'closeButton',
				target:null
			}
		); 

		var topPointTipContent = "Projectile landed at " + (topPointCircle.x() - ball.x()) + " units away from initial position."; 
		var explainationTip = ""; 
		if(andBeyond){
			"<div class='hidden-explaintip'></div>"
		}
		else
		{
			explainationTip = 
			"<div class='hidden-explaintip'>The top point of a projectile is when the the projectile begins to fall.<br />This can be seen as when the vertical velocity of the projectile reaches 0.<br /> v<sub>f</sub>=v<sub>i</sub>+a*t The final velocity is 0.<br /> 0=v<sub>i</sub>+a*t<br/> -v<sub>i</sub>=a*t<br/> -v<sub>i</sub>/a=t<br/> Now that we determine the formula to determine the time where the projectile begins to fall, lets determine the variables. -v<sub>i</sub> is the vertical velocity component of the projectile. <br/> The vertical velocity component of the projectile can be determined by<br/> vsin&Theta;=opp where v is the velocity, &Theta; is the angle, and opp is the vertical velocity component, v<sub>i</sub> <br /> </div>"}
		topPointTip.content = 
			topPointTipContent + topPointTip.content + "<hr style='margin-top:20px;margin-bottom:15px;'/>"
		topPointTip.hide(); 
		var completeTip = topPointTip.content + explainationTip; 

		topPointCircle.on('mouseup',function(){
			topPointTip.show(); 
			var tipDisplayPosition=
			{
			 left:$('#opentip-1').position().left,
			 top:$('#opentip-1').position().top
			}		 

			$('.explaintrigger').click(function(){
				topPointTip.setContent(completeTip); 
				$('#opentip-1').offset(tipDisplayPosition)
			}); 

		}); 
		/*EOF Tooltip Code*/

		mainGroup.add(topPointCircle); 

		var topMarkerLine = new Kinetic.Line({
		dash:[10,10],
		strokeWidth:2,
		stroke:'gray',
		lineCap:'round',
		opacity:0.6,
		id:'topMarkerLine',
		points:[ topPointCircle.x() , topPointCircle.y(), topPointCircle.x(), ground.y() ]
		});
		mainGroup.add(topMarkerLine); 
	}

	if(mainGroup.find('#finalMarker').length != 0)
	{
		var finalMarker = mainGroup.find('#finalMarker')[0]
		finalMarker.setX( finalPoint.x );
		finalMarker.setY( finalPoint.y ); 
		var finalMarkerLine = mainGroup.find('#finalMarkerLine')[0]; 
		finalMarkerLine.points([ finalPointCircle.x() , finalPointCircle.y(), finalPointCircle.x(), ground.y() ])
		finalMarker.moveToTop(); 
	}
	else
	{
		finalPointCircle = new Kinetic.Circle({
		x:finalPoint.x, 
		y:finalPoint.y,
		radius:5,
		fill:"white",
		stroke:'1',
		id:'finalMarker'
		})

		/*Tooltip Code*/
		var finalPointTip = new Opentip(
			"#container",
			"<hr style='margin-top:5px;margin-bottom:15px;'/><div class='explaintrigger smalltip minimized'>Explanation</div>",
			{
				// escapeContent:true,
				style: "dark",
				showOn: null,
				hideTrigger:'closeButton',
				target:null
			}
		); 

		var finalPointTipContent = "Projectile landed at " + (finalPointCircle.x() - ball.x()) + " units away from initial position."; 
		var explainationTip = "<div class='hidden-explaintip'>Here is the math.<br/>asdf<br/>asdf\n\nasdf</div>"; 
		finalPointTip.content = 
			finalPointTipContent + finalPointTip.content + "<hr style='margin-top:20px;margin-bottom:15px;'/>"
		finalPointTip.hide(); 

		finalPointCircle.on('mouseup',function(){
			finalPointTip.show(); 
			var tipDisplayPosition=
			{
			 left:$('#opentip-2').position().left,
			 top:$('#opentip-2').position().top
			}		 

			$('.explaintrigger').click(function(){
				finalPointTip.setContent(finalPointTip.content + explainationTip); 
				$('#opentip-2').offset(tipDisplayPosition)
			}); 

		}); 
		/*EOF Tooltip Code*/

		var finalMarkerLine = new Kinetic.Line({
		dash:[10,10],
		strokeWidth:2,
		stroke:'gray',
		lineCap:'round',
		opacity:0.6,
		id:'finalMarkerLine',
		points:[ finalPointCircle.x() , finalPointCircle.y(), finalPointCircle.x(), ground.y() ]		
		})
		mainGroup.add(finalMarkerLine); 

		mainGroup.add(finalPointCircle); 
	}

	topMarkerLine.moveToBottom(); 
	finalMarkerLine.moveToBottom(); 
	ball.moveToTop(); 

	mainGroup.draw(); 
	mainLayer.draw(); 

	return { x:finalPoint.x, y:topPoint.y }
}

var anim = new Kinetic.Animation(animate,mainLayer); 

$('#direct').click(function(){

	var iVelocity = Number($('#ivelocity').val()); 
	var aVelocity = Number($('#avelocity').val()); 
	var acceleration = Number($('#acceleration').val()); 
	var angle = Number($('#angle').val())
	var gravity = Number($('#gravity').val()); 

	var xTravelRate = aVelocity * Math.cos( angle * Math.PI / 180 ) ; 
	var yTravelRate = aVelocity * Math.sin( angle * Math.PI / 180 ) ; 

	var timeNow = Number($('#time').val())
	var deltaY = ( ( yTravelRate* timeNow ) + ( 0.5 * ( acceleration + gravity ) * Math.pow(timeNow, 2) ) ); 
	ball.setY( startP.y - deltaY  ); 
	
	var deltaX = ( xTravelRate * timeNow ) + ( 0.5 * acceleration * Math.pow(timeNow, 2) )
	ball.setX( startP.x + deltaX ); 		
	layer.draw(); 
});


function getSolutionToTimeProblem()
{
andBeyond=false;
var iVelocity = Number($('#ivelocity').val()); 
var aVelocity = Number($('#avelocity').val()); 
var acceleration = Number($('#acceleration').val()); 
var angle = Number($('#angle').val())
var gravity = Number($('#gravity').val()); 

var xTravelRate = aVelocity * Math.cos( angle * Math.PI / 180 ) ; 
var yTravelRate = aVelocity * Math.sin( angle * Math.PI / 180 ) ; 
var solution = ( -2*yTravelRate / (( gravity + acceleration )) ); 
if(solution<0){andBeyond=true;}
return solution < 0 ? 60 : solution; 

}

$('#solution').click(function(){

var iVelocity = Number($('#ivelocity').val()); 
var aVelocity = Number($('#avelocity').val()); 
var acceleration = Number($('#acceleration').val()); 
var angle = Number($('#angle').val())
var gravity = Number($('#gravity').val()); 

var xTravelRate = aVelocity * Math.cos( angle * Math.PI / 180 ) ; 
var yTravelRate = aVelocity * Math.sin( angle * Math.PI / 180 ) ; 

console.log( getSolutionToTimeProblem() ); 

})

$('#showpath').click(function(){
	var borderPoints = showPath(); 

	var maxBorder = Math.max( borderPoints.x , borderPoints.y )

	console.log(maxBorder); 
	console.log($('#container').width())

	if( maxBorder > ($('#container').width()*.8) )
	{
		console.log("Expand")
	}

})

var ui = {
	zoom: 1.0, 
	scale: 1,
	offset:{left:0,top:0},
	mouseWheelZoom: function(event){
		event.preventDefault(); 
		var evt = event.originalEvent; 
		var zoom = ( ui.zoom - ( evt.wheelDelta/120 < 0 ? 0.05 : -0.05) ); 
		ui.zoom = zoom; 
		var newScale = ui.zoom * zoom; 
		quadLine.scale({x:newScale,y:newScale})
		var x1 = quadLine.points()[0]
		var y1 = quadLine.points()[1]
		quadLine.offsetX( -(x1/newScale - x1) ); 
		quadLine.offsetY( -(y1/newScale - y1) ); 
		curveLayer.draw(); 
	},
	zoomAdjust: function(event)
	{
		return;
		var perspective = {x: stage.getWidth()/2, y:ground.getY()}; 

		var newScale = ui.zoom;  
		// layer.scale({x:newScale,y:newScale}); 
		// layer.offsetX( -(perspective.x/newScale - perspective.x) ); 
		// layer.offsetX( -(perspective.y/newScale - perspective.y) ); 
		// layer.offsetX( -(ball.getX()/newScale - ball.getX()) ); 
		// layer.offsetY( -(ball.getY()/newScale - ball.getY()) ); 
		layer.draw(); 

		// quadLine.scale({x:newScale,y:newScale})
		// var x1 = quadLine.points()[0]
		// var y1 = quadLine.points()[1]

		// quadLine.offsetX( -(perspective.x/newScale - perspective.x) ); 
		// quadLine.offsetY( -(perspective.y/newScale - perspective.y) ); 

		// markerLayer.scale({x:.5,y:.5})
		// // var x1 = quadLine.points()[0]
		// // var y1 = quadLine.points()[1]

		// markerLayer.offsetX( -(x1/newScale - x1) ); 
		// markerLayer.offsetY( -(y1/newScale - y1) ); 
		markerLayer.draw(); 
		curveLayer.draw(); 
	}
}

function zoomLayers(newScale)
{
	var x1 = ball.x()
	var y1 = ball.y()
	mainGroup.scale({x:newScale,y:newScale}); 
	if(newScale<1)
	{
		var workingWidth = (baseGroundProp.width + modGroundProp.width) 
		// var currentWidth = ( workingWidth-ground.x())/newScale
		// // var bonus = currentWidth-workingWidth 
		// // // console.log( workingWidth, bonus, newScale)
		var bonus = ((workingWidth)/newScale)-(workingWidth); 
		// console.log(newScale, bonus); 

		var newGroundX = (baseGroundProp.x+modGroundProp.x) - (bonus/2); 
		var newGroundWidth = workingWidth + bonus; 
		var newGroundHeight = (baseGroundProp.height + modGroundProp.height)/newScale; 
		ground.x(newGroundX); 
		ground.width(newGroundWidth); 
		ground.height(newGroundHeight); 
		background.x(newGroundX); 
		background.width(newGroundWidth); 
		background.height(newGroundHeight); 
		restrictGroundAndBackground(); 

		// var limits = {min:-600000,max:1200000}

		// console.log(ground.x(), ground.width(), ground.height())

		// console.log(newScale , ground.x(), ground.width() , ground.height() )		
		// if( ground.x() < -3000000  ) {ground.x(-3000000);restrictZoom=true;console.log("limit1");}
		// if( ground.width() > 9000000 ) {ground.width(9000000);restrictZoom=true;console.log("limit2");}
		// if( ground.height() > 9000000  ) {ground.height(9000000);restrictZoom=true;console.log("limit3");}		
	}
	// console.log(ball.position())
	// wedgeBackground.offsetX( -(x1/newScale - x1) ); 
	// wedgeBackground.offsetY( -(y1/newScale - y1) );	// ((ball.position().x+)*newScale)+mainGroup.x()
	var newPosition = {x: ((ball.position().x-ball.radius()-10)*newScale)+mainGroup.position().x, 
						y:((ball.position().y+ball.radius()+10)*newScale)+mainGroup.position().y }; 
	wedgeBackground.position( newPosition )
	shinyWedge.position(newPosition)
	// layer.scale({x:newScale,y:newScale}); 
	// curveLayer.scale({x:newScale,y:newScale});
	// markerLayer.scale({x:newScale,y:newScale})
	// var offset = {
	// 	x: -((stage.width()-(layer.width()*newScale))/10 )/newScale, 
	// 	y: -(ground.y()-(layer.height()*newScale))/newScale }

	// Additional Modifications of Offset in case of mouse moves.
	// 	offset.x -= originOffset.x
	// 	offset.y -= originOffset.y
	// /*EOF Additional Modifications of Offset in case of mouse moves.*/
	// layer.offset(offset)
	// curveLayer.offset(offset)
	// markerLayer.offset(offset)
	// layer.draw(); 
	// curveLayer.draw();
	// markerLayer.draw();
	mainLayer.draw() ;
}

var cameraControl = true; 
$('#container').on('mousewheel', function(event){
	if(cameraControl){
		var evt = event.originalEvent; 
		var zoom = ( ui.zoom - ( evt.wheelDelta/120 < 0 ? 0.05 : -0.05) ); 
		ui.zoom = zoom; 
		if(ui.zoom<.01) {ui.zoom=.01;}
		zoomLayers(ui.zoom)
		var zoomTxt = ui.zoom; 
		zoomTxt = zoomTxt.toString(); 
		zoomTxt = zoomTxt.length > 4 ? zoomTxt.substring( 0, 4 ) : zoomTxt;
		zoomTxt += "x"
		zoomText.text(zoomTxt); 
		uiLayer.draw() ;
		return;
		ui.mouseWheelZoom(event); 
		ui.zoomAdjust(event); 
	}
}); 

$('#bigger').click(function(){
	ball.scale({x:.2,y:.2}); 
	ball.offsetY( -( (ball.getRadius()*(1-0.2) )/0.2 ) ); 
	quadLine.offsetY( -( (ball.getRadius()*(1-0.2) ) ) ) 
	layer.draw(); 
}); 

$('#rotate').click(function(){	
	cannon.rotation(-45+(26.5))
	layer.draw(); 
})


$('#container').mousedown(function()
{
	dragOn = true;
})
$('body').mouseup(function(){
	dragOn = false;
	previousEvent=null; 
})

$('#container').mousemove(function(e){
	return;
	if(!dragOn)return;
	if(previousEvent==null)
	{
		previousEvent = e; 
		return;
	}
	originOffset = {x: e.pageX - previousEvent.pageX , y: e.pageY - previousEvent.pageY}
	var adjust = {x:layer.offset().x-originOffset.x, y:layer.offset().y-originOffset.y}; 
	layer.offset(adjust);
	curveLayer.offset(adjust);
	markerLayer.offset(adjust); 
	groundLayer.offset({x:groundLayer.offset().x-originOffset.x, y:groundLayer.offset().y-originOffset.y}); 

	previousEvent = e; 
	layer.draw(); 
	curveLayer.draw(); 
	markerLayer.draw(); 
	groundLayer.draw(); 
	return;
	x0=ball.getX(); 
	y0=ball.getY(); 
	c=Math.pow( Math.pow( e.pageX-x0,2) + Math.pow( e.pageY-y0,2)  ,0.5)
	var rotation = (Math.asin( (e.pageY-y0)/c ) * 180 / Math.PI)		

	if(rotation<(-90+20))
	{
		rotation = ( -90+20 )
	}
	else if(rotation >(0+20))
	{
		rotation = ( 20 )
	}
	$('#angle').val( (rotation-15)*-1 ); 
	showPath(); 
	layer.draw(); 
}); 

$('input[type="checkbox"').click(function(){
	cameraControl = this.checked; 
});

var angle = Number($('#angle').val()); 
var aVelocity = Number($('#avelocity').val());
var deltaX = aVelocity * Math.cos( angle * Math.PI / 180 ) ; 
var deltaY = aVelocity * Math.sin( angle * Math.PI / 180 ) ; 
var pointerPosition = {x: ball.getX() + deltaX, y: ball.getY() - deltaY}; 
var pointerLine = new Kinetic.Line({
	strokeWidth:'1',
	stroke:'black',
	lineCap:'round',
	points:[ball.getX(),ball.getY(),pointerPosition.x,pointerPosition.y] 
})
// var triangle = new Kinetic.RegularPolygon({
// 	x:pointerPosition.x,
// 	y:pointerPosition.y,
// 	radius:8,
// 	sides:3,
// 	fill:'black',
// 	strokeWidth:1,
// 	stroke:'black'
// }); 

var circleController = new Kinetic.Circle({
	x:pointerPosition.x,
	y:pointerPosition.y,
	radius:8,
	fill:'white',
	stroke:'black',
	strokeWidth:1,
	draggable: true,
	dragDistance: 1,
	dragBoundFunc:function(pos){
		// console.log(pos)
		var x = ball.getX();
        var y = ball.getY();
        var radius = 120;
        var scale = radius / Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
        if(scale < 1){
          var yBound = Math.round((pos.y - y) * scale + y); 
          var xBound = Math.round((pos.x - x) * scale + x);
          return {
            y: pos.y > ball.getY() ? ball.getY() : yBound,
            x: pos.x < ball.getX() ? ball.getX() : xBound
          };
      	}
        else
          return { x: pos.x < ball.getX() ? ball.getX() : pos.x , y: pos.y > ball.getY() ? ball.getY() : pos.y };
	}
}); 

circleController.on('dragmove',function(){
	$('#angle').val( Math.atan2( (ball.getY() - circleController.getY()) , circleController.getX()-ball.getX() ) * (180/Math.PI) )//.trigger('change')
	pointerLine.points( [ pointerLine.points()[0], pointerLine.points()[1], circleController.getX(), circleController.getY() ] ); 
	var distance = Math.sqrt(Math.pow(circleController.getY() - ball.getY(),2) + Math.pow(circleController.getX() - ball.getX(),2)); 
	$('#avelocity').val(distance); 
	showPath(); 

});

var wedgeBackground = new Kinetic.Wedge({
    x:ball.x()-ball.radius()-10,
    y:ball.y()+ball.radius()+10,
    radius: 100,
    angle: 90,
    fillRadialGradientStartRadius: 0,
    fillRadialGradientEndRadius: 100,
    fillRadialGradientColorStops: [0, 'green', .33, 'yellow' , .66 , 'orange' , .99 , 'red' ],
    fillPriority: 'radial-gradient',
    rotation: -90,
    opacity:0.7
});

mainLayer.add(wedgeBackground); 
var shinyWedge = new Kinetic.Wedge({
	x: wedgeBackground.x(),
	y: wedgeBackground.y(),
	radius: (wedgeBackground.radius()*(Number($('#avelocity').val())/100)), 
	angle: 30,
	rotation: (-Number($('#angle').val())-10), 
	fillRadialGradientStartRadius: 0, 
	fillRadialGradientEndRadius: 100, 
	fillRadialGradientColorStops: [0, 'white', 1.0 , 'blue' ],
	opacity: 0.6,
	listening:false
}); 

var wedgeDragOn = false; 

wedgeBackground.on('mousemove',function(){
	if(shinyWedge.opacity() != 0 && wedgeBackground.opacity() != 0 )
	{
		var difX = stage.getPointerPosition().x - wedgeBackground.x() 
	    var difY = wedgeBackground.y() - stage.getPointerPosition().y 
	    shinyWedge.rotation( -(Math.atan2( difY , difX ) * (180/Math.PI)) - 10 )
	    shinyWedge.listening(false); 
	    $('#angle').val(-shinyWedge.rotation()-10); 
	    showPath(); 
		mainLayer.draw(); 
	}
})

stage.on('mouseup', function(){wedgeDragOn=false;})
ground.on('mousedown', function(){
	wedgeDragOn = false; 
	shinyWedge.opacity(0); 
	wedgeBackground.opacity(0); 
	shinyWedge.moveToBottom(); 
	wedgeBackground.moveToBottom(); 
})
wedgeBackground.on('mousedown', function(){wedgeDragOn=true;})
wedgeBackground.on('mouseleave', function(){
	return;
	wedgeDragOn=false; console.log(stage.getPointerPosition()) 
	var difX = stage.getPointerPosition().x - shinyWedge.x(); 
	var difY = shinyWedge.y() - stage.getPointerPosition().y; 
	var currentRadius = shinyWedge.radius(); 
	if(currentRadius*1.1 >= wedgeBackground.radius()){
		shinyWedge.radius(wedgeBackground.radius()); 
	}
	else if(currentRadius-(wedgeBackground*0.1)  <= 0) {
		shinyWedge.radius(0); 
	}
})

stage.on('mousemove',function(){
	if(wedgeDragOn){
		var difX = stage.getPointerPosition().x - shinyWedge.x(); 
		var difY = shinyWedge.y() - stage.getPointerPosition().y; 
		shinyWedge.radius( Math.pow( Math.pow(difX, 2) + Math.pow(difY, 2) , .5 ) ); 
		if(shinyWedge.radius()>= wedgeBackground.radius()){shinyWedge.radius(wedgeBackground.radius());}
		if(difX<= 0 && difY<=0){shinyWedge.radius(0);}
		var lengthVal = (shinyWedge.radius()/wedgeBackground.radius())*100
		$('#avelocity').val(lengthVal); 
		showPath(); 
		mainLayer.draw(); 
	}
})

background.on('mousedown',function(){
	wedgeDragOn = false; 
	shinyWedge.opacity(0); 
	wedgeBackground.opacity(0); 
	shinyWedge.moveToBottom(); 
	wedgeBackground.moveToBottom(); 
})

mainLayer.add(shinyWedge); 

ball.on('mouseup',function(){    
	var newScale = ui.zoom; 
	var newPosition = {x: ((ball.position().x-ball.radius()-10)*newScale)+mainGroup.position().x, 
						y:((ball.position().y+ball.radius()+10)*newScale)+mainGroup.position().y }; 
	shinyWedge.position(newPosition);  
	wedgeBackground.position(newPosition); 
    wedgeBackground.opacity(0.7)
    shinyWedge.opacity(0.6)
    wedgeBackground.moveToTop(); 
    shinyWedge.moveToTop(); 
    mainLayer.draw(); 
})

mainLayer.draw(); 

// triangle.rotate( Math.atan2( deltaX,deltaY ) * (180/Math.PI) )

ball.moveToTop(); 
ui.zoom = 1; 

$('body').click(function(){
	return;
	if(shinyWedge != null) {	
		shinyWedge.opacity(0); 
		wedgeBackground.opacity(0); 
		wedgeBackground.moveToBottom(); 
    	shinyWedge.moveToBottom(); 
		mainLayer.draw(); 
	}
})

function adjustWedges()
{
	shinyWedge.rotation( (-Number($('#angle').val())-10) )
	mainLayer.draw(); 
}

$('#angle').change(function(){
	showPath(); 
	adjustWedges(); 
}); 

$('#avelocity').change(function(){
	showPath(); 
})

$('#acceleration').change(function(){
	showPath(); 
})

$('#gravity').change(function(){
	showPath(); 
})

/*Border Points Code*/

var borderPoints = showPath(); 
var maxBorder = Math.max( borderPoints.x , borderPoints.y )

if( maxBorder > ($('#container').width()*.8) && false )
{
	var borderRatio = $('#container').width()*.8/maxBorder; 
	ui.zoom = borderRatio; 
	var newScale = ui.zoom; 

	zoomLayers(newScale);
	mainGroup.position({x:0,y:$('#container').height()*.8*borderRatio}); 
	console.log(mainGroup.position(), mainGroup.scale() ) 
	var newPosition = {x: ((ball.position().x-ball.radius()-10)*newScale)+mainGroup.position().x, 
						y:((ball.position().y+ball.radius()+10)*newScale)+mainGroup.position().y };
	wedgeBackground.position( newPosition )
	shinyWedge.position(newPosition) 
	mainLayer.draw();

}

/*EOF Border Points*/

var zoomRectProp = {width:75,height:35}
var zoomRect = new Kinetic.Rect({
	x:stage.getWidth()-(zoomRectProp.width+20),
	y:10,
	fill:'gray',
	width:zoomRectProp.width,
	height:zoomRectProp.height,
	cornerRadius:7,
});

var text = ui.zoom; 
text = text.toString(); 
text = text.length > 4 ? text.substring( 0, 4 ) : text; 

var zoomText = new Kinetic.Text({
	x:zoomRect.getX(),
	y:zoomRect.getY(),
	text:text+"x",
	fill:'white',
	fontSize:20,
	offset:{x:-12,y:-8}	
})
uiLayer.add(zoomRect); 
uiLayer.add(zoomText); 

uiLayer.draw();