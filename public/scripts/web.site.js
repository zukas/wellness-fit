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
    	contact.onclick =  function () {
    		root.scrollBodyTo(document.getElementById("contact-panel"));
    	}
    }());

}(this));