var velocity = {x:50,y:0}
var time = isNaN($('#time').val()) || $('#time').val().trim() == "" ? 3 : $('#time').val(); 

$('#velocityx').val(velocity.x);
$('#velocityy').val(velocity.y);

$('#velocityx').change( function() { velocity.x = $('#velocityx').val(); });
$('#velocityy').change( function() { velocity.y = $('#velocityy').val(); });

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
	// startTime=new Date().getTime(); 
	stopTimeElapsed=true;
	storeTime = timeElapsed; 
	anim.stop(); 
})

function animate(frame)
{

	// console.log(ui.zoom)

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
	
	if(ball.getY() >= (stage.getHeight() - ground.getHeight() + ball.getRadius()) ) 
	{ 
		ball.setY( (stage.getHeight() - ground.getHeight() + ball.getRadius()) ); 
		stopTimeElapsed = true;
		timeElapsed = ( yTravelRate / (-0.5 * ( gravity )) ) * 700 ; 
	}
	var deltaX = ( xTravelRate * (timeElapsed / 700) ) + ( 0.5 * acceleration * Math.pow(timeElapsed / 700, 2) )
	ball.setX( (startP.x + deltaX) 	); 		
} 

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
	// Determine xlength traveled. 
	acceleration=0; 
	var deltaX = ( xTravelRate * timeElapsed ) + ( 0.5 * acceleration * Math.pow(timeElapsed, 2) ); 
	var deltaY = (yTravelRate * (yTravelRate/9.8) ) + (0.5 * (acceleration + gravity) * Math.pow(yTravelRate/9.8,2) ); 
	// console.log( {"yTopPoint":(startP.y+deltaY),"xTopPoint":(startP.x+deltaX) } )
	var points = []; 
	for(var i = 0; i < timeElapsed; i+=(timeElapsed/100) )
	{
		var xValueAt = startP.x + ( xTravelRate * i ) + ( 0.5 * acceleration * Math.pow(i, 2) ); 
		var yValueAt = startP.y - ( (yTravelRate * i ) + (0.5 * (acceleration + gravity) * Math.pow(i,2) ) ); 
		points.push( xValueAt, yValueAt ); 
	}
	quadLine.points( points ); 
	curveLayer.add(quadLine)
	curveLayer.draw(); 

	var topPointTime = (-1*yTravelRate)/(acceleration+gravity); 
	var topPoint = {
		x:startP.x + ( xTravelRate * topPointTime ) + ( 0.5 * acceleration * Math.pow(topPointTime, 2) ) ,
		y:startP.y - ( (yTravelRate * topPointTime ) + (0.5 * (acceleration + gravity) * Math.pow(topPointTime,2) ) )
	};

	var finalPoint = {
		x:startP.x + ( xTravelRate * timeElapsed ) + ( 0.5 * acceleration * Math.pow(timeElapsed, 2) ) ,
		y:startP.y - ( (yTravelRate * timeElapsed ) + (0.5 * (acceleration + gravity) * Math.pow(timeElapsed,2) ) )
	}

	if(markerLayer.find('#topMarker').length != 0)
	{
		var topMarker = markerLayer.find('#topMarker')[0]
		topMarker.setX( topPoint.x );
		topMarker.setY( topPoint.y ); 
	}
	else
	{
		var topPointCircle = new Kinetic.Circle({
		x:topPoint.x,
		y:topPoint.y,
		radius:5,
		fill:"white",
		stroke:'1',
		id:'topMarker'
		})

		topPointCircle.on('click',function(evt){
			console.log("Top Circle Clicked")
		}); 

		markerLayer.add(topPointCircle); 

	}

	if(markerLayer.find('#finalMarker').length != 0)
	{
		var topMarker = markerLayer.find('#finalMarker')[0]
		finalMarker.setX( topPoint.x );
		finalMarker.setY( topPoint.y ); 
	}
	else
	{
		var finalPointCircle = new Kinetic.Circle({
		x:finalPoint.x, 
		y:finalPoint.y,
		radius:5,
		fill:"white",
		stroke:'1',
		id:'finalMarker'
		})

		// var minimizedTip = "<div class='explaintrigger smalltip minimized'>Explanation</div>"; 
		// var explainationTip = "<div class='explaintip'>Explaination</div>"; 
		// var tooltip = new Opentip(
		// 	"#container",
		// 	"Tooltip is Working<hr style='margin-top:5px;margin-bottom:15px;'/>"+minimizedTip+explainationTip , 
		// 	{
		// 		// escapeContent:true,
		// 		style: "glass",
		// 		showOn: null,
		// 		hideTrigger:'closeButton'
		// 	}
		// ); 

		// tooltip.hide(); 

		// finalPointCircle.on('click',function(){
		// 	tooltip.content = "Well Hello is Tooltip Working? Top"
		// 	tooltip.show(); 
		// }); 

		// finalPointCircle.on('mouseout',function(){
		// 	tooltip.content = "Well Hello is Tooltip Working?"
		// 	tooltip.hide();
		// }); 

		// $('#container').click(function(){
		// 	tooltip.show(); 
		// 	$('.explaintrigger').click(function(){
		// 		this.innerHTML = "Explaination\nWAHAHA\nMoreWords"; 	
		// 	})
		// })
		markerLayer.add(finalPointCircle); 
	}

	markerLayer.draw(); 

	return { x:finalPoint.x, y:topPoint.y }
}

