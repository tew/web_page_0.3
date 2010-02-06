var timer_on=0;
var light=0;
var light1=0;
var ON   = 1;
var OFF  =0;
var response = 0;
var infinite_timer;
var responsebutton = 1;
var ansvers = 0;

/////////////////////////////
//     GET sensor data
//	send get command to get 
//  sensor data
/////////////////////////////
function get_data_loop()
{
 if(!ansvers){
 	get_data();
 	ansvers = 1;
 }
 	setTimeout("get_data_loop()",10000);
}

/////////////////////////////////////
//         open_ActiveXobject
//           used in AJAX
/////////////////////////////////////
function open_ActiveXobject()
{
var http_request;
 if (window.XMLHttpRequest) {
     http_request = new XMLHttpRequest();
 }  else if (window.ActiveXObject) {
        try{
            http_request = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch(e){
                 try{
                     http_request = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                 catch(e) {}
        }
 }
 if(!http_request){
  alert('Cannot create XMLHTTP');
  return 0;
 }
 return http_request;
}

function light1_on_off(state) {
 if(!state){
  document.all.black1.filters.Alpha.opacity = intensity;
 }
 else{
  document.all.black1.filters.Alpha.opacity = 0;
 }
}

function light2_on_off(state) {
 if(!state){
  document.getElementById("black2").style.display = 'inline';
  document.getElementById("kitchen").style.display = 'none';
 }
 else{
    document.getElementById("black2").style.display = 'none';
  	document.getElementById("kitchen").style.display = 'inline';
 }
}

function button1(){
 if(!light){
  light1_on_off(1);
  light=1;
  document.getElementById("bulb_button").value="light OFF";
  }
   else{
    light1_on_off(0);
    light=0;
    document.getElementById("bulb_button").value="light ON";
   }
}

function button2 (){
var http_request = open_ActiveXobject();
if(!http_request) return 0;


 if(!light1){
  light1=1;
  my_command = "SSR1=LIGHT_ON";
 }
   else{
    light1=0;
    my_command = "SSR1=LIGHT_OFF";
   }

      http_request.onreadystatechange = function() {;};
      http_request.open('GET', 'pot_data.jso?'+my_command, true );
      http_request.send(null);
}

//////////////////////////////
//            MAKE REQUEST
//////////////////////////////
function make_request(url)
{
var http_request = open_ActiveXobject();
var my_value;
var my_command = 'PWM=MODULUS=';
                                       // Do I'am connected ?
if(!http_request) return 0;

 if(!response){
  response = 1;
  my_value=Math.round(dimmer_send);
  my_command += Math.round(740+(my_value*300));
  http_request.onreadystatechange = function() { server_response(http_request); };
  http_request.open('GET', 'pot_data.jso?'+my_command, true );
  http_request.send(null);
 }
}

function sendalarmdata()
{
var http_request = open_ActiveXobject();
if(!http_request) return 0;            // Do I'am connected ?

 if (!hour.value.match(/^\d+$/)) {
	 alert("Hour should be numeric!");
	 return;
 }
 if (!min.value.match(/^\d+$/)) {
	 alert("Min should be numeric!");
	 return;
 }
 if (!sec.value.match(/^\d+$/)) {
	 alert("sec should be numeric!");
	 return;
 }
 if (min.value>59) {
	 alert("min should between 0 and 59!");
	 return;
 }
 if (sec.value>59) {
	 alert("sec should between 0 and 59!");
	 return;
 }



  my_command = "alarm="+hour.value+"_"+min.value+"_"+sec.value;
  http_request.onreadystatechange = function() {;};
  http_request.open('GET', 'pot_data.jso?'+my_command, true );
  http_request.send(null);
}

//////////////////////////////////
//             SERVER ANSVERS
//////////////////////////////////
function server_response(http_request)
{
if (http_request.readyState == 4)  // acknowledged
	{
		if (http_request.status == 200) // perfekt
		{
			response=0;
  	}else
     {
   //   alert('There was a problem with the request.');
	//		alert( http_request.status );
			response = 0;
     }
 }
}
/////////////////////////////
//             INFINE LOOP
/////////////////////////////

function infinite_loop()
{
 if(!response)
    make_request("pot_data.jso");
}

function get_data()
{
	var http_request = open_ActiveXobject();
if(!http_request) return 0;            // Do I'am connected ?

  http_request.onreadystatechange = function() {server_ansvers(http_request);};
  http_request.open('GET', 'pot_data.jso?', true );
  http_request.send(null);
}

function server_ansvers(http_request)
{
	if (http_request.readyState == 4)  // acknowledged
	{
		if (http_request.status == 200) // perfekt
		{
			process_data(http_request.responseText);
			ansvers=0;	
  		}else
     	{
   //   alert('There was a problem with the request.');
	//		alert( http_request.status );
			ansvers = 0;
     	}
 	}
}
window.onload=get_data_loop;
/////////////////////////////
//     parse incomming data
//	parse data used on this
//   page
/////////////////////////////

function process_data(data)
{
	var p = eval("(" + data + ")");

	var parsed 		= data.split( "\n" );	//make substring

	var day 		= parseInt(parsed[7],10);
	var light		= parseInt(parsed[8],10);
	var dimmer_resistor = (parseInt(parsed[0],10));		// 0-100%
	var dimmer_led		= (parseInt(parsed[1],10));		// 0-100%
	
	if(!light){
	 light2_on_off(0);
     light1=0;
     document.getElementById("bulb_button1").value="light ON";	  
  	}else{
	  	light2_on_off(1);
    	light1=1;
    	document.getElementById("bulb_button1").value="light OFF";
	}
	
	if (document.getElementById("Resistor").checked){
		//document.all.black1.filters.Alpha.opacity = 100-(dimmer_resistor/41);
	}
	else if (document.getElementById("Diode").checked){
		//document.all.black1.filters.Alpha.opacity = 100-(dimmer_led/41);
	}
    
	document.getElementById("display_Day").value = day-1;
	document.getElementById("display_Hour").value = p.heure;
	document.getElementById("display_Min").value = p.minute;
	document.getElementById("display_Sec").value = p.seconde;
	document.getElementById("tempe_salon").value = p.tempe[1].value/10;
}

/////////////////////////////
//     Show and hide rows
/////////////////////////////

function show_hide_row(){ 
    // Make sure the element exists before calling it's properties 
    if (document.getElementById("passw_table") != null) 
      // Toggle visibility between none and inline 
      if (document.getElementById("passw_table").style.display == 'none')
      { 
        document.getElementById("passw_table").style.display = 'inline'; 
   
      } else { 
        document.getElementById("passw_table").style.display = 'none'; 
   
      } 
  }

/////////////////////////////
//     send pasw/change
/////////////////////////////
function send_pasw(){
var http_request = open_ActiveXobject();
var my_command;
var login		= document.getElementById("login").value;
var old_pasw	= document.getElementById("password_old").value;
var new_pasw	= document.getElementById("new").value;
var new_pasw_	= document.getElementById("new_").value;
var oldstring = login+":"+old_pasw;
var newstring = login+":"+new_pasw;
var reg = /[^\\/<>*#]+/; 


show_hide_row();												// clean
if(new_pasw != new_pasw_)
{
alert("new pasword incorrect !");
return false;	
}

var result = new_.value.match(reg);
if (result == null) { 
alert("new pasword incorrect !"); 
return false; 
}

document.getElementById("login").value = '';
document.getElementById("password_old").value = '';
document.getElementById("new").value = '';
document.getElementById("new_").value = '';
old_pasw = encodeBase64(oldstring);
new_pasw = encodeBase64(newstring);

if(!http_request) return 0;            // Do I'am connected ?
my_command = "ch_pasw=" + old_pasw +"_"+ new_pasw;
 http_request.onreadystatechange = function() {;};
 http_request.open('GET','pot_data.jso?' + my_command, true );
 http_request.send(null);
}
/////////////////////////////
//	enCrypt string
////////////////////////////
var END_OF_INPUT = -1;
var base64Chars = new Array(
    'A','B','C','D','E','F','G','H',
    'I','J','K','L','M','N','O','P',
    'Q','R','S','T','U','V','W','X',
    'Y','Z','a','b','c','d','e','f',
    'g','h','i','j','k','l','m','n',
    'o','p','q','r','s','t','u','v',
    'w','x','y','z','0','1','2','3',
    '4','5','6','7','8','9','+','/'
);
var base64Str;
var base64Count;

function setBase64Str(str){
    base64Str = str;
    base64Count = 0;
}
function readBase64(){    
    if (!base64Str) return END_OF_INPUT;
    if (base64Count >= base64Str.length) return END_OF_INPUT;
    var c = base64Str.charCodeAt(base64Count) & 0xff;
    base64Count++;
    return c;
}

function encodeBase64(str){
    setBase64Str(str);
    var result = '';
    var inBuffer = new Array(3);
    var lineCount = 0;
    var done = false;
    while (!done && (inBuffer[0] = readBase64()) != END_OF_INPUT){    
        inBuffer[1] = readBase64();
        inBuffer[2] = readBase64();
        result += (base64Chars[ inBuffer[0] >> 2 ]);
        if (inBuffer[1] != END_OF_INPUT){
            result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30) | (inBuffer[1] >> 4) ]);
            if (inBuffer[2] != END_OF_INPUT){
                result += (base64Chars [((inBuffer[1] << 2) & 0x3c) | (inBuffer[2] >> 6) ]);
                result += (base64Chars [inBuffer[2] & 0x3F]);
            } else {
                result += (base64Chars [((inBuffer[1] << 2) & 0x3c)]);
                result += ('=');
                done = true;
            }
        } else {
            result += (base64Chars [(( inBuffer[0] << 4 ) & 0x30)]);
            result += ('=');
            result += ('=');
            done = true;
        }
        lineCount += 4;
        if (lineCount >= 76){
            result += ('\n');
            lineCount = 0;
        }
    }
    return result;
}