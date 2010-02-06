var timer_on=0;
var light=0;
var light1=0;
var ON   = 1;
var OFF  =0;
var response = 0;
var infinite_timer;
var responsebutton = 1;
var ansvers = 0;

var page_chauf_init=0;  // mise a 1 lorsqu'on a positionee les differents champs une premiere fois.

/////////////////////////////
//  Init page
/////////////////////////////
function init_page()
{
    select_page(1);
    get_data_loop();
}

/////////////////////////////
//     GET sensor data
//    send get command to get 
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
    //        alert( http_request.status );
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

var local=1;

function server_ansvers(http_request)
{
    if (local == 1)
    {
        process_data(http_request.responseText);
        ansvers=0;    
    }
    else
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
    //        alert( http_request.status );
                ansvers = 0;
            }
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

//    alert(url);
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
    //        alert( http_request.status );
            ansvers = 0;
        }
     }
}

window.onload=init_page;

/////////////////////////////
//     parse incomming data
//    parse data used on this
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
mode_chauf[2]="Auto";
mode_chauf[3]="Off";
mode_chauf[4]="Hors-gel";

// prechargement des images, ainsi elles ne sont lues qu'une fois.
cache_images= new Array();
cache_images[0]= new Image;
cache_images[0].src= "feux0.gif"
cache_images[1]= new Image;
cache_images[1].src= "feux1.gif"

var p;
var p_is_ok= 0;

function process_data_temp()
{
    // temperatures & hygro
    for(i=1;i<8;i++)
    {
        id_tempe="tempe_"+nom_affectations[i];
        document.getElementById(id_tempe).innerHTML= "<img style=\"vertical-align:middle\" src=\"thermo.gif\"/>&nbsp;&nbsp;&nbsp;"+lacrosse2int(p.root.data.tempe[i])+"&deg;C";
        if (p.root.data.hygro[i] != 255)
        {
            id_hygro="hygro_"+nom_affectations[i];
            document.getElementById(id_hygro).innerHTML="<img style=\"vertical-align:middle\" src=\"goutte.gif\"/>&nbsp;&nbsp;&nbsp;"+p.root.data.hygro[i]+"%";
        }
    }

    // chauffage
    for(i=0;i<2;i++)
    {
        //alert("affectation "+i+" = "+p.root.config.chauffage[i].affectation);

        // *******************************************
        id_chauf= "chauf_"+nom_affectations[p.root.config.chauffage[i].affectation];
        def="Mode <strong>"+mode_chauf[p.root.config.chauffage[i].mode]+"</strong>"
        if (p.root.config.chauffage[i].mode == 2)
        {
            // mode automatique, on précise le mode sélectionné actuellement
            def=def+"/"+mode_chauf[p.root.data.chauffage[i].modeCrt];
        }
        def=def+" ("+lacrosse2int(p.root.data.chauffage[i].consCrt)+"&deg;C)&nbsp;";
        for(j=0;j<p.root.data.chauffage[i].nbRad;j=j+1)
        {
            if (p.root.data.chauffage[i].radActif>j)
            {
                def=def+"&nbsp;<img style=\"vertical-align:bottom\" height=\"30px\" src=\"flamme.gif\">";
            }
            else
            {
//                def=def+"&nbsp;<img style=\"vertical-align:bottom\" height=\"30px\" src=\"flamme.gif\">";
            }
        }
        document.getElementById(id_chauf).innerHTML=def;
    }

    // lumino
    id_lum= "lumino_salon";
    document.getElementById(id_lum).innerHTML="<img style=\"vertical-align:middle\" src=\"soleil.gif\"/>  "+Math.round(p.root.data.lumino / 4096 * 100)+"%";
}


