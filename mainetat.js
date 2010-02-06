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


//////////////////////////////
//            MAKE REQUEST
//////////////////////////////
/*function make_request(url)
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
  http_request.open('GET', 'root.req?'+my_command, true );
  http_request.send(null);
 }
}*/

//////////////////////////////////
//             SERVER ANSVERS
//////////////////////////////////
/*function server_response(http_request)
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
}*/
/////////////////////////////
//             INFINE LOOP
/////////////////////////////

//function infinite_loop()
//{
// if(!response)
//    make_request("pot_data.jso");
//}

function get_data()
{
	var http_request = open_ActiveXobject();
	if(!http_request) return 0;            // Do I'am connected ?
	
	http_request.onreadystatechange = function() {server_ansvers(http_request);};
	http_request.open('GET', 'root.json', true );
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

function change_config(url)
{
	var http_request = open_ActiveXobject();
	if(!http_request) return 0;            // Do I'am connected ?
	
	http_request.onreadystatechange = function() {server_ansvers(http_request);};
	http_request.open('GET', 'root.req?config.'+url, true );
	http_request.send(null);
}

/*function change_config(url)
{
	var http_request = open_ActiveXobject();  // Do I'am connected ?
	if(!http_request)
	{
		alert("couln't open http_request");
		return 0;
	}

//	alert(url);
window.defaultStatus = url;
	http_request.onreadystatechange = function() { server_ansvers(http_request); };
	http_request.open('GET', 'root.req?config.'+url, true );
	http_request.send(null);
}*/

function server_ansvers_form(http_request)
{
	if (http_request.readyState == 4)  // acknowledged
	{
		if (http_request.status == 200) // perfekt
		{
			//process_data(http_request.responseText);
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
var nom_affectations= new Array();
nom_affectations[1]="ext"
nom_affectations[2]="salon"
nom_affectations[3]="chambre"
nom_affectations[4]="atelier"
nom_affectations[5]="cuisine"
nom_affectations[6]="chamis"
nom_affectations[7]="sdb"

var mode_chauf= new Array();
mode_chauf[0]="Economique";
mode_chauf[1]="Confort";
mode_chauf[2]="Automatique";
mode_chauf[3]="Off";
mode_chauf[4]="Hors-gel";

// prechargement des images, ainsi elles ne sont lues qu'une fois.
cache_images= new Array();
cache_images[0]= new Image;
cache_images[0].src= "feux0.gif"
cache_images[1]= new Image;
cache_images[1].src= "feux1.gif"

var p;

function process_data(data)
{
	// evaluer les donnees recues
	p = eval("(" + data + ")");
    
	// temperatures
	for(i=1;i<8;i=i+1)
	{
		id_tempe="tempe_"+nom_affectations[i];
		document.getElementById(id_tempe).innerHTML= (p.root.data.tempe[i]-400)/10+"°C";
	}

	// chauffage
	for(i=0;i<2;i=i+1)
	{
		//alert("affectation "+i+" = "+p.root.config.chauffage[i].affectation);
		id_chauf= "chauf_"+nom_affectations[p.root.config.chauffage[i].affectation];
		def="Mode= "+mode_chauf[p.root.config.chauffage[i].mode]+"<BR><BR>"
		def=def+"mode actuel= "+mode_chauf[p.root.data.chauffage[i].modeCrt]+"<BR>";
		def=def+"cons= "+(p.root.data.chauffage[i].consCrt-400)/10+"<BR>";
		for(j=0;j<p.root.data.chauffage[i].nbRad;j=j+1)
		{
			if (p.root.data.chauffage[i].radActif>j)
			{
				def=def+"<img src=\"feux1.gif\">";
			}
			else
			{
				def=def+"<img src=\"feux0.gif\">";
			}
		}
		def=def+"<BR><BR>";
		def=def+"Eco= "+(p.root.config.chauffage[i].consigne[0]-400)/10+"°C<BR>";
		def=def+"Conf= "+(p.root.config.chauffage[i].consigne[1]-400)/10+"°C<BR>";
		document.getElementById(id_chauf).innerHTML=def;
	}

	// lumino
	id_lum= "lumino_salon";
	document.getElementById("id_lum").innerHTML="Lumino: "+Math.round(p.root.data.lumino / 4096 * 100)+"%";
}

//document.getElementById("b1").src ="b_blue.gif";

function modif_zone(id)
{
	var t= document.getElementById(id);

	alert(t.value);
}

function verifRadio()
{
	var liste = document.forms["zone0"].mode;
	window.defaultStatus = 'texte que vous voulez';
	for (var i = 0; i < liste.length; i++) {
		if (liste[i].checked) {
		alert('Le champ "' + liste[i].value + '", index '+i+', est bien selectionne.');
		change_config("chauffage.0.mode="+i);
		return;
		}
	}
	
	liste[0].focus();
	alert('Vous devez renseigner le champ!');
}

var cons_temp= new Array();
cons_temp[0]= -1;
cons_temp[1]= -1;
cons_temp[2]= -1;
cons_temp[3]= -1;

function lacrosse2int(val)
{
	return (val -400)/10;
}

function int2lacrosse(val)
{
	return (val*10)+400;
}


function consInit(noZone, noCons)
{
	if (cons_temp[2*noZone+noCons] == -1)
	{
		cons_temp[2*noZone+noCons]= lacrosse2int(p.root.config.chauffage[noZone].consigne[noCons]);
	}
}

function consMoins(noZone, noCons)
{
	consInit(noZone, noCons);
	cons_temp[2*noZone+noCons]= cons_temp[2*noZone+noCons]-0.5;
	document.getElementById("cons"+noCons+"_set").innerHTML= cons_temp[2*noZone+noCons]+"°C"
}

function consPlus(noZone, noCons)
{
	consInit(noZone, noCons);
	cons_temp[2*noZone+noCons]= cons_temp[2*noZone+noCons]+0.5;
	document.getElementById("cons"+noCons+"_set").innerHTML= cons_temp[2*noZone+noCons]+"°C"
}

function consSend(noZone, noCons)
{
	if (cons_temp[2*noZone+noCons] != -1)
	{
		val= int2lacrosse(cons_temp[2*noZone+noCons]);
		cons_temp[2*noZone+noCons]= -1;
		change_config("chauffage."+noZone+".consigne."+noCons+"="+val);
	}
}
