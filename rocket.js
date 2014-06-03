var velocity = {x:50,y:0}
var time = isNaN($('#time').val()) || $('#time').val().trim() == "" ? 3 : $('#time').val(); 

$('#velocityx').val(velocity.x);
$('#velocityy').val(velocity.y);

$('#velocityx').change( function() { velocity.x = $('#velocityx').val(); });
$('#velocityy').change( function() { velocity.y = $('#velocityy').val(); });

var startTime = new Date().getTime(); 

// function animate(frame)
// {
// 	ball.setX( ball.getX() + velocity.x * (frame.timeDiff/1000) ); 
// 	acceleration = 0; 
// 	timeElapsed = new Date().getTime() - startTime; 
// 	// console.log(timeElapsed); 
// 	$('#time').val( timeElapsed )
// 	ball.setX( startP.x + (velocity.x * timeElapsed / 1000 ) + ( 0.5 * acceleration * Math.pow(time, 2) ) ); 
// }

var stopTimeElapsed = false; 

function animate(frame)
{
	var iVelocity = Number($('#ivelocity').val()); 
	var aVelocity = Number($('#avelocity').val()); 
	var acceleration = Number($('#acceleration').val()); 
	var angle = Number($('#angle').val())
	var gravity = Number($('#gravity').val()); 

	// console.log( {"iVelocity":iVelocity, "aVelocity":aVelocity, "acceleration":acceleration, "angle": angle } ); 

	// /*Calculate X and Y Rates Here.*/
	var xTravelRate = aVelocity * Math.cos( angle * Math.PI / 180 ) ; 
	var yTravelRate = aVelocity * Math.sin( angle * Math.PI / 180 ) ; 
	/*End of Calculate X and Y Rates Here.*/
	
	// d = vi(t) + (.5)(a)(t^2)

	console.log(ui.zoom)

	acceleration = 0; 
	timeElapsed = stopTimeElapsed ? timeElapsed : new Date().getTime() - startTime; 
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

	// console.log( ball.getX() , ball.getY() )
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
	// points.pop(); 
	// console.log(points)
	quadLine.points( points ); 
	// quadLine.scale({x:.2,y:.2}); 
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
		id:'topMarker'
		})

		var tooltip = new Opentip(
			"#container",
			"Tooltip is Working", 
			{
				style: "glass",
				showOn: null
			}
		); 

		tooltip.hide(); 

		finalPointCircle.on('click',function(){
			tooltip.content = "Well Hello is Tooltip Working?"
			tooltip.show(); 
		}); 

		finalPointCircle.on('mouseout',function(){
			tooltip.content = "Well Hello is Tooltip Working?"
			tooltip.hide();
		}); 


		markerLayer.add(finalPointCircle); 
	}
	markerLayer.draw(); 

	return { x:finalPoint.x, y:topPoint.y }
}

var anim = new Kinetic.Animation(animate,layer); 

$('#move').click(function(){
	ui.zoomAdjust(); 
	stopTimeElapsed = false; 
	startTime = new Date().getTime(); 
	// console.log(startTime)
	anim.start(); 
}); 

$('#stop').click(function(){
	anim.stop(); 
})

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

// console.log( getSolutionToTimeProblem() ); 
// console.log(  )

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
		// wheel = evt.wheelData/120; 
		var zoom = ( ui.zoom - ( evt.wheelDelta/120 < 0 ? 0.05 : -0.05) ); 
		// console.log(zoom)
		ui.zoom = zoom; 
		// console.log(zoom)
		var newScale = ui.zoom * zoom; 
		// console.log(evt.wheelDelta)

		// ball.scale({x:newScale,y:newScale}); 
		// ball.offsetY( -( (ball.getRadius()*(1-newScale) )/newScale ) ); 

		// quadLine.setX( quadLine.getX()/newScale ); 
		// quadLine.setY( quadLine.getY()/newScale ); 
		quadLine.scale({x:newScale,y:newScale})
		var x1 = quadLine.points()[0]
		var y1 = quadLine.points()[1]
		
		// curveLayer.setX(30)

		quadLine.offsetX( -(x1/newScale - x1) ); 
		quadLine.offsetY( -(y1/newScale - y1) ); 

		// console.log(  {x:x1-(x1/newScale - x1),y:y1-(y1/newScale - y1)}  )

		// console.log(x1);

		// curveLayer.setX( ball.getX() - x1/newScale )

		// console.log(curveLayer)

		curveLayer.draw(); 
	},
	zoomAdjust: function(event)
	{
		// console.log(ui.zoom)


		// console.log(layer)

		var newScale = ui.zoom;  
		console.log(newScale)
		layer.scale({x:newScale,y:newScale}); 
		layer.offsetX( -(ball.getX()/newScale - ball.getX()) ); 
		layer.offsetY( -(ball.getY()/newScale - ball.getY()) ); 

		console.log(layer.offsetX()); 

		layer.draw(); 

		quadLine.scale({x:newScale,y:newScale})
		var x1 = quadLine.points()[0]
		var y1 = quadLine.points()[1]

		quadLine.offsetX( -(x1/newScale - x1) ); 
		quadLine.offsetY( -(y1/newScale - y1) ); 

		curveLayer.draw(); 
	}
}


$('#container').on('mousewheel', ui.zoomAdjust); 

$('#bigger').click(function(){
	ball.scale({x:.2,y:.2}); 
	ball.offsetY( -( (ball.getRadius()*(1-0.2) )/0.2 ) ); 
	quadLine.offsetY( -( (ball.getRadius()*(1-0.2) ) ) ) 
	layer.draw(); 
}); 

$('#rotate').click(function(){	
	// var cannonOrigin = {"x":cannon.getX(),"y":cannon.getY()}; 
	// cannon.setX(startP.x);
	// cannon.setY(startP.y) 
	// cannon.rotate(30); 
	// console.log(cannonOrigin)
	// cannon.offSet([cannonOrigin.x,cannonOrigin.y])
	// cannon.setX(cannonOrigin.x); 
	// cannon.setY(cannonOrigin.y); 
	cannon.rotation(-45+(26.5))
	layer.draw(); 
})

$('#container').mousemove(function(e){
	return;
	// console.log("asdf")
	// console.log(cannon.getX())
	// console.log(e)
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
	// console.log(c); 
	// console.log(  -1*(e.pageY-cannon.getY()) ); 
	// console.log( Math.asin( -1*(e.pageY-cannon.getY())/c ) * 180 / Math.PI  ); 
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