function displayTip(referenceValue){
	console.log("ReferenceValue", referenceValue); 

	var point_type = referenceValue.point_type; 
	var x = referenceValue.x; 
	var y = referenceValue.y; 
	var v = referenceValue.v; 
	var angle = referenceValue.angle; 
	var acceleration = referenceValue.acceleration; 
	var gravity = referenceValue.gravity; 
	var a = referenceValue.a; 
	var t = referenceValue.t; 
	var d = referenceValue.d; 
	var tipObj = referenceValue.tipObj; 
	var showFlag = false;
	

	if(tipObj.tipObject == null)
	{
		tipObj.tipObject = new Opentip(
			"#container",
			"<hr style='margin-top:5px;margin-bottom:15px;'/><div class='explaintrigger smalltip minimized'>Explanation</div>",
			{
				showOn: null,
				hideTrigger:'closeButton',
				fixed:true
			}
		); 
		tipObj.tipObject.hide(); 
	}
	else if(  tipObj.tipObject.constructor.name == "Opentip" )
	{
		showFlag = true;
	}

	var tooltipContents = "At position ($x, $y). <br/>";
	tooltipContents+="<hr/><br/>";  
	tooltipContents+="<b class='right-caret expander' id='where_start'></b><b class='right-border'></b> 1.Where to Start?<br/><hr/>";  
	tooltipContents+="<div class='hidden-info'style='display:none;' id='where_start_info'>$start_info<br/><hr/></div>";  
	tooltipContents+="<b class='right-caret expander' id='formula_variables'></b><b class='right-border'></b> 2.Formulas & Variables<br/><hr/>"; 
	tooltipContents+="<div class='hidden-info'style='display:none;' id='formula_variables_info'>$formula_variables_info<br/><hr/></div>";  
	tooltipContents+="<b class='right-caret expander' id='mathematics'></b><b class='right-border'></b> 3.Applying the Mathematics<br/><hr/>"; 
	tooltipContents+="<div class='hidden-info'style='display:none;' id='mathematics_info'>$mathematics_info</div>"; 

	var start_info; 
	if(point_type=="top"){
		start_info="The top point is the moment when the ball begins to fall to the ground. <br/><br/>"
		start_info+="This can be seen as the moment when the vertical velocity of the ball is 0. <br/><br/>"
		start_info+="Therefore, determine when the vertical velocity of the ball is 0, then determine how far the ball has traveled upward in that given time."
	}

	if(point_type=="final"){
		start_info="The final point is the moment when the ball begins falls to the ground. <br/><br/>"
		start_info+="This can be seen as the moment when the vertical distance of the ball is 0. <br/><br/>"
		start_info+="Therefore, determine when does the ball reach a vertical distance of 0, then determine how far the ball has traveled upward in that given time."
	}

	var formula_variables_info; 
	if(point_type=="top"){
		formula_variables_info="Velocity Formula: v<sub>f</sub>=v<sub>i</sub>+a*t <br/><br/>"
		formula_variables_info+="Distance Formula: d=v<sub>i</sub>*t + &frac12;*a*t<sup>2</sup> <br/><br/>"
		formula_variables_info+="Determining the Variables<br/><br/>"
		formula_variables_info+="v<sub>i</sub> is Initial Velocity, and in this case refers to the vertical velocity. <br/>"
		formula_variables_info+="Initial Vertical Velocity is calculated by: v*sin(&Theta;), where v is the Velocity. <br/><br/>"
		formula_variables_info+="a is Acceleration plus Gravity, this is calculated by: (acceleration + gravity) <br/>"
	}

	if(point_type=="final"){
		formula_variables_info="Distance Formula: d=v<sub>i</sub>*t + &frac12;*a*t<sup>2</sup> <br/><br/>"
		formula_variables_info+="Determining the Variables<br/><br/>"
		formula_variables_info+="v<sub>i</sub> is Initial Velocity, and in this case both vertical velocity and horizontal velocity is needed. <br/>"
		formula_variables_info+="Initial Vertical Velocity is calculated by: v*sin(&Theta;), where v is the Velocity. <br/><br/>"
		formula_variables_info+="Initial Horizontal Velocity is calculated by: v*cos(&Theta;), where v is the Velocity. <br/><br/>"
		formula_variables_info+="a is Acceleration plus Gravity, this is calculated by: (acceleration + gravity) <br/>"
	}

	var mathematics_info; 
	if(point_type=="top"){
		mathematics_info="Calculating v<sub>i</sub>, Initial Velocity<br/><br/>"
		mathematics_info+="v<sub>i</sub>=v*sin(&Theta;), v=$velocity, &Theta;=$angle, v<sub>i</sub>=$verticalvelocity<br/><br/>"
		mathematics_info+="Determine the time. <br/><br/>"
		mathematics_info+="v<sub>f</sub>=v<sub>i</sub>+a*t<br/>"
		mathematics_info+="0=$verticalvelocity+a*t, remember we are looking for the moment when the final vertical velocity is 0. <br/>"
		mathematics_info+="0=$verticalvelocity+(acceleration+gravity)*t, acceleration + gravity = $acceleration + $gravity = $a<br/>"
		mathematics_info+="-$verticalvelocity=$a*t, -$verticalvelocity/$a=t, $t is the time when the projectile reaches maximum height.<br/><br/>"
		mathematics_info+="Now, we determine the distance. <br/><br/>"
		mathematics_info+="d=v<sub>i</sub>*t + &frac12;*a*t<sup>2</sup> <br/>"
		mathematics_info+="d=$verticalvelocity*$t + &frac12;*$a*$t<sup>2</sup>, d=$d <br/>"
	}

	if(point_type=="final"){
		mathematics_info="Calculating v<sub>i</sub>, in this case the vertical velocity <br/><br/>"
		mathematics_info+="Determine the time<br/><br/>"
		mathematics_info+="d=v<sub>i</sub>*t + &frac12;*a*t<sup>2</sup>, where v<sub>i</sub> is the vertical velocity. <br/>"
		mathematics_info+="Set d=0, since this is the moment where the ball reaches the ground. <br/>"
		mathematics_info+="0=v<sub>i</sub>*t + &frac12;*a*t<sup>2</sup>, proceed to divide t on both sides.  <br/>"
		mathematics_info+="0=v<sub>i</sub> + &frac12;*a*t <br/>"
		mathematics_info+="-v<sub>i</sub>/(&frac12;*a)=t <br/>"
		mathematics_info+="-v<sub>i</sub>=v*cos(&Theta;)=$velocity*cos($angle)=$verticalvelocity <br/>"
		mathematics_info+="a=(acceleration+gravity)=$acceleration+$gravity=$a<br/>"
		mathematics_info+="-v<sub>i</sub>/(&frac12;*a)=t=$verticalvelocity/(&frac12;*$a)=$t<br/>"

		mathematics_info+="Now, we determine the distance. <br/><br/>"
		mathematics_info+="d=v<sub>i</sub>*t + &frac12;*a*t<sup>2</sup>, where v<sub>i</sub> is the horizontal velocity. <br/>"
		mathematics_info+="v<sub>i</sub>=v*cos(&Theta;)<br/>"
		mathematics_info+="v<sub>i</sub>=v*cos(&Theta;)=$velocity*cos($angle)=$horizontalvelocity<br/>"
		mathematics_info+="d=$horizontalvelocity*$t + &frac12;*$a*$t<sup>2</sup>, d=$d <br/>"
	}

	tooltipContents = tooltipContents.replace("$x" , x ).replace("$y", y)
	.replace("$start_info", start_info).replace("$formula_variables_info", formula_variables_info).replace("$mathematics_info", mathematics_info)
	.replace(/\$velocity/g, v.v).replace(/\$angle/g, angle).replace(/\$verticalvelocity/g, v.ver)
	.replace(/\$horizontalvelocity/g,v.h).replace(/\$acceleration/g, acceleration )
	.replace(/\$gravity/g, gravity) .replace(/\$a/g, a) .replace(/\$d/g, d) .replace(/\$t/g,  t);

	tipObj.tipObject.setContent(tooltipContents)

	if(showFlag){tipObj.tipObject.show();}

	var expanderFunc = function(){
		var tipDisplayPosition;
		if(point_type=="top")
		{
			tipDisplayPosition={left:$('#opentip-1').position().left, top:$('#opentip-1').position().top } 
		}
		if(point_type=="final")
		{
			tipDisplayPosition={left:$('#opentip-2').position().left, top:$('#opentip-2').position().top } 
		}

		$(this).siblings("div.hidden-info").css('display','none')
		$(this).siblings( "#"+$(this).attr('id')+'_info' ).css('display','inline')

		var siblings = $(this).siblings("b.expander")
		for(var i = 0; i < siblings.length; i++)
		{
			if( $(siblings[i]).hasClass("caret") ){ $(siblings[i]).removeClass("caret").addClass("right-caret"); }
		}

		if($(this).hasClass("right-caret")){$(this).removeClass("right-caret").addClass("caret");}
		else if($(this).hasClass("caret")){$(this).removeClass("caret").addClass("right-caret");}

		tipObj.tipObject.setContent($(this).parent()[0].innerHTML); 

		if(point_type=="top")
		{
			$('#opentip-1').offset(tipDisplayPosition); 
		}
		if(point_type=="final")
		{		
			$('#opentip-2').offset(tipDisplayPosition); 
		}		
		$('.expander').click(expanderFunc); 
	}
	$('.expander').click(expanderFunc); 
}