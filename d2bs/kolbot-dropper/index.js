
/* global $ URLSearchParams*/
window.urlParams = new URLSearchParams(window.location.search);
$(function() {
    
/*--------------------------------------------------
	Plugin: Msg Growl
	--------------------------------------------------*/	
	//$('.growl-type').live ('click', function (e) {
		$.msgGrowl ({
			type: 'warning'
			, title: 'Notification Area'
			, text: 'For past notifications and app errors press "F12" om google chrome, click console tab'
			, position: 'bottom-left'
			, sticky:true
		});
	//});
	
	
	(function enableBackToTop () {
		var backToTop = $('<a>', { id: 'back-to-top', href: '#top' });
		var icon = $('<i>', { class: 'icon-chevron-up' });

		backToTop.appendTo ('body');
		icon.appendTo (backToTop);
		
	    backToTop.hide();

	    $(window).scroll(function () {
	        if ($(this).scrollTop() > 150) {
	            backToTop.fadeIn ();
	        } else {
	            backToTop.fadeOut ();
	        }
	    });

	    backToTop.click (function (e) {
	    	e.preventDefault ();

	        $('body, html').animate({
	            scrollTop: 0
	        }, 600);
	    });
	})()
	
    /*
     *  base64.js
     *
     *  Licensed under the BSD 3-Clause License.
     *    http://opensource.org/licenses/BSD-3-Clause
     *
     *  References:
     *    http://en.wikipedia.org/wiki/Base64
     */
    ;(function (global, factory) {
        typeof exports === 'object' && typeof module !== 'undefined'
            ? module.exports = factory(global)
            : typeof define === 'function' && define.amd
            ? define(factory) : factory(global);
    }((
        typeof self !== 'undefined' ? self
            : typeof window !== 'undefined' ? window
            : typeof global !== 'undefined' ? global
    : this
    ), function(global) {
        'use strict';
        // existing version for noConflict()
        var _Base64 = global.Base64;
        var version = "2.4.8";
        // if node.js and NOT React Native, we use Buffer
        var buffer;
        if (typeof module !== 'undefined' && module.exports) {
            if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
            } else {
                try {
                    buffer = require('buffer').Buffer;
                } catch (err) {}
            }
        }
        // constants
        var b64chars
            = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var b64tab = function(bin) {
            var t = {};
            for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
            return t;
        }(b64chars);
        var fromCharCode = String.fromCharCode;
        // encoder stuff
        var cb_utob = function(c) {
            if (c.length < 2) {
                var cc = c.charCodeAt(0);
                return cc < 0x80 ? c
                    : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                                    + fromCharCode(0x80 | (cc & 0x3f)))
                    : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                       + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                       + fromCharCode(0x80 | ( cc         & 0x3f)));
            } else {
                var cc = 0x10000
                    + (c.charCodeAt(0) - 0xD800) * 0x400
                    + (c.charCodeAt(1) - 0xDC00);
                return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                        + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                        + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
                        + fromCharCode(0x80 | ( cc         & 0x3f)));
            }
        };
        var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
        var utob = function(u) {
            return u.replace(re_utob, cb_utob);
        };
        var cb_encode = function(ccc) {
            var padlen = [0, 2, 1][ccc.length % 3],
            ord = ccc.charCodeAt(0) << 16
                | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
                | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
            chars = [
                b64chars.charAt( ord >>> 18),
                b64chars.charAt((ord >>> 12) & 63),
                padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
            ];
            return chars.join('');
        };
        var btoa = global.btoa ? function(b) {
            return global.btoa(b);
        } : function(b) {
            return b.replace(/[\s\S]{1,3}/g, cb_encode);
        };
        var _encode = buffer ?
            buffer.from && Uint8Array && buffer.from !== Uint8Array.from
            ? function (u) {
                return (u.constructor === buffer.constructor ? u : buffer.from(u))
                    .toString('base64');
            }
            :  function (u) {
                return (u.constructor === buffer.constructor ? u : new  buffer(u))
                    .toString('base64');
            }
            : function (u) { return btoa(utob(u)) }
        ;
        var encode = function(u, urisafe) {
            return !urisafe
                ? _encode(String(u))
                : _encode(String(u)).replace(/[+\/]/g, function(m0) {
                    return m0 == '+' ? '-' : '_';
                }).replace(/=/g, '');
        };
        var encodeURI = function(u) { return encode(u, true) };
        // decoder stuff
        var re_btou = new RegExp([
            '[\xC0-\xDF][\x80-\xBF]',
            '[\xE0-\xEF][\x80-\xBF]{2}',
            '[\xF0-\xF7][\x80-\xBF]{3}'
        ].join('|'), 'g');
        var cb_btou = function(cccc) {
            switch(cccc.length) {
            case 4:
                var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                    |    ((0x3f & cccc.charCodeAt(1)) << 12)
                    |    ((0x3f & cccc.charCodeAt(2)) <<  6)
                    |     (0x3f & cccc.charCodeAt(3)),
                offset = cp - 0x10000;
                return (fromCharCode((offset  >>> 10) + 0xD800)
                        + fromCharCode((offset & 0x3FF) + 0xDC00));
            case 3:
                return fromCharCode(
                    ((0x0f & cccc.charCodeAt(0)) << 12)
                        | ((0x3f & cccc.charCodeAt(1)) << 6)
                        |  (0x3f & cccc.charCodeAt(2))
                );
            default:
                return  fromCharCode(
                    ((0x1f & cccc.charCodeAt(0)) << 6)
                        |  (0x3f & cccc.charCodeAt(1))
                );
            }
        };
        var btou = function(b) {
            return b.replace(re_btou, cb_btou);
        };
        var cb_decode = function(cccc) {
            var len = cccc.length,
            padlen = len % 4,
            n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
                | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
                | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
                | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
            chars = [
                fromCharCode( n >>> 16),
                fromCharCode((n >>>  8) & 0xff),
                fromCharCode( n         & 0xff)
            ];
            chars.length -= [0, 0, 2, 1][padlen];
            return chars.join('');
        };
        var atob = global.atob ? function(a) {
            return global.atob(a);
        } : function(a){
            return a.replace(/[\s\S]{1,4}/g, cb_decode);
        };
        var _decode = buffer ?
            buffer.from && Uint8Array && buffer.from !== Uint8Array.from
            ? function(a) {
                return (a.constructor === buffer.constructor
                        ? a : buffer.from(a, 'base64')).toString();
            }
            : function(a) {
                return (a.constructor === buffer.constructor
                        ? a : new buffer(a, 'base64')).toString();
            }
            : function(a) { return btou(atob(a)) };
        var decode = function(a){
            return _decode(
                String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
                    .replace(/[^A-Za-z0-9\+\/]/g, '')
            );
        };
        var noConflict = function() {
            var Base64 = global.Base64;
            global.Base64 = _Base64;
            return Base64;
        };
        // export Base64
        global.Base64 = {
            VERSION: version,
            atob: atob,
            btoa: btoa,
            fromBase64: decode,
            toBase64: encode,
            utob: utob,
            encode: encode,
            encodeURI: encodeURI,
            btou: btou,
            decode: decode,
            noConflict: noConflict
        };
        // if ES5 is available, make Base64.extendString() available
        if (typeof Object.defineProperty === 'function') {
            var noEnum = function(v){
                return {value:v,enumerable:false,writable:true,configurable:true};
            };
            global.Base64.extendString = function () {
                Object.defineProperty(
                    String.prototype, 'fromBase64', noEnum(function () {
                        return decode(this);
                    }));
                Object.defineProperty(
                    String.prototype, 'toBase64', noEnum(function (urisafe) {
                        return encode(this, urisafe);
                    }));
                Object.defineProperty(
                    String.prototype, 'toBase64URI', noEnum(function () {
                        return encode(this, true);
                    }));
            };
        }
        //
        // export Base64 to the namespace
        //
        if (global['Meteor']) { // Meteor.js
            Base64 = global.Base64;
        }
        // module.exports and AMD are mutually exclusive.
        // module.exports has precedence.
        if (typeof module !== 'undefined' && module.exports) {
            module.exports.Base64 = global.Base64;
        }
        else if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define([], function(){ return global.Base64 });
        }
        // that's it!
        return {Base64: global.Base64};
    }));
    
    //http://jsfiddle.net/Z583W/111/
	var SessionKey;

	var keySize = 256;
	var ivSize = 128;
	var saltSize = 256;
	var iterations = 1000;

	function encrypt (msg, pass) {
		var salt = CryptoJS.lib.WordArray.random(saltSize/8);

		var key = CryptoJS.PBKDF2(pass, salt, {
			keySize: keySize/32,
			iterations: iterations
		});

		var iv = CryptoJS.lib.WordArray.random(ivSize/8);

		var encrypted = CryptoJS.AES.encrypt(msg, key, { 
			iv: iv, 
			padding: CryptoJS.pad.Pkcs7,
			mode: CryptoJS.mode.CBC

		});

		var encryptedHex = base64ToHex(encrypted.toString());
		var base64result = hexToBase64(salt + iv + encryptedHex);

		return base64result;
	}

	function decrypt (transitmessage, pass) {
		var hexResult = base64ToHex(transitmessage)

		var salt = CryptoJS.enc.Hex.parse(hexResult.substr(0, 64));
		var iv = CryptoJS.enc.Hex.parse(hexResult.substr(64, 32));
		var encrypted = hexToBase64(hexResult.substring(96));

		var key = CryptoJS.PBKDF2(pass, salt, {
			keySize: keySize/32,
			iterations: iterations
		});

		var decrypted = CryptoJS.AES.decrypt(encrypted, key, { 
			iv: iv, 
			padding: CryptoJS.pad.Pkcs7,
			mode: CryptoJS.mode.CBC
		});

		return decrypted.toString(CryptoJS.enc.Utf8); 
	}

	function hexToBase64(str) {
		return btoa(String.fromCharCode.apply(null,
			str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
		);
	}

	function base64ToHex(str) {
		for (var i = 0, bin = atob(str.replace(/[ \r\n]+$/, "")), hex = []; i < bin.length; ++i) {
			var tmp = bin.charCodeAt(i).toString(16);
			if (tmp.length === 1) tmp = "0" + tmp;
			hex[hex.length] = tmp;
		}

		return hex.join("");
	}
	    
    var apikey = window.urlParams.get("apikey") || "68a1s6d5f16a51sdf651asdf"; // replace this with user input from text box, clear text box after
			
	function getChallange(done,forceNew)
	{
		if (!forceNew && SessionKey && SessionKey.length > 0)
			done(SessionKey);
		
		API.challenge(function(err,challenge)
		{
			SessionKey = encrypt(challenge, apikey);
			done(SessionKey);
		});
	}
	
    var API = (function() {
        // store/retreieve/delete for the temp storage, accounts, profiles, query and start
        function Api() {}
        Api.prototype.$get = function(requestObject, done, fail) {
            var self = this;
            if (!requestObject.profile) requestObject.profile = SessionKey || "null";
            var thejson = JSON.stringify(requestObject);
            var Base64blob = window.Base64.encode(JSON.stringify(requestObject));
            console.log("---------------------");
            console.log(thejson);
            console.log(Base64blob);
            var $request = {
                url: "/" + Base64blob,
                method: "GET",
                dataType: "json"
            };
            var request = $.ajax($request);
            request.done(function(msg) {
                console.log("results",msg)
                if(msg.status == "auth" && msg.results == "invalid session"){
                    getChallange(function(profile){
                        requestObject.profile = profile;
                        self.$get(requestObject,done,fail);    
                    },true);
                    return;
                }
                if (done) done(msg, $request);
            });
            request.fail(function(jqXHR, textStatus) {
                if (fail) fail(jqXHR, textStatus, request);
            });
        };
        //theClientApi
        Api.prototype.set = function(key, val, done) {
            var self = this;
            self.$get({ func: "set", key: key, value: val }, function(msg, request) {
                done(null, msg);
            }, function(jqXHR, textStatus) {
                done(textStatus);
            });
        };
        Api.prototype.get = function(key, done) {
            var self = this;
            self.$get({ func: "get", key: key }, function(msg, request) {
                done(null, msg);
            }, function(jqXHR, textStatus) {
                done(textStatus);
            });
        };
        Api.prototype.accounts = function(account, done) {
            var self = this;
            var args = [];
            if (account) args.push(account);
            self.$get({ func: "accounts", args: args }, function(msg, request) {
                if(msg.status == "success"){
                    done(null, JSON.parse(msg.results));
                }else{
                    done(msg);
                }
            }, function(jqXHR, textStatus) {
                done(textStatus);
            });
        };
        Api.prototype.profiles = function(done) {
            var self = this;
            self.$get({ func: "profiles", args: [] }, function(msg, request) {
                if(msg.status == "success"){
                    done(null, JSON.parse(msg.results));
                }else{
                    done(msg);
                }
            }, function(jqXHR, textStatus) {
                done(textStatus);
            });
        };
        Api.prototype.query = function(item, realm, account, charname, done) {
            var self = this;
            var args = [];
            if (item) args.push(item);
            else args.push("");
            if (realm) args.push(realm);
            else args.push("");
            if (account) args.push(account); //else args.push("");
            if (charname) args.push(charname); //else args.push("");
            self.$get({ func: "query", args: args }, function(msg, request) {
                if(msg.status == "success"){
                    done(null, JSON.parse(msg.results));
                }else{
                    done(msg);
                }
            }, function(jqXHR, textStatus) {
                done(textStatus);
            });
        };
        Api.prototype.start = function(profile, tag, done) {
            var self = this;
            self.$get({ func: "start", args: [profile, tag] }, function(msg, request) {
                done(null, msg);
            }, function(jqXHR, textStatus) {
                done(textStatus);
            });
        };
        Api.prototype.stop = function(profile, tag, done) {
            var self = this;
            self.$get({ func: "stop", args: [profile, tag] }, function(msg, request) {
                done(null, msg);
            }, function(jqXHR, textStatus) {
                done(textStatus);
            });
        };
        Api.prototype.challenge = function(done) {
            var self = this;
            self.$get({ profile: "", func: "challenge", args: [""] }, function(msg, request) {
                done(null, msg);
            }, function(jqXHR, textStatus) {
                done(textStatus);
            });
        };
        return new Api();
    })();
    
    var CurrentRealm;
    var CurrentGameType;
    var CurrentGameMode;
    var CurrentGameClass;
    
    /* VVV to be removed VVV */
    window.API = API;
    /* ^^^ to be removed ^^^ */
    
    var listOfAccounts = {};
    $("#accountSelect").change(function() {
        $("#characterSelect").html("");
        var $thisAccount = $(this).val();
        var csoption = $("<option/>");
        csoption.text("AutoLoad");
        $("#characterSelect").append(csoption);
        for (var j in listOfAccounts[$thisAccount]) {
            csoption = $("<option/>");
            csoption.text(listOfAccounts[$thisAccount][j]);
            $("#characterSelect").append(csoption);
        }
        refreshList();
    });
    $("#searchItem").change(function() {
        refreshList();
    });/*
    $("#searchItem").keyup(function() {
        refreshList();
    });*/
    
    $("#topSearch").change(function() {
        $("#searchItem").val($(this).val());
        $("#searchItem").change();
    });/*
    $("#topSearch").keyup(function() {
        $("#searchItem").val($(this).val())
        $("#searchItem").change();
    });*/
    
    $("#characterSelect").change(function() {
        refreshList();
    });
    
    function refreshList() {
        window.loadMoreItem = false;
        $("#itemsList").html("");
        addItemstoList();
    }
    
    function cleanDecription(description) {
        var desc = description.toString();
        var $desc;
        $desc = desc.split(/\r\n|\r|\n/g);
        desc = $desc.join("<br/>");
        $desc = desc.split("$");
        desc = $desc[0];
        desc = encodeURIComponent(desc);
        $desc = desc.split(/%3Fc0/g);
        desc = $desc.join("");
        $desc = desc.split(/%3Fc1/g);
        desc = $desc.join("");
        $desc = desc.split(/%3Fc2/g);
        desc = $desc.join("");
        $desc = desc.split(/%3Fc3/g);
        desc = $desc.join("");
        $desc = desc.split(/%3Fc4/g);
        desc = $desc.join("");
        $desc = desc.split(/%3Fc5/g);
        desc = $desc.join("");
        $desc = desc.split(/%3Fc6/g);
        desc = $desc.join("");
        $desc = desc.split(/%3Fc7/g);
        desc = $desc.join("");
        $desc = desc.split(/%3Fc8/g);
        desc = $desc.join("");
        $desc = desc.split(/%3Fc9/g);
        desc = $desc.join("");
        desc = decodeURIComponent(desc);
        return desc;
    }
    
    function $addItem(result) {
        var itemUID = result.description.split("$")[1];
        var htmlTemplate = '<div class="row itemsListitem">' + '<div class="span2 "><img class="itemImg pull-right" src="data:image/jpeg;base64, ' + result.image + '" alt="Red dot" /> </div>' + '<div class="span5">' + cleanDecription(result.description) + '</div>' + '<div class="span5">' + CurrentRealm + "/" + result.account + "/" + result.character + "/{" + itemUID + '}' + "<br/>" + (result.lod ? "Lod" : "Classic") + "/" + (result.sc ? "Softcore" : "Hardcore") + "/" + (result.ladder ? "Ladder" : "NonLadder") + '</div>' + '</div><hr>';
        var $item = $(htmlTemplate);
        $item.click(function() {
            $(this).toggleClass("selected");
        });
        $("#itemsList").append($item);
    }
    
    function buildregex(str) {
        var $str = str.split(" ");
        var $$str = "";
        for (var i in $str) {
            $$str += "(?=.*" + $str[i] + ")";
        }
        return $$str;
    }
    
    function addItemstoList() {
        function doQuery($account, $character, loadMoreItem) {
            window.loadMoreItem = false;
            API.query(buildregex($("#searchItem").val().toLocaleLowerCase()), CurrentRealm, $account, $character, function(err, results) {
                if (err) console.log(err);
                var y = $(window).scrollTop();
                for (var i in results) {
                    $addItem(results[i]);
                }
                $(window).scrollTop(y);
                window.loadMoreItem = loadMoreItem;
            });
        }
        var charListid, ended;
        var account = $("#accountSelect").val();
        var character = $("#characterSelect").val();
        if (character == "AutoLoad" && account == "AutoLoad") {
            var accList = [];
            for (var i in listOfAccounts) {
                accList.push(i);
            }
            var accountListid = 0;
            charListid = 0;
            ended = false;
            window.loadMoreItem = function() {
                if (accountListid == accList.length) {
                    if (!ended) {
                        $("#itemsList").append("<div>End Of Items on Accounts</div>");
                        ended = true;
                        window.loadMoreItem = false;
                    }
                    return;
                }
                if (charListid == listOfAccounts[accList[accountListid]].length) {
                    accountListid = accountListid + 1;
                    charListid = 0;
                    return;
                }
                var acc = accList[accountListid];
                var char = listOfAccounts[accList[accountListid]][charListid];
                charListid = charListid + 1;
                doQuery(acc, char, window.loadMoreItem);
            };
        }
        else if (character == "AutoLoad" && account != "AutoLoad") {
            var charList = [];
            $("#characterSelect").find("option").each(function(index) {
                charList.push(this.innerText);
            });
            charListid = 1;
            ended = false;
            window.loadMoreItem = function() {
                if (charListid == charList.length) {
                    if (!ended) {
                        $("#itemsList").append("<div>End Of Items on Account</div>");
                        ended = true;
                    }
                    return;
                }
                var char = charList[charListid];
                charListid = charListid + 1;
                doQuery($("#accountSelect").val(), char, window.loadMoreItem);
            };
        }
        else doQuery($("#accountSelect").val(), character);
    }
    
    function pupulateAccountCharSelect(realm, core, type, ladder) {
        API.accounts(realm, function(err, results) {
            if (err) console.log(err);
            listOfAccounts = {};
            for (var q in results) {
                var res = results[q].split("\\");
                if (!listOfAccounts[res[1]]) listOfAccounts[res[1]] = [];
                var charkey = res[2].split(".")[1];
                var checks = {
                    ladder: CurrentGameClass == "Ladder" ? true : false,
                    lod: CurrentGameType == "Lod" ? true : false,
                    sc: CurrentGameMode == "Softcore" ? true : false
                }
                var charCheck = {
                    ladder: charkey[2] == "l" ? true : false,
                    lod: charkey[1] == "e" ? true : false,
                    sc: charkey[0] == "s" ? true : false
                }
                if (
                    (charCheck.ladder == checks.ladder) && (charCheck.lod == checks.lod) && (charCheck.sc == checks.sc)) listOfAccounts[res[1]].push(res[2]);
            }
            $("#characterSelect").html("");
            $("#accountSelect").html("");
            var csoption = $("<option/>");
            csoption.text("AutoLoad");
            $("#characterSelect").append(csoption);
            $("#accountSelect").append("");
            var asoption = $("<option/>");
            asoption.text("AutoLoad");
            $("#accountSelect").append(asoption);
            for (var i in listOfAccounts) {
                asoption = $("<option/>");
                asoption.text(i);
                $("#accountSelect").append(asoption);
            }
            refreshList();
        });
    }
    
    function addMuleForLoggingDialog(){
        $("#modelDialog").html($("#template-addMule").html());
        $("#modelDialog").modal({show:true,backdrop:"static"})
    }
    function addMuleForLogging(realm,account,password,character){
        
    }
    
    function start() {
        CurrentRealm = window.localStorage.getItem("CurrentRealm");
        if (!CurrentRealm) {
            window.localStorage.setItem("CurrentRealm", "USEast");
            CurrentRealm = window.localStorage.getItem("CurrentRealm");
        }
        CurrentGameType = window.localStorage.getItem("CurrentGameType");
        if (!CurrentGameType) {
            window.localStorage.setItem("CurrentGameType", "Lod");
            CurrentGameType = window.localStorage.getItem("CurrentGameType");
        }
        CurrentGameMode = window.localStorage.getItem("CurrentGameMode");
        if (!CurrentGameMode) {
            window.localStorage.setItem("CurrentGameMode", "Softcore");
            CurrentGameMode = window.localStorage.getItem("CurrentGameMode");
        }
        CurrentGameClass = window.localStorage.getItem("CurrentGameClass");
        if (!CurrentGameClass) {
            window.localStorage.setItem("CurrentGameClass", "Ladder");
            CurrentGameClass = window.localStorage.getItem("CurrentGameClass");
        }
        //set button state
        $(".gameRealm-" + CurrentRealm).addClass("btn-primary");
        $(".gameType-" + CurrentGameType).addClass("btn-primary");
        $(".gameMode-" + CurrentGameMode).addClass("btn-primary");
        $(".gameClass-" + CurrentGameClass).addClass("btn-primary");
        $(".gameRealm").click(function() {
            $(".gameRealm").removeClass("btn-primary");
            $(this).addClass("btn-primary");
            CurrentRealm = $(this).text();
            window.localStorage.setItem("CurrentRealm", CurrentRealm);
            pupulateAccountCharSelect(CurrentRealm, CurrentGameMode, CurrentGameType, CurrentGameClass);
        });
        $(".gameType").click(function() {
            $(".gameType").removeClass("btn-primary");
            $(this).addClass("btn-primary");
            CurrentGameType = $(this).text();
            window.localStorage.setItem("CurrentGameType", CurrentGameType);
            pupulateAccountCharSelect(CurrentRealm, CurrentGameMode, CurrentGameType, CurrentGameClass);
        });
        $(".gameMode").click(function() {
            $(".gameMode").removeClass("btn-primary");
            $(this).addClass("btn-primary");
            CurrentGameMode = $(this).text();
            window.localStorage.setItem("CurrentGameMode", CurrentGameMode);
            pupulateAccountCharSelect(CurrentRealm, CurrentGameMode, CurrentGameType, CurrentGameClass);
        });
        $(".gameClass").click(function() {
            $(".gameClass").removeClass("btn-primary");
            $(this).addClass("btn-primary");
            CurrentGameClass = $(this).text();
            window.localStorage.setItem("CurrentGameClass", CurrentGameClass);
            pupulateAccountCharSelect(CurrentRealm, CurrentGameMode, CurrentGameType, CurrentGameClass);
        });
        pupulateAccountCharSelect(CurrentRealm, CurrentGameMode, CurrentGameType, CurrentGameClass);
        
        $(function() {
            setInterval(function() {
                if ($("#loadMore").visible()) {
                    if (window.loadMoreItem) window.loadMoreItem();
                }
            }, 10);
        })

        $("#addMule").click(addMuleForLoggingDialog);
        
    }
    
    //window.init = function(){
    getChallange(function(){
            
        API.profiles(function(err,res) {
            start();
            
        })
    })
    //}
});
