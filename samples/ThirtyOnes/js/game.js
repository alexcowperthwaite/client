var knocked = false;
var ws = new WebSocket("ws://localhost:8080/ThirtyOnes/App");
var dbg = true;
var card1, card2, card3, card4;

var EMPTY = "empty";
var KNOCKED = "Knocked";

//SERVER EVENTS
var EVNT_KNOCK = "KNOCK";
var EVNT_GET_CARD = "GET_CARD"; 
var EVNT_PUT_CARD = "PUT_CARD";

//CLIENT EVENTS
var EVNT_BEGIN_GAME = "BEGIN_GAME";
var EVNT_START_TURN = "START_TURN";
var EVNT_CARD = "CARD";
var EVNT_END_GAME = "END_GAME";
var EVNT_KNOCKED = "KNOCKED";

function start_turn(){
	if(dbg){
		debug("Start turn");
	}
	
	//enable selection buttons
	var x = document.getElementsByClassName("select");
	for (i=0; i < x.length; i++){
		x[i].disabled = false;
	}
}

ws.onmessage = function(message){
    o = JSON.parse(message);
    if(dbg){
		debug(o.eventName);
	}
	event = o.eventName;
	
	if(event == EVNT_BEGIN_NAME){
		begin_game(o.data);
	}
	else if (event == EVNT_START_TURN){
		start_turn();
	}
	else if (event == EVNT_CARD){
		get_card(o.data);
	}
	else if (event == EVNT_END_GAME){
		end_game(o.data);
	}
	else if (event == EVNT_KNOCKED){
		knocked();
	}
	else{
		alert("unknown event: " + event);
	}
};

function send_event(event, data){

	var o = new Object();
	o.eventName = event;
	o.data = data
	var str = JSON.stringify(o);
	ws.send(str);
}


function end_turn(){
	if(dbg){
		debug("ending turn");
	}
	update_hand();
	var x = document.getElementsByClassName("actions");
	for (i=0; i < x.length; i++){
		x[i].disabled = true;
	}
}

function enable_discard(){
	if(dbg){
		debug("enable discard");
	}
	var x = document.getElementsByClassName("discard");
	for (i=0; i < x.length; i++){
		x[i].disabled = false;
	}
}

function knock(){
	if(dbg){
		debug("Knocking");
	}
	knocked = true;
	//send_event(EVNT_KNOCK,"")
	end_turn();
}

function knocked(){
	if(dbg){
		debug("Knocked");
	}
	knocked = true;
	end_turn();
}

function discardCard(numCard){
	if(dbg){
		debug("Discarding card " + numCard );
	}
	
	var card;
	
	if (numCard == 1){
		card = card1;
		card1 = card4;
		card4 = EMPTY;
	}
	else if (numCard == 2){  
		card = card2;
		card2 = card4;
		card4 = EMPTY;
	}	
	else if (numCard == 3){
		card = card3;
		card3 = card4;
		card4 = EMPTY;
	}
	else{ 
		card = card4;
		card4 = EMPTY;
	}
	
	update_hand();
	//send_event(EVNT_PUT_CARD, card);
	end_turn();
}

function get_card(newCard){
    if(dbg){
		debug("Get card");
	}
	card4 = newCard;
	update_hand();
	enable_discard();
}

function endGame(msg){
	document.getElementById("lblknock").innerHTML = msg;
	ws.close();
}

function selectCard(num){
	send_event(EVNT_GET_CARD,num);
}

function begin_game(cards){
	if(dbg){
		debug("Begin game");
	}
	cards = JSON.parse(cards);
	card1 = cards[0];
	card2 = cards[1];
	card3 = cards[2];
	card4 = EMPTY;
	update_hand();
}

function update_hand(){
	if(dbg){
		debug("updating display");
	}
	document.getElementById("lblcard1").innerHTML = card1.value + " of " + card1.suit;
	document.getElementById("lblcard2").innerHTML = card2.value + " of " + card2.suit;
	document.getElementById("lblcard3").innerHTML = card3.value + " of " + card3.suit;
	if (knocked){
		document.getElementById("lblknock").innerHTML = KNOCKED;
	}
	
	if(card4 != EMPTY){
		document.getElementById("lblcard4").innerHTML = card4.value + " of " + card4.suit;
	}
	else{
		document.getElementById("lblcard4").innerHTML = "(none)";
	}
}

function card(suitIn, valueIn){
	this.suit = suitIn;
	this.value = valueIn;
}

function sendEvent(evtName, data){
	var o = new Object();
	o.eventName = evtName;
	o.data;
	e = JSON.stringify(o);
	
}


function test(){
	//alert("infunc");
	var cards = new Array();
	cards[0] = new card("diamonds", "four");
	cards[1] = new card("diamonds", "five");
	cards[2] = new card("diamonds", "six");
	//alert(cards);
	
	json = JSON.stringify(cards);
	begin_game(json);
	start_turn();
	//get_card(new card("diamonds", "ace"));
	//end_turn();
	
    //alert(json);
	//obj = JSON.parse(json);
	
	//var str = toJSON(c);
	//var obj = fromJSON(str);
	//alert(obj.suit);
}

function debug(msg){
	if(dbg){
		alert(msg);
	}
}