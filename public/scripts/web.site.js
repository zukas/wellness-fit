(function (root) {
    "use strict";

    (function () { 
    	"use strict";
    	var join 	= document.getElementById("join"),
    		contact = document.getElementById("contact-panel");
    	join.onclick =  function () {
    		root.scrollBodyTo(contact);
    	}
    }());

    (function () { 
    	"use strict";
    	var home 	= document.getElementById("home"),
    		list	= document.getElementById("list"),
    		tech	= document.getElementById("tech"),
    		price	= document.getElementById("price"),
    		gallery	= document.getElementById("gallery"),
    		contact = document.getElementById("contact");
    	home.onclick =  function () {
    		root.scrollBodyTo(document.getElementById("home-panel"));
    	}
    	list.onclick =  function () {
    		root.scrollBodyTo(document.getElementById("list-panel"));
    	}
    	tech.onclick =  function () {
    		root.scrollBodyTo(document.getElementById("tech-panel"));
    	}
    	price.onclick = function () {
    		root.scrollBodyTo(document.getElementById("price-panel"));
    	}
    	gallery.onclick = function () {
    		root.scrollBodyTo(document.getElementById("gallery-panel"));
    	}
    	contact.onclick =  function () {
    		root.scrollBodyTo(document.getElementById("contact-panel"));
    	}
    }());

    root.init_maps = function () {
		var map_obj     = new google.maps.Map(document.getElementById("map"), {
                center: new google.maps.LatLng(52.152296, 21.035628),
                zoom : 17,
                mapTypeControl : false,
                fullscreenControl: false
            }),
            marker      = new google.maps.Marker({ map : map_obj }),
            service     = new google.maps.places.PlacesService(map_obj),
            info        = document.createElement("div"),
            name        = document.createElement("div"),
            address     = document.createElement("div");

        info.className = "location-info";
        name.className = "location-info-name";
        address.className = "location-info-address";

        info.appendChild(name);
        info.appendChild(address);

        map_obj.controls[google.maps.ControlPosition.TOP_LEFT].push(info);


        service.getDetails({placeId : "ChIJP2R9Lq4zGUcREPtrr3nK1t0" }, function (place, status) {
            marker.setPlace({
                placeId: place.place_id,
                location: place.geometry.location
            });

            name.innerHTML = place.name;
            address.innerHTML = place.formatted_address;
        });
    }

}(this));