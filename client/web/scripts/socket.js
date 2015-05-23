var websocket = function(url){
	var callbacks = {};
	var ws_url = url;
	var conn;
	this.bind = function(event_name, callback){
		callbacks[event_name] = callbacks[event_name] || [];
		callbacks[event_name].push(callback);
		return this;// chainable
	};
	this.send = function(event_name, event_data){
		this.conn.send( event_data );
		return this;
	};
	this.connect = function() {
		if ( typeof(MozWebSocket) == 'function' )
			this.conn = new MozWebSocket(url);
		else
			this.conn = new WebSocket(url);
		this.conn.onmessage = function(evt){
			dispatch('message', evt.data);
		};
		this.conn.onclose = function(){dispatch('close',null)}
		this.conn.onopen = function(){dispatch('open',null)}
	};
	this.disconnect = function() {
		this.conn.close();
	};
	var dispatch = function(event_name, message){
		var chain = callbacks[event_name];
		if(typeof chain == 'undefined') return;
		for(var i = 0; i < chain.length; i++){
			chain[i]( message )
		}
	}
};


// usage
var Server = new websocket('ws://192.168.1.112:9300');

Server.connect();
Server.bind('message', function( payload ) {
    console.log(payload);
});


