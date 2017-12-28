var MAX_STARTUP = 10 * ONE_SEC;  // 15 sec 
var MAX_DECIMALS = 6;
var IMS = "If-Modified-Since";
var OLD = "Thu, 01 Jun 1970 00:00:00 GMT";

var zec_show = false;
var etc_show = false;
var btg_show = false;
var btz_show = true;
var zen_show = false;

var eth_show = true;
var ethermine_show = false;
var nanopool_show = true;
var zec_addr = "t1aPosjaW4e2UHrnj5mXsHureUBnX1jLyuQ";
var eth_addr = "e2d07294df04dae81aaef23a7194a3bd511a40bd";
var etc_addr = "0x7310270fb1b0f5fb4303cdbd6ca05ff9c35997cf";

// update intervals
var ONE_SEC = 1000;  // 1 sec
var TEN_SEC = 10 * ONE_SEC;  // 1 min
var ONE_MIN = 60 * ONE_SEC;  // 1 min
var DEFAULT_MINE_UPDATE_INTERVAL = 10 * ONE_MIN;  // 10 min
var DEFAULT_EXCHANGE_UPDATE_INTERVAL = 10 * ONE_MIN;  // 10 min
var MIN_MINE_UPDATE_INTERVAL = ONE_MIN;  // 1 min
var MIN_EXCHANGE_UPDATE_INTERVAL = 3 * ONE_SEC;  // 3 sec
var mineUpdateInterval = DEFAULT_MINE_UPDATE_INTERVAL;
var exchangeUpdateInterval = DEFAULT_EXCHANGE_UPDATE_INTERVAL;

var exchTimeoutRef = 0;
var eth_curr_hash = 0;
document.onreadystatechange = function() {
    if (document.readyState == "complete") {

        System.Gadget.settingsUI = "Settings.html";
        System.Gadget.onSettingsClosed = load;

        if (System.Gadget.Settings.readString("init") == "") {
            // init is not set only on first run; so, set defaults
            System.Gadget.Settings.writeString("init", "init");
            System.Gadget.Settings.write("zec_show", zec_show);
            System.Gadget.Settings.write("eth_show", eth_show);
            System.Gadget.Settings.write("etc_show", etc_show);
            System.Gadget.Settings.write("btg_show", btg_show);
            System.Gadget.Settings.write("btz_show", btz_show);
            System.Gadget.Settings.write("zen_show", zen_show);

            System.Gadget.Settings.write('ethermine_show', ethermine_show);
            System.Gadget.Settings.write('nanopool_show', nanopool_show);

            System.Gadget.Settings.writeString("zec_addr", zec_addr);
            System.Gadget.Settings.writeString("eth_addr", eth_addr);
            System.Gadget.Settings.writeString("etc_addr", etc_addr);
        }

        setInterval("load()", 60000);
    }
};

function load() {
    updateExchangeData();
}

function updateExchangeData() {

    zec_show = System.Gadget.Settings.read("zec_show");
    eth_show = System.Gadget.Settings.read("eth_show");
    etc_show = System.Gadget.Settings.read("etc_show");
    btg_show = System.Gadget.Settings.read("btg_show");
    btz_show = System.Gadget.Settings.read("btz_show");
    zen_show = System.Gadget.Settings.read("zen_show");

    ethermine_show = System.Gadget.Settings.read("ethermine_show");
    nanopool_show = System.Gadget.Settings.read("nanopool_show");

    i = 0;
    document.getElementById('ZecDIV').style.display = "none";
    document.getElementById('EthDIV').style.display = "none";
    document.getElementById('EtcDIV').style.display = "none";
    document.getElementById('EthNanoDIV').style.display = "none";
    document.getElementById('BtgDIV').style.display = "none";
    document.getElementById('BtzDIV').style.display = "none";
    document.getElementById('ZenDIV').style.display = "none";

    if (zec_show) {
        i = i + 1;
        document.getElementById('ZecDIV').style.display =  "block";
    }

    if (eth_show) {
        if (ethermine_show) {
            i = i + 1;
            document.getElementById('EthDIV').style.display =  "block";
        }
        if (nanopool_show) {
            i = i + 1;
            document.getElementById('EthNanoDIV').style.display =  "block";
        }
    }
    if (etc_show) {
        i = i + 1;
        document.getElementById('EtcDIV').style.display =  "block";
    }
    if (btg_show) {
        document.getElementById('BtgDIV').style.display =  "block";
    }
    if (btz_show) {
        i = i + 1;
        document.getElementById('BtzDIV').style.display =  "block";
    }
    if (zen_show) {
        document.getElementById('ZenDIV').style.display =  "block";
    }

    if (i === 0) {
        document.body.style.height = "175px";
    }
    else if (i === 1) {
        document.body.style.height = "300px";
    }
    else {
        document.body.style.height = "380px";
    }

    if (System.Gadget.Settings.readString("zec_addr")) {
        zec_addr = System.Gadget.Settings.readString("zec_addr");
    }
    if (System.Gadget.Settings.readString("eth_addr")) {
        eth_addr = System.Gadget.Settings.readString("eth_addr");
    }
    if (System.Gadget.Settings.readString("etc_addr")) {
        etc_addr = System.Gadget.Settings.readString("etc_addr");
    }

    try {

        xmlhttpBtc = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpBtc.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD", true);
        xmlhttpBtc.setRequestHeader(IMS, OLD);
        xmlhttpBtc.send();
        xmlhttpBtc.onReadyStateChange = function() {                 
            if (xmlhttpBtc.readyState == 4 && xmlhttpBtc.status == 200) {
                document.getElementById('btc').innerText = parse(xmlhttpBtc, "USD", 0).toFixed(0) + "$";
            }
        };

        xmlhttpBch = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpBch.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=BCH&tsyms=USD,BTC", true);
        xmlhttpBch.setRequestHeader(IMS, OLD);
        xmlhttpBch.send();
        xmlhttpBch.onReadyStateChange = function() {                 
            if (xmlhttpBch.readyState == 4 && xmlhttpBch.status == 200) {
                document.getElementById('bch').innerText = parse(xmlhttpBch, "USD", 0).toFixed(0) + "$";
                document.getElementById('bch_btc').innerText = parse(xmlhttpBch, "BTC", 0).toFixed(3);
            }
        };

        xmlhttpBtg = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpBtg.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=BTG&tsyms=USD,BTC", true);
        xmlhttpBtg.setRequestHeader(IMS, OLD);
        xmlhttpBtg.send();
        xmlhttpBtg.onReadyStateChange = function() {                 
            if (xmlhttpBtg.readyState == 4 && xmlhttpBtg.status == 200) {
                document.getElementById('btg').innerText = parse(xmlhttpBtg, "USD", 0).toFixed(0) + "$";
                document.getElementById('btg_btc').innerText = parse(xmlhttpBtg, "BTC", 0).toFixed(3);
            }
        };

        xmlhttpEth = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpEth.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,BTC,ZEC", true);
        xmlhttpEth.setRequestHeader(IMS, OLD);
        xmlhttpEth.send();
        xmlhttpEth.onReadyStateChange = function() {                 
            if (xmlhttpEth.readyState == 4 && xmlhttpEth.status == 200) {
                document.getElementById('eth').innerText = parse(xmlhttpEth, "USD", 0).toFixed(0) + "$";
                document.getElementById('eth_btc').innerText = parse(xmlhttpEth, "BTC", 0).toFixed(3);
            }
        };

        xmlhttpEtc = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpEtc.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ETC&tsyms=USD,BTC", true);
        xmlhttpEtc.setRequestHeader(IMS, OLD);
        xmlhttpEtc.send();
        xmlhttpEtc.onReadyStateChange = function() {                 
            if (xmlhttpEtc.readyState == 4 && xmlhttpEtc.status == 200) {
                document.getElementById('etc').innerText = parse(xmlhttpEtc, "USD", 0).toFixed(0) + "$";
                document.getElementById('etc_btc').innerText = parse(xmlhttpEtc, "BTC", 0).toFixed(3);
            }
        };

        xmlhttpZec = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpZec.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ZEC&tsyms=USD,BTC,ETH", true);
        xmlhttpZec.setRequestHeader(IMS, OLD);
        xmlhttpZec.send();
        xmlhttpZec.onReadyStateChange = function() {                 
            if (xmlhttpZec.readyState == 4 && xmlhttpZec.status == 200) {
                document.getElementById('zec').innerText = parse(xmlhttpZec, "USD", 0).toFixed(0) + "$";
                document.getElementById('zec_btc').innerText = parse(xmlhttpZec, "BTC", 0).toFixed(3);
            }
        };
        xmlhttpZen = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpZen.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ZEN&tsyms=USD,BTC,ETH", true);
        xmlhttpZen.setRequestHeader(IMS, OLD);
        xmlhttpZen.send();
        xmlhttpZen.onReadyStateChange = function() {                 
            if (xmlhttpZen.readyState == 4 && xmlhttpZen.status == 200) {
                document.getElementById('zen').innerText = parse(xmlhttpZen, "USD", 0).toFixed(0) + "$";
                document.getElementById('zen_btc').innerText = parse(xmlhttpZen, "BTC", 0).toFixed(3);
            }
        };
        xmlHttpBTCZ = new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttpBTCZ.open("GET", "http://pool.bitcoinzguiding.ovh/api/worker_stats?t1TtaSf9NiLepNLRw5heMCuvLfueuBpG6zH", true);
        xmlHttpBTCZ.setRequestHeader(IMS, OLD);
        xmlHttpBTCZ.send();
        document.getElementById('btz_curr_hash').innerText = "";
        xmlHttpBTCZ.onReadyStateChange = function() {
            if (xmlHttpBTCZ.readyState == 4 && xmlHttpBTCZ.status == 200) {
                var btz_curr_hash = parse(xmlHttpBTCZ, "hashrateString", 0);
                document.getElementById('btz_curr_hash').innerText = (Number(btz_curr_hash) < 100) ?
                    btz_curr_hash.toFixed(1) + " KSol/s" : 
                    btz_curr_hash.toFixed(0) + " Sol/s";
                document.getElementById('btz_immature').innerText =  parse(xmlHttpBTCZ, "immature", 0).toFixed(2);
                document.getElementById('btz_paid').innerText =  parse(xmlHttpBTCZ, "paid", 0).toFixed(2);
            }
        };
        xmlHttpZcash = new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttpZcash.open("GET", "https://api-zcash.flypool.org/miner/" + zec_addr + "/currentstats", true);
        xmlHttpZcash.setRequestHeader(IMS, OLD);
        xmlHttpZcash.send();
        document.getElementById('zec_curr_hash').innerText = "";
        xmlHttpZcash.onReadyStateChange = function() {
            if (xmlHttpZcash.readyState == 4 && xmlHttpZcash.status == 200) {
                var zec_curr_hash = parse(xmlHttpZcash, "currentHashrate", 0);
                var zec_avg_hash = parse(xmlHttpZcash, "averageHashrate", 0);
                var zec_last_seen = parse(xmlHttpZcash, "lastSeen", 0);
                var zec_active = parse(xmlHttpZcash, "activeWorkers", 0);
                var zec_coins_min = parse(xmlHttpZcash, "coinsPerMin", 0);
                // Create a new JavaScript Date object based on the timestamp
                // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var date = new Date(zec_last_seen*1000);
                // Hours part from the timestamp
                var hours = date.getHours();
                if (hours < 10) {
                    hours = "0" + hours;
                }
                // Minutes part from the timestamp
                var minutes = date.getMinutes();
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                var day = date.getDate();
                var month = months[date.getMonth()];

                var formattedTime = day + month + " " + hours + ':' + minutes;
                zec_curr_hash = String(zec_curr_hash);
                zec_avg_hash = String(zec_avg_hash);
                document.getElementById('zec_curr_hash').innerText = zec_curr_hash.substring(0, 4) + " H/s";
                document.getElementById('zec_avg_hash').innerText =  zec_avg_hash.substring(0, zec_avg_hash.indexOf(".")) + " H/s";
                document.getElementById('zec_last_seen').innerText = formattedTime;
                document.getElementById('zec_coins').innerText = (zec_coins_min*60*24*30).toFixed(2);
                document.getElementById('zec_active').innerText = zec_active;
            }
        };
        var nanoCalcAddress = 0;
        xmlHttpEthereumNano = new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttpEthereumNano.open("GET", "https://api.nanopool.org/v1/eth/user/" + eth_addr, true);
        xmlHttpEthereumNano.setRequestHeader(IMS, OLD);
        xmlHttpEthereumNano.send();
        document.getElementById('eth_nano_curr_hash').innerText = "";
        xmlHttpEthereumNano.onReadyStateChange = function() {
            if (xmlHttpEthereumNano.readyState == 4 && xmlHttpEthereumNano.status == 200) {
                var eth_nano_curr_hash = parse(xmlHttpEthereumNano, "hashrate", 0);
                var eth_nano_avg_hash = parse(xmlHttpEthereumNano, "h6", 0);
                var eth_nano_balance = parse(xmlHttpEthereumNano, "balance", 0);
                // var eth_nano_coins_min = parse(xmlHttpEthereumNano, "coinsPerMin", 0);

                document.getElementById('eth_nano_curr_hash').innerText = eth_nano_curr_hash.toFixed(0) + " MH/s";
                document.getElementById('eth_nano_avg_hash').innerText = eth_nano_avg_hash.toFixed(0) + " MH/s";
                document.getElementById('eth_nano_balance').innerText = eth_nano_balance.toFixed(4);
                // document.getElementById('eth_nano_coins').innerText = (eth_nano_coins_min*60*24*30).toFixed(2);
                nanoCalcAddress = eth_nano_avg_hash.toFixed(0);
            }
        };

        xmlHttpEthereumNanoCoin = new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttpEthereumNanoCoin.open("GET", "https://api.nanopool.org/v1/eth/approximated_earnings/" + nanoCalcAddress, true);
        xmlHttpEthereumNanoCoin.setRequestHeader(IMS, OLD);
        xmlHttpEthereumNanoCoin.send();
        xmlHttpEthereumNanoCoin.onReadyStateChange = function() {                 
            if (xmlHttpEthereumNanoCoin.readyState == 4 && xmlHttpEthereumNanoCoin.status == 200) {
                var eth_nano_coins = parse(xmlHttpEthereumNano, "coins", 0);
                document.getElementById('eth_nano_coins').innerText = eth_nano_coins * 1000000;
            }
        };

        xmlHttpEthereum = new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttpEthereum.open("GET", "https://api.ethermine.org/miner/" + eth_addr + "/currentStats", true);
        xmlHttpEthereum.setRequestHeader(IMS, OLD);
        xmlHttpEthereum.send();
        document.getElementById('eth_curr_hash').innerText = "";
        xmlHttpEthereum.onReadyStateChange = function() {
            if (xmlHttpEthereum.readyState == 4 && xmlHttpEthereum.status == 200) {
                var eth_curr_hash = parse(xmlHttpEthereum, "currentHashrate", 0);
                var eth_avg_hash = parse(xmlHttpEthereum, "averageHashrate", 0);
                var eth_last_seen = parse(xmlHttpEthereum, "lastSeen", 0);
                var eth_coins_min = parse(xmlHttpEthereum, "coinsPerMin", 0);
                var eth_active = parse(xmlHttpEthereum, "activeWorkers", 0);

                // Create a new JavaScript Date object based on the timestamp
                // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var date = new Date(eth_last_seen*1000);
                // Hours part from the timestamp
                var hours = date.getHours();
                if (hours < 10) {
                    hours = "0" + hours;
                }
                // Minutes part from the timestamp
                var minutes = date.getMinutes();
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                var day = date.getDate();
                var month = months[date.getMonth()];

                var formattedTime = day + month + " " + hours + ':' + minutes;
                eth_curr_hash = String(eth_curr_hash / 1000000);
                eth_avg_hash = String(eth_avg_hash / 1000000);
                document.getElementById('eth_curr_hash').innerText = Number(eth_curr_hash).toFixed(0) + " MH/s";
                document.getElementById('eth_avg_hash').innerText = Number(eth_avg_hash).toFixed(0) + " MH/s";
                document.getElementById('eth_last_seen').innerText = formattedTime;
                document.getElementById('eth_coins').innerText = (eth_coins_min*60*24*30).toFixed(2);
                document.getElementById('eth_active').innerText = eth_active;
            }
        };

        xmlHttpETC = new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttpETC.open("GET", "https://api-etc.ethermine.org/miner/" + etc_addr + "/currentStats", true);
        xmlHttpETC.setRequestHeader(IMS, OLD);
        xmlHttpETC.send();
        document.getElementById('etc_curr_hash').innerText = "";
        xmlHttpETC.onReadyStateChange = function() {
            if (xmlHttpETC.readyState == 4 && xmlHttpETC.status == 200) {
                var etc_curr_hash = parse(xmlHttpETC, "currentHashrate", 0);
                var etc_avg_hash = parse(xmlHttpETC, "averageHashrate", 0);
                var etc_last_seen = parse(xmlHttpETC, "lastSeen", 0);
                var etc_coins_min = parse(xmlHttpETC, "coinsPerMin", 0);
                var etc_active = parse(xmlHttpETC, "activeWorkers", 0);

                // Create a new JavaScript Date object based on the timestamp
                // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                var date = new Date(etc_last_seen*1000);
                // Hours part from the timestamp
                var hours = date.getHours();
                if (hours < 10) {
                    hours = "0" + hours;
                }
                // Minutes part from the timestamp
                var minutes = date.getMinutes();
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                var day = date.getDate();
                var month = months[date.getMonth()];

                var formattedTime = day + month + " " + hours + ':' + minutes;
                etc_curr_hash = String(etc_curr_hash / 1000000);
                etc_avg_hash = String(etc_avg_hash / 1000000);
                document.getElementById('etc_curr_hash').innerText = Number(etc_curr_hash).toFixed(0) + " MH/s";
                document.getElementById('etc_avg_hash').innerText = Number(etc_avg_hash).toFixed(0) + " MH/s";
                document.getElementById('etc_last_seen').innerText = formattedTime;
                document.getElementById('etc_coins').innerText = (etc_coins_min*60*24*30).toFixed(2);
                document.getElementById('etc_active').innerText = etc_active;
            }
        };

        xmlHttpBitcoinGold = new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttpBitcoinGold.open("GET", "https://btg.suprnova.cc/index.php?page=api&action=getuserstatus&api_key=b0c2b9a973b9080bfeefbbc04aea22d4befd4ad7945b3b85f3addacfa88f958c&id=201008300");
        xmlHttpBitcoinGold.setRequestHeader(IMS, OLD);
        xmlHttpBitcoinGold.send();
        document.getElementById('btg_curr_hash').innerText = "";
        xmlHttpBitcoinGold.onReadyStateChange = function() {
            if (xmlHttpBitcoinGold.readyState == 4 && xmlHttpBitcoinGold.status == 200) {
                var btg_curr_hash = parse(xmlHttpBitcoinGold, "hashrate", 0);
                btg_curr_hash = (btg_curr_hash/1000).toFixed(0) + " H/s"
                document.getElementById('btg_curr_hash').innerText = btg_curr_hash;
            }
        };
        xmlHttpZen = new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttpZen.open("GET", "https://zen.suprnova.cc/index.php?page=api&action=getuserstatus&api_key=b0c2b9a973b9080bfeefbbc04aea22d4befd4ad7945b3b85f3addacfa88f958c&id=201008300");
        xmlHttpZen.setRequestHeader(IMS, OLD);
        xmlHttpZen.send();
        document.getElementById('zen_curr_hash').innerText = "";
        xmlHttpZen.onReadyStateChange = function() {
            if (xmlHttpZen.readyState == 4 && xmlHttpZen.status == 200) {
                var zen_curr_hash = parse(xmlHttpZen, "hashrate", 0);
                zen_curr_hash = (zen_curr_hash/1000).toFixed(0) + " H/s"
                document.getElementById('zen_curr_hash').innerText = zen_curr_hash;
            }
        };
    } catch (ex) {
    }

    clearTimeout(exchTimeoutRef);
    exchTimeoutRef = setTimeout("updateExchangeData()", exchangeUpdateInterval);
}


function randomFromInterval(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

function parse(xmlhttp, jsonKey, defaultValue) {
    var regex = new RegExp('"' + jsonKey + '": {0,1}"{0,1}([0-9\.]+)');

    if (xmlhttp.readyState == 4 && jsonKey != "") {
        // try parsing with regex
        var temp = regex.exec(xmlhttp.responseText);
        if (temp != null && temp.length == 2) {
            var result = parseFloat(temp[1]);
        }

        // if regex fails, try parsing as JSON key
        if (!result || isNaN(result)) {
            var json = eval("(" + xmlhttp.responseText + ")");
            result = parseFloat(eval("(" + jsonKey + ")"));
        }

        // return whatever you got
        if (result && !isNaN(result)) {
            return result;
        }
    }

    return defaultValue;
}