var anim = new Kinetic.Animation(animate,layer); 

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


	console.log( ball.getY() )

	layer.draw(); 
});


function getSolutionToTimeProblem()
{
var iVelocity = Number($('#ivelocity').val()); 
var aVelocity = Number($('#avelocity').val()); 
var acceleration = Number($('#acceleration').val()); 
var angle = Number($('#angle').val())
var gravity = Number($('#gravity').val()); 

var xTravelRate = aVelocity * Math.cos( angle * Math.PI / 180 ) ; 
var yTravelRate = aVelocity * Math.sin( angle * Math.PI / 180 ) ; 
return ( yTravelRate / (-0.5 * ( gravity )) ); 
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

		var perspective = {stage.getWidth()/2, y:ground.getY()}; 

		var newScale = ui.zoom;  
		layer.scale({x:newScale,y:newScale}); 
		layer.offsetX( -(ball.getX()/newScale - ball.getX()) ); 
		layer.offsetY( -(ball.getY()/newScale - ball.getY()) ); 
		layer.draw(); 

		quadLine.scale({x:newScale,y:newScale})
		var x1 = quadLine.points()[0]
		var y1 = quadLine.points()[1]

		quadLine.offsetX( -(x1/newScale - x1) ); 
		quadLine.offsetY( -(y1/newScale - y1) ); 

		// markerLayer.scale({x:.5,y:.5})
		// // var x1 = quadLine.points()[0]
		// // var y1 = quadLine.points()[1]

		// markerLayer.offsetX( -(x1/newScale - x1) ); 
		// markerLayer.offsetY( -(y1/newScale - y1) ); 
		markerLayer.draw(); 
		curveLayer.draw(); 
	}
}

var cameraControl = true; 
$('#container').on('mousewheel', function(event){
	if(cameraControl){
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

$('#container').mousemove(function(e){
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

var borderPoints = showPath(); 

var maxBorder = Math.max( borderPoints.x , borderPoints.y )

if( maxBorder > ($('#container').width()*.8) )
{
	console.log("Expand")

	var borderRatio = $('#container').width()*.8/maxBorder; 

	ui.zoom = borderRatio; 
	ui.zoomAdjust(); 

}

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
	// console.log(circleController.getX(),circleController.getY())
	$('#angle').val( Math.atan2( (ball.getY() - circleController.getY()) , circleController.getX()-ball.getX() ) * (180/Math.PI) )//.trigger('change')
	pointerLine.points( [ pointerLine.points()[0], pointerLine.points()[1], circleController.getX(), circleController.getY() ] ); 
	var distance = Math.sqrt(Math.pow(circleController.getY() - ball.getY(),2) + Math.pow(circleController.getX() - ball.getX(),2)); 
	// distance *= (1/ui.zoom)
	$('#avelocity').val(distance); 
	showPath(); 

});

$('#angle').change(function(){
	var angle = Number($('#angle').val()); 
	var aVelocity = Number($('#avelocity').val());
	var deltaX = aVelocity * Math.cos( angle * Math.PI / 180 ) ; 
	var deltaY = aVelocity * Math.sin( angle * Math.PI / 180 ) ; 
	var pointerPosition = {x: ball.getX() + deltaX, y: ball.getY() - deltaY}; 
	circleController.x( pointerPosition.x ); 
	circleController.y( pointerPosition.y ); 
	pointerLine.points( [ pointerLine.points()[0], pointerLine.points()[1], circleController.getX(), circleController.getY() ] ); 
	arrowLayer.draw(); 
	showPath(); 
}); 

$('#avelocity').change(function(){
	var angle = Number($('#angle').val()); 
	var aVelocity = Number($('#avelocity').val());
	var deltaX = aVelocity * Math.cos( angle * Math.PI / 180 ) ; 
	var deltaY = aVelocity * Math.sin( angle * Math.PI / 180 ) ; 
	var pointerPosition = {x: ball.getX() + deltaX, y: ball.getY() - deltaY}; 
	circleController.x( pointerPosition.x ); 
	circleController.y( pointerPosition.y ); 
	pointerLine.points( [ pointerLine.points()[0], pointerLine.points()[1], circleController.getX(), circleController.getY() ] ); 
	arrowLayer.draw(); 
	showPath(); 
})

// triangle.rotate( Math.atan2( deltaX,deltaY ) * (180/Math.PI) )

console.log( pointerLine.points() )
arrowLayer.add(pointerLine);
arrowLayer.add(circleController)
arrowLayer.draw();  