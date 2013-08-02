/* Copyright (c) 2013 Eugene Sachek (cageka86@gmail.com)
* Licensed under the GPL license (http://www.opensource.org/licenses/gpl-license.php).
* this library has important function cloneEvents that allows you to copy all events recursively from one html-element to other that has identical structure
* It's important that copying touches only events binded to first one (from element) with jQuery.
*/
jQuery.fn.extend({
    cloneEvents: function(from, debugInChrome) { 
        from = (from.jquery) ? from : jQuery(from);
        var $from = from.find('*').andSelf();
        var to = jQuery(this);
        var $to = to.find('*').andSelf();

        if($from.size() == $to.size()){  // assume $from and $to are identical by structure
            var my_i = 0;
        } else {
            return this;
        }
        $.each($from, function(i1, v1){
            var fromEl = this;
            $.each($to, function(i2, v2) {
                if(i1 == i2) { // copy events from the same item
                    if(debugInChrome) {
                        console.log(i1 + ',' + i2 + ':' + fromEl.tagName + '!' + $(this).tagName);
                    }
                    jQuery.event.copy(fromEl, this);
                    return false;
                };
            });
        });
        
        return this;
    },
    copyEvents: function(from) {
        jQuery.event.copy(from, this);
        return this;
    },
    copyEventsTo: function(to) {
        jQuery.event.copy(this, to);
        return this;
    },
});

// base for copying events (tested for jq 1.4.2 and 1.9)
jQuery.event.copy = function(from, to) {
    from = (from.jquery) ? from : jQuery(from);
    to   = (to.jquery)   ? to   : jQuery(to);

    if (!from.size() || !to.size()) return;

    $.each(to, function(){
        var $to = $(this);
        var _data = $._data || $.data; // (tested for jq 1.4.2 and 1.9)
        var events = _data(from[0], 'events');
        if(typeof events == 'object'){
            $.each(events, function() {
                // iterate registered handler of original
                $.each(this, function() {
                to.bind(this.type, this.handler);
                });
            });
        }
    });
};