function process_data_chauf()
{
    var id;
    var t;

    // chauffage
    for(i=0;i<2;i++)
    {
        // Indiquer l'affectation de la zone
        id= "aff_affectation_zone"+i;
        def="<h1 class=\"affectation\">"+nom_affectations[p.root.config.chauffage[i].affectation]+"</h3>";
        document.getElementById(id).innerHTML=def;

        // Indiquer le reglage actuel
        id= "chauf_zone"+i; 
        def="Mode <strong>"+mode_chauf[p.root.config.chauffage[i].mode]+"</strong>"
        if (p.root.config.chauffage[i].mode == 2)
        {
            // mode automatique, on précise le mode sélectionné actuellement
            def=def+"/"+mode_chauf[p.root.data.chauffage[i].modeCrt];
        }
        def=def+" ("+lacrosse2int(p.root.data.chauffage[i].consCrt)+"&deg;C)&nbsp;";
        for(j=0;j<p.root.data.chauffage[i].nbRad;j=j+1)
        {
            if (p.root.data.chauffage[i].radActif>j)
            {
                def=def+"&nbsp;<img style=\"vertical-align:bottom\" height=\"30px\" src=\"flamme.gif\">";
            }
            else
            {
//                def=def+"&nbsp;<img style=\"vertical-align:bottom\" height=\"30px\" src=\"flamme.gif\">";
            }
        }
        document.getElementById(id).innerHTML=def;

        if (page_chauf_init == 0)
        {
            id= "mode_zone"+i;
            t= document.getElementById(id);
            t.value=p.root.config.chauffage[i].mode;

            // mettre a jour les consignes
            id= "cons_0_zone"+i;
            t= document.getElementById(id);
            t.innerHTML=lacrosse2int(p.root.config.chauffage[i].consigne[0])+"&deg;C";
            id= "cons_1_zone"+i;
            t= document.getElementById(id);
            t.innerHTML=lacrosse2int(p.root.config.chauffage[i].consigne[1])+"&deg;C";

            // mettre a jour affectation
            id="affectation_zone"+i;
            t= document.getElementById(id);
            t.value= p.root.config.chauffage[i].affectation;// p.root.config.chauffage[i].affectation;
        }
    }
    page_chauf_init= 1;
}


function process_data_edf()
{
    var content;
    var id;

    // compteurs
    id= "edf_hc";
    content= p.root.data.edf.hc/1000+" kWh";
    if (p.root.data.edf.hchp == 1) content="<strong>"+content+"</strong>";
    document.getElementById(id).innerHTML=content;

    id= "edf_hp";
    content= p.root.data.edf.hp/1000+" kWh";
    if (p.root.data.edf.hchp == 2) content="<strong>"+content+"</strong>";
    document.getElementById(id).innerHTML=content;
    
    id= "edf_papp";
    content= p.root.data.edf.papp;
    document.getElementById(id).innerHTML=content;

    id= "edf_iinst";
    content= p.root.data.edf.iinst;
    document.getElementById(id).innerHTML=content;
}

function process_data_page(noPage)
{
    if (p_is_ok)
    {
        switch(noPage)
        {
            case 0:
                process_data_temp();
                break;
            case 1:
                process_data_chauf();
                break;

            case 2:
                process_data_edf();
                break;
        }
    }
}


function process_data(data)
{
    // evaluer les donnees recues
    if (data.length > 0)
    {
        p = eval('(' + data + ')');
        p_is_ok= 1;
        process_data_page(pageSelected);
    }
}

//document.getElementById("b1").src ="b_blue.gif";
// noZone= 0|1
function modif_mode(noZone)
{
    var idComplet= "mode_zone"+noZone;
    var t= document.getElementById(idComplet);

    if (t.value != p.root.config.chauffage[noZone].mode)
    {
        alert("changement vers mode "+t.value);
        change_config("chauffage."+noZone+".mode="+t.value);
//    t.value=0;
    }
}

// noZone= 0|1
function modif_affectation_zone(noZone)
{
    var idComplet= "affectation_zone"+noZone;
    var t= document.getElementById(idComplet);

    if (t.value != p.root.config.chauffage[noZone].affectation)
    {
        alert("changement vers affectation "+t.value+", affec actuelle= "+p.root.config.chauffage[noZone].affectation);
        change_config("chauffage."+noZone+".affectation="+t.value);
//    t.value=0;
    }
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
    document.getElementById("cons_"+noCons+"_zone"+noZone).innerHTML= cons_temp[2*noZone+noCons]+"&deg;C"
}

function consPlus(noZone, noCons)
{
    consInit(noZone, noCons);
    cons_temp[2*noZone+noCons]= cons_temp[2*noZone+noCons]+0.5;
    document.getElementById("cons_"+noCons+"_zone"+noZone).innerHTML= cons_temp[2*noZone+noCons]+"&deg;C"
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

var pageSelected= -1;

function get_content(noPage)
{
    var content;

    content="error, unexpected page number ("+noPage+")!";

    switch (noPage)
    {
        // onglet temperatures ***************************************************************************************************
        case 0:
            content='<!-- start colonne gauche ************************************************************ --> \
<div id="col_0" class="post"> \
<h1 class="title">Ext&eacute;rieur</h1> \
<div class="entry"> \
    <p> \
  <TABLE BORDER="0" align="center"> \
    <TR> \
      <TD width="140px" align="left" id="tempe_ext"></TD> \
      <TD width="140px" align="right" id="hygro_ext"></TD> \
    </TR> \
  </TABLE> \
       </p> \
</div> \
<div class="post"> \
<h2 class="title">Atelier</h2> \
<div class="entry"> \
<p> \
  <TABLE BORDER="0" align="center"> \
    <TR> \
      <TD width="140px" align="left" id="tempe_atelier"></TD> \
      <TD width="140px" align="right" id="hygro_atelier"></TD> \
    </TR> \
    <TR><TD colspan="2" id="chauf_atelier"></TD></TR> \
  </TABLE> \
</p> \
</div> \
</div> \
 \
<div class="post"> \
<h2 class="title">Chambre d\'amis</h2> \
<div class="entry"> \
<p> \
  <TABLE BORDER="0" align="center"> \
    <TR> \
      <TD width="140px" align="left" id="tempe_chamis"></TD> \
      <TD width="140px" align="right" id="hygro_chamis"></TD> \
    </TR> \
    <TR><TD colspan="2" id="chauf_chamis"></TD></TR> \
  </TABLE> \
</p> \
</div> \
</div> \
</div> \
<!-- end colonne gauche --> \
<!-- start colonne droite ************************************************************ --> \
<div id="col_2"> \
<div class="post"> \
<h1 class="title">Chambre</h1> \
<div class="entry"> \
<p> \
  <TABLE BORDER="0" align="center"> \
    <TR> \
      <TD width="140px" align="left" id="tempe_chambre"></TD> \
      <TD width="140px" align="right" id="hygro_chambre"></TD> \
    </TR> \
    <TR><TD colspan="2" id="chauf_chambre"></TD></TR> \
  </TABLE> \
</p> \
</div> \
</div> \
<div class="post"> \
<h2 class="title">Salle de bain</h2> \
<div class="entry"> \
<p> \
  <TABLE BORDER="0" align="center"> \
    <TR> \
      <TD width="140px" align="left" id="tempe_sdb"></TD> \
      <TD width="140px" align="right" id="hygro_sdb"></TD> \
    </TR> \
    <TR><TD colspan="2" id="chauf_sdb"></TD></TR> \
  </TABLE> \
</p> \
</div> \
</div> \
</div> \
<!-- start colonne milieu ************************************************************ --> \
<div id="col_1"> \
<div class="post"> \
<h1 class="title">Salon</h1> \
<div class="entry"> \
<p> \
  <TABLE BORDER="0" align="center"> \
    <TR> \
      <TD width="100px" align="left" id="tempe_salon"></TD> \
      <TD width="80px" align="center" id="lumino_salon"></TD> \
      <TD width="100px" align="right" id="hygro_salon"></TD> \
    </TR> \
    <TR><TD colspan="3" id="chauf_salon"></TD></TR> \
  </TABLE> \
</p> \
</div> \
</div> \
<div class="post"> \
<h2 class="title">Cuisine</h2> \
<div class="entry"> \
<p> \
  <TABLE BORDER="0" align="center"> \
    <TR> \
      <TD width="140px" align="left" id="tempe_cuisine"></TD> \
      <TD width="140px" align="right" id="hygro_cuisine"></TD> \
    </TR> \
    <TR><TD colspan="2" id="chauf_cuisine"></TD></TR> \
  </TABLE> \
</p> \
</div> \
</div> \
<!-- end recent-posts --> </div>';
            break;

        // onglet chauffage ******************************************************************************************************
        case 1:
//            content='<p align="center">Cette page n\'est pas encore impl&eacute;ment&eacute;e.</p>';
            content='';
            // remplir les 2 colonnes avec la meme chose
            for(i=0; i<2; i++)
            {
                if (i==0) content=content+'<div id="col_gauche">';
                else content=content+'<div id="col_droite">';

                content=content+' \
<!-- start colonne ************************************************************ --> \
<div class="post"> \
<div class="entry"> \
  <TABLE BORDER="0" align="center"> \
    <TR><TD width="220px" align="left"   id="aff_affectation_zone'+i+'"></TD> \
        <TD width="220px" align="right"><h2 class="title">zone '+(i+1)+'</h2></TD></TR> \
    <TR><TD width="220px" align="left" colspan="2" id="chauf_zone'+i+'"></TD></TR> \
  </TABLE> \
</div> \
</div> \
<div class="entry"> \
  <TABLE BORDER="0" align="center"> \
    <TR><TD width="220px" align="right">Mode fonctionnement :&nbsp</TD> \
        <TD width="220px" align="left" colspan="2"> \
            <select id="mode_zone'+i+'" onclick="modif_mode('+i+');"> \
                <option value="0">'+mode_chauf[0]+'</option> \
                <option value="1">'+mode_chauf[1]+'</option> \
                <option value="2">'+mode_chauf[2]+'</option> \
                <option value="3">'+mode_chauf[3]+'</option> \
                <option value="4">'+mode_chauf[4]+'</option> \
            </select></TD></TR> \
    <TR><TD width="220px" align="right">Affectation pi&egrave;ce :&nbsp</TD> \
        <TD width="220px" align="left" colspan="2"> \
            <select id="affectation_zone'+i+'" onclick="modif_affectation_zone('+i+');">';
        for (noAff=2; noAff<7; noAff++)
        {
            content=content+'<option value="'+noAff+'">'+nom_affectations[noAff]+'</option>';
        }
        content=content+'</select> \
        </TD></TR> \
    <TR><TD width="220px" align="right">Temp&eacute;rature &eacute;conomique :&nbsp</TD> \
        <TD width="140px" align="center" id="cons_0_zone'+i+'"></TD> \
        <TD width="80px" align="left"><strong><a onclick=\"consMoins('+i+',0);\">&nbsp;&nbsp;-&nbsp;&nbsp;</a><a onclick=\"consPlus('+i+',0);\">&nbsp;&nbsp;+&nbsp;&nbsp;</a><a onclick=\"consSend('+i+',0);\">&nbsp;OK&nbsp;</a><strong></TD></TR> \
    <TR><TD width="220px" align="right">confort :&nbsp</TD> \
        <TD width="140px" align="center" id="cons_1_zone'+i+'"></TD> \
        <TD width="80px" align="left"><strong><a onclick=\"consMoins('+i+',1);\">&nbsp;&nbsp;-&nbsp;&nbsp;</a><a onclick=\"consPlus('+i+',1);\">&nbsp;&nbsp;+&nbsp;&nbsp;</a><a onclick=\"consSend('+i+',1);\">&nbsp;OK&nbsp;</a><strong></TD></TR> \
  </TABLE> \
<br> \
</div> \
</div> \
<!-- end colonne -->';
            }
            page_chauf_init= 0;
            break;

        // onglet EDF ************************************************************************************************************
        case 2:
            content='<div id="col_gauche"> \
<h2 class="title">Compteurs</h2> \
<div class="entry"> \
  <TABLE BORDER="0" align="center"> \
    <TR><TD width="220px" align="center">HP</TD><TD width="220px" align="center">HC</TD></TR> \
    <TR><TD width="220px" align="center" id="edf_hp"></TD><TD width="220px" align="center" id="edf_hc"></TD></TR> \
  </TABLE> \
<br> \
</div></div>\
<!-- end colonne gauche --> \
<!-- start colonne droite ************************************************************ --> \
<div id="col_droite"> \
<div> \
<h2 class="title">Instantann&eacute;</h2> \
<div class="entry"> \
  <TABLE BORDER="0" align="center"> \
    <TR><TD width="220px" align="center">Puissance (VA)</TD><TD width="220px" align="center">Intensit&eacute; (A)</TD></TR> \
    <TR><TD width="220px" align="center" id="edf_papp"></TD><TD width="220px" align="center" id="edf_iinst"></TD></TR> \
    <TR><TD colspan="2" id="chauf_chambre"></TD></TR> \
  </TABLE> \
<br> \
</div> \
</div> \
</div> \
';
            break;
    }

    return content;
}

function select_page(noPage)
{
    if (noPage != pageSelected)
    {
        pageSelected=noPage;

        // reeciture onglets
        id="menu";
        var content;
        content="<ul> <li";
        if (noPage == 0) content = content + " class=\"current_page_item\"";
        content= content+"><a onclick=\"select_page(0);\">temp&eacute;ratures</a></li><li";
        if (noPage == 1) content = content + " class=\"current_page_item\"";
        content= content+"><a onclick=\"select_page(1);\">chauffage</a></li><li";
        if (noPage == 2) content = content + " class=\"current_page_item\"";
        content=content+ "><a onclick=\"select_page(2);\">&eacute;lectricit&eacute;</a></li></ul>";
        document.getElementById(id).innerHTML= content;

        // reecriture page
        id="content";
        content=get_content(noPage);
        document.getElementById(id).innerHTML= content;

        // update des données si deja recues
        process_data_page(noPage);
    }
    //alert ("toto");
}

