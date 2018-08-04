/**
*	@filename	MuleLogger.js
*	@author		kolton
*	@desc		Log items on configurable accounts/characters
*/

var limeDropper = {
	//General
	IngameTime: 60, // Time to wait after leaving game
	
	
	
	
	
	
	
	
	//Logging
	LogNames: true, // REQUIRED!
	LogItemLevel: true, // Add item level to the picture
	LogEquipped: false, // include equipped items
	LogMerc: false, // include items merc has equipped (if alive)
	SaveScreenShot: false, // Save pictures in jpg format (saved in 'Images' folder)
	
	
	
	
	// don't edit
	starterInit:function(){
		limeDropper.loadTag();
	},
	loadTag:function(){//updateTag
		limeDropper.profileTag = false;
		if(!limeDropper.ReceiveCopyDataLoaded){
			addEventListener('copydata', limeDropper.ReceiveCopyData);
			limeDropper.ReceiveCopyDataLoaded=true;
		}
		while(!limeDropper.profileTag){
			D2Bot.getProfile();
			delay(500);
		}
		print("Got profileTag");
	},
	ReceiveCopyDataLoaded:false,
	ReceiveCopyData: function(mode, msg) {
		// getProfile 
		if(mode == 1638){
			limeDropper.profileTag = JSON.parse(JSON.parse(msg).Tag);
		}
	},
	
	setTag: function(status, code){
		limeDropper.profileTag.status = status;
		limeDropper.profileTag.code = status;
		D2Bot.setTag(JSON.stringify(limeDropper.profileTag));
	},
	
	initGame: function(){
		switch(limeDropper.profileTag.action){
			case "doMule":
				return true;//joinGame
				break;
			case "doDrop":
				return false;//createGame
				break;
			default:
				if(limeDropper.profileTag.gameName)
					return true;//joinGame
				else{
					return true;//createGame  -- default
				}	
				break;
		}
		return true;
	},
	createGame: function(){
		createGame(limeDropper.randomString(8), limeDropper.randomString(3), 0);
	},
	joinGame: function(){
		joinGame(limeDropper.profileTag.muleInfo.gameName, limeDropper.profileTag.muleInfo.gamePass);
	},
	login: function() {
		var password;
		
		if(limeDropper.profileTag && limeDropper.profileTag.muleInfo)
			password = limeDropper.profileTag.muleInfo.password || limeDropper.getMulePass(md5(	limeDropper.profileTag.muleInfo.realm +
														limeDropper.profileTag.muleInfo.account) )
		
		if(!password){
			limeDropper.setTag("ERROR","NOPASSWORD")
			while(true){
				delay(500);
			}
		}
	
		ControlAction.loginAccount({
			account: limeDropper.profileTag.muleInfo.account, 
			password:	password,
			realm: limeDropper.profileTag.muleInfo.realm});
	},
	charList: function(){
		if(limeDropper.profileTag.muleInfo.password)
			limeDropper.saveMulePass(md5(limeDropper.profileTag.muleInfo.realm+limeDropper.profileTag.muleInfo.account),limeDropper.profileTag.muleInfo.password)
			
		return limeDropper.profileTag.muleInfo.chars;
	},
	randomString: function (len) {
		var i,
			rval = "",
			letters = "abcdefghijklmnopqrstuvwxyz";
	
	    for (i = 0; i < len; i += 1) {
			rval += letters[Math.floor(Math.random() * 26)];
		}
	
		return rval;
	},
	
	getItemDesc: function (unit, logIlvl) {
		var i, desc,
			stringColor = "";

		if (logIlvl === undefined) {
			logIlvl = this.LogItemLevel;
		}

		desc = unit.description.split("\n");

		// Lines are normally in reverse. Add color tags if needed and reverse order.
		for (i = 0; i < desc.length; i += 1) {
			if (desc[i].indexOf(getLocaleString(3331)) > -1) { // Remove sell value
				desc.splice(i, 1);

				i -= 1;
			} else {
				if (desc[i].match(/^(y|�)c/)) {
					stringColor = desc[i].substring(0, 3);
				} else {
					desc[i] = stringColor + desc[i];
				}
			}

			desc[i] = desc[i].replace(/(y|�)c([0-9!"+<;.*])/g, "\\xffc$2").replace("\xFF", "\\xff", "g");
		}

		if (logIlvl && desc[desc.length - 1]) {
			desc[desc.length - 1] = desc[desc.length - 1].trim() + " (" + unit.ilvl + ")";
		}

		desc = desc.reverse().join("\\n");

		return desc;
	},

	inGameCheck: function () {
		if (getScript("D2BotlimeDropper.dbj")) {
			limeDropper.loadTag();
			switch(limeDropper.profileTag.action){
				case "doMule":
					this.logChar();
					break;
				case "doDrop":
					this.dropItems(limeDropper.profileTag.muleInfo.items);
					break;
				default:
					break;
			}
			
			limeDropper.setTag("DONE-INGAME");
			while ((getTickCount() - me.gamestarttime) < this.IngameTime * 1000) {
				delay(1000);
			}
			
			limeDropper.logChar()
			delay(2000);
			quit();
			//delay(10000);

			return true;
		}

		return false;
	},
	
	getMulePass:function(accountHash){
		var passwordFolder = "mule-passwords"
		var filename = "data/" + passwordFolder + "/" + "secure-"+accountHash+".txt";
		if (FileTools.exists(filename)) {
			return FileTools.readText(filename);
		}else{
			throw "Password File Not Exist:"+filename;
		}
	},
	saveMulePass:function(accountHash,pass){
		var folder;
		var passwordFolder = "mule-passwords";
		if (!FileTools.exists("data/" + passwordFolder)) {
			folder = dopen("data");
			folder.create(passwordFolder);
		}
		FileTools.writeText("data/" + passwordFolder + "/" + "secure-"+accountHash+".txt", pass);
	},
	
	dropItems: function ($items) {
		
		function itemSort(a, b) {
			return b.itemType - a.itemType;
		}

		if($items){
			
			while (!me.gameReady) {
				delay(100);
			}
	
			var i, items = me.getItems();
			
			if (!items || !items.length) {
				return;
			}
	
			items.sort(itemSort);
			
			for (var i = 0; i < $items.length; i += 1) {
				var itemKey = $items[i].split(":");//":" + unit.classid + ":" + unit.location + ":" + unit.x + ":" + unit.y;
				
				var classid = itemKey[1];
				var location = itemKey[2];
				var unitX = itemKey[3];
				var unitY = itemKey[4];
				
				for (var j = 0; j < items.length; j += 1) {
					var unit = items[j];
					
					if(unit.classid.toString() == classid &&  unit.location.toString() == location &&  unit.x.toString() == unitX && unit.y.toString() == unitY)
						unit.drop();
					
				}
			}
		}
		limeDropper.logChar()
	},
	// Log kept item stats in the manager.
	logItem: function (unit, logIlvl) {
		if (!isIncluded("common/misc.js")) {
			include("common/misc.js");
		}

		if (logIlvl === undefined) {
			logIlvl = this.LogItemLevel;
		}

		var i, code, desc, sock,
			header = "",
			color = -1,
			name = unit.itemType + "_" + unit.fname.split("\n").reverse().join(" ").replace(/(y|�)c[0-9!"+<;.*]|\/|\\/, "").trim();

		desc = this.getItemDesc(unit, logIlvl) + "$" + unit.gid + ":" + unit.classid + ":" + unit.location + ":" + unit.x + ":" + unit.y;
		color = unit.getColor();

		switch (unit.quality) {
		case 5: // Set
			switch (unit.classid) {
			case 27: // Angelic sabre
				code = "inv9sbu";

				break;
			case 74: // Arctic short war bow
				code = "invswbu";

				break;
			case 308: // Berserker's helm
				code = "invhlmu";

				break;
			case 330: // Civerb's large shield
				code = "invlrgu";

				break;
			case 31: // Cleglaw's long sword
			case 227: // Szabi's cryptic sword
				code = "invlsdu";

				break;
			case 329: // Cleglaw's small shield
				code = "invsmlu";

				break;
			case 328: // Hsaru's buckler
				code = "invbucu";

				break;
			case 306: // Infernal cap / Sander's cap
				code = "invcapu";

				break;
			case 30: // Isenhart's broad sword
				code = "invbsdu";

				break;
			case 309: // Isenhart's full helm
				code = "invfhlu";

				break;
			case 333: // Isenhart's gothic shield
				code = "invgtsu";

				break;
			case 326: // Milabrega's ancient armor
			case 442: // Immortal King's sacred armor
				code = "invaaru";

				break;
			case 331: // Milabrega's kite shield
				code = "invkitu";

				break;
			case 332: // Sigon's tower shield
				code = "invtowu";

				break;
			case 325: // Tancred's full plate mail
				code = "invfulu";

				break;
			case 3: // Tancred's military pick
				code = "invmpiu";

				break;
			case 113: // Aldur's jagged star
				code = "invmstu";

				break;
			case 234: // Bul-Kathos' colossus blade
				code = "invgsdu";

				break;
			case 372: // Grizwold's ornate plate
				code = "invxaru";

				break;
			case 366: // Heaven's cuirass
			case 215: // Heaven's reinforced mace
			case 449: // Heaven's ward
			case 426: // Heaven's spired helm
				code = "inv" + unit.code + "s";

				break;
			case 357: // Hwanin's grand crown
				code = "invxrnu";

				break;
			case 195: // Nalya's scissors suwayyah
				code = "invskru";

				break;
			case 395: // Nalya's grim helm
			case 465: // Trang-Oul's bone visage
				code = "invbhmu";

				break;
			case 261: // Naj's elder staff
				code = "invcstu";

				break;
			case 375: // Orphan's round shield
				code = "invxmlu";

				break;
			case 12: // Sander's bone wand
				code = "invbwnu";

				break;
			}

			break;
		case 7: // Unique
			for (i = 0; i < 401; i += 1) {
				if (unit.fname.split("\n").reverse()[0].indexOf(getLocaleString(getBaseStat(17, i, 2))) > -1) {
					code = getBaseStat(17, i, "invfile");

					break;
				}
			}

			break;
		}

		if (!code) {
			if (["ci2", "ci3"].indexOf(unit.code) > -1) { // Tiara/Diadem
				code = unit.code;
			} else {
				code = getBaseStat(0, unit.classid, 'normcode') || unit.code;
			}

			code = code.replace(" ", "");

			if ([10, 12, 58, 82, 83, 84].indexOf(unit.itemType) > -1) {
				code += (unit.gfx + 1);
			}
		}

		sock = unit.getItems();

		if (sock) {
			for (i = 0; i < sock.length; i += 1) {
				if (sock[i].itemType === 58) {
					desc += "\n\n";
					desc += this.getItemDesc(sock[i]);
				}
			}
		}

		return {
			itemColor: color,
			image: code,
			title: name,
			description: desc,
			header: header,
			sockets: Misc.getItemSockets(unit)
		};
	},

	logChar: function (logIlvl, logName, saveImg) {
		while (!me.gameReady) {
			delay(100);
		}

		if (logIlvl === undefined) {
			logIlvl = this.LogItemLevel;
		}

		if (logName === undefined) {
			logName = this.LogNames;
		}

		if (saveImg === undefined) {
			saveImg = this.SaveScreenShot;
		}

		var i, folder, string, parsedItem,
			items = me.getItems(),
			realm = me.realm || "Single Player",
			merc,
			finalString = "";

		if (!FileTools.exists("mules/" + realm)) {
			folder = dopen("mules");

			folder.create(realm);
		}

		if (!FileTools.exists("mules/" + realm + "/" + me.account)) {
			folder = dopen("mules/" + realm);

			folder.create(me.account);
		}

		if (!items || !items.length) {
			return;
		}

		function itemSort(a, b) {
			return b.itemType - a.itemType;
		}

		items.sort(itemSort);

		for (i = 0; i < items.length; i += 1) {
			if (this.LogEquipped || (!this.LogEquipped && items[i].mode === 0)) {
				parsedItem = this.logItem(items[i], logIlvl);

				// Log names to saved image
				if (logName) {
					parsedItem.header = (me.account || "Single Player") + " / " + me.name;
				}

				if (saveImg) {
					D2Bot.saveItem(parsedItem);
				}

				// Always put name on Char Viewer items
				if (!parsedItem.header) {
					parsedItem.header = (me.account || "Single Player") + " / " + me.name;
				}

				// Remove itemtype_ prefix from the name
				parsedItem.title = parsedItem.title.substr(parsedItem.title.indexOf("_") + 1);

				if (items[i].mode === 1) {
					parsedItem.title += " (equipped)";
				}

				string = JSON.stringify(parsedItem);
				finalString += (string + "\n");
			}
		}

		if (this.LogMerc) {
			for (i = 0; i < 3; i += 1) {
				merc = me.getMerc();

				if (merc) {
					break;
				}

				delay(50);
			}

			if (merc) {
				items = merc.getItems();

				for (i = 0; i < items.length; i += 1) {
					parsedItem = this.logItem(items[i]);
					parsedItem.title += " (merc)";
					string = JSON.stringify(parsedItem);
					finalString += (string + "\n");

					if (this.SaveScreenShot) {
						D2Bot.saveItem(parsedItem);
					}
				}
			}
		}
		// hcl = hardcore class ladder
		// sen = softcore expan nonladder
		FileTools.writeText("mules/" + realm + "/" + me.account + "/" + me.name + "." + ( me.playertype ? "h" : "s" ) + (me.gametype ? "e" : "c" ) + ( me.ladder > 0 ? "l" : "n" ) + ".txt", finalString);
		print("Logged Items");
	}
};
