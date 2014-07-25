requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        'jquery': 'jquery-1.11.1.min',
        'jquery-ui': 'jquery-ui/jquery-ui-1.10.4.custom.min',
        'css': 'css.min',
        'underscore': 'underscore',
        'backbone': 'backbone',
        'mockup':'../mvapp/mockup'
    },

    shim: {
        'jquery-ui': {
            deps: ['css!../../css/jquery-ui/flick/jquery-ui-1.10.4.custom.min.css']
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
});

requirejs(['jquery', 'backbone','mockup','css!../../css/style.css'], function($, Backbone,data) {
    var PlayerModel = Backbone.Model.extend({
        defaults: {
            "isRun": false,
            "style": {
                "width": 0,
                "height": 0,
                "top": 0,
                "left": 0,
            }
        },
        size: function() {
            return {
                w: this.get("style").width,
                h: this.get("style").height
            }
        },
        location: function() {
            return {
                x: this.get("style").top,
                y: this.get("style").left
            }
        }
    });

    var BoxModel = Backbone.Model.extend({
        defaults: {
            "color": "#fff",
            "style": {
                "width": 0,
                "height": 0,
                "top": 0,
                "left": 0,
            }
        },
        size: function() {
            return {
                w: this.get("style").width,
                h: this.get("style").height
            }
        },
        location: function() {
            return {
                x: this.get("style").top,
                y: this.get("style").left
            }
        }
    });

    var PlayerView = Backbone.View.extend({
        id: "container",
        events: {
            "click": "play"
        },

        render:function(){
            $(this.el).css($.extend({
                "position": "absolute"
            }, this.model.get("style")));
            $("body").append(this.el);
            return this;
        },

        play: function() {
            if (!this.model.get("isRun")) {
                this.model.set({ 
                    "isRun": true
                });

                var b = new BoxModel();
                new BoxView({model:b}).init($(this.el));

                var i = 0;
                read();
                function read(){
                    b.set({"color":data[i].color,"style":data[i].style});
                    setTimeout(function(){
                        if (i >= data.length - 1) {
                            i = 0;
                        } else {
                            i++;
                        }
                        read();
                    },data[i].time);
                }
            }
        }
    });

    var BoxView = Backbone.View.extend({
        init: function(f) {

            $(this.el).css($.extend({
                "position": "relative"
            }, this.model.get("style")));

            f.append($(this.el));

            this.model.bind("change:color", function(model, color) {
                $(this.el).css($.extend({
                    "backgroundColor": color
                }, model.get("style")));
            }, this);

            return this;
        }
    });

    $(function() {
        var p = new PlayerModel({
            "style": {
                "width": $(window).width(),
                "height": $(window).height(),
                "top":0,
                "left":0
            }
        });
        new PlayerView({
            model: p
        }).render();

    });
});