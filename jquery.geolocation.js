/*

    Geolocation
    Copyright (c) 2012 Thomas Michelbach
    
*/

(function($){
    
    function Geolocation(){
        this.enableHighAccuracy = true;
        this.route = [];
        this.id = null;
        this.maximumAge = 30000;
        this.timeout = 27000;
    }
    
    Geolocation.prototype.support = function(){
        return (navigator.geolocation != null);
    }

    Geolocation.prototype.track = function(success, error){
        if(this.support()){
            var reference = this;
            this.id = navigator.geolocation.watchPosition(function(next){
                next.distance = function(coordinates){
                    var dLat = (coordinates.latitude - this.coords.latitude) * (Math.PI / 180);
                    var dLon = (coordinates.longitude - this.coords.longitude) * (Math.PI / 180);
                    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.coords.latitude * (Math.PI / 180)) * Math.cos(coordinates.latitude * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
                    return 6371000 * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
                };
                var previous = (reference.route.length == 0) ? null : reference.route[reference.route.length - 1];
                if(previous === null || (previous.coords.accuracy != next.coords.accuracy || previous.coords.latitude != next.coords.latitude || previous.coords.longitude != next.coords.longitude)){
                    reference.route.push(next);
                    success.call(reference, next);                                        
                }
            }, function(reason){
                error.call(reference, reason);
            }, {enableHighAccuracy: this.enableHighAccuracy, maximumAge: this.maximumAge, timeout: this.timeout});
        }else{
            error.call(this, {message: 'Browser does not support geolocation!'});
        }
    }
    
    Geolocation.prototype.untrack = function(){
        navigator.geolocation.clearWatch(this.id);        
    }
    
    $.extend({
        geolocation: new Geolocation
    });
    
    $.extend($.support, {
		geolocation:function(){
			return $.geolocation.support();
		}
	});
    
})(jQuery);