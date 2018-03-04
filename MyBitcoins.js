var MAX_STARTUP = 10 * ONE_SEC;  // 15 sec 
var MAX_DECIMALS = 6;
var IMS = "If-Modified-Since";
var OLD = "Thu, 01 Jun 1970 00:00:00 GMT";

var zec_show = false;
var etc_show = false;
var btg_show = false;
var btz_show = false;
var zen_show = true;
var zcl_show = true;
var eth_show = false;
var ethermine_show = false;
var nanopool_show = false;

var zec_addr = "t1aPosjaW4e2UHrnj5mXsHureUBnX1jLyuQ";
var eth_addr = "e2d07294df04dae81aaef23a7194a3bd511a40bd";
var etc_addr = "0x42bf31f75b0d1b2bfa0c41e62470d2bba007b99a";
var zcl_addr = "t1ZZgre1t73hMFFJPyJzMsnQZCA66T74ft4";
var zen_addr = "znbyDPJ4TVC2Xz4GhGXKia6VjuY11fmbK7X";

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
            System.Gadget.Settings.write("zcl_show", zcl_show);
            System.Gadget.Settings.write("zen_show", zen_show);

            System.Gadget.Settings.write('ethermine_show', ethermine_show);
            System.Gadget.Settings.write('nanopool_show', nanopool_show);

            System.Gadget.Settings.writeString("zec_addr", zec_addr);
            System.Gadget.Settings.writeString("eth_addr", eth_addr);
            System.Gadget.Settings.writeString("etc_addr", etc_addr);
            System.Gadget.Settings.writeString("zcl_addr", zcl_addr);
            System.Gadget.Settings.writeString("zen_addr", zen_addr);
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
    zcl_show = System.Gadget.Settings.read("zcl_show");
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
    document.getElementById('ZclDIV').style.display = "none";

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
    if (zcl_show) {
        i = i + 1;
        document.getElementById('ZclDIV').style.display =  "block";
    }
    if (zen_show) {
        i = i + 1;
        document.getElementById('ZenDIV').style.display =  "block";
    }

    if (i === 0) {
        document.body.style.height = "205px";
    }
    else if (i === 1) {
        document.body.style.height = "300px";
    }
    else {
        document.body.style.height = "400px";
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
    if (System.Gadget.Settings.readString("zcl_addr")) {
        zcl_addr = System.Gadget.Settings.readString("zcl_addr");
    }
    if (System.Gadget.Settings.readString("zen_addr")) {
        zen_addr = System.Gadget.Settings.readString("zen_addr");
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
                document.getElementById('bch_btc').innerText = parse(xmlhttpBch, "BTC", 0).toFixed(4);
            }
        };

        xmlhttpBtg = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpBtg.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=BTG&tsyms=USD,BTC", true);
        xmlhttpBtg.setRequestHeader(IMS, OLD);
        xmlhttpBtg.send();
        xmlhttpBtg.onReadyStateChange = function() {                 
            if (xmlhttpBtg.readyState == 4 && xmlhttpBtg.status == 200) {
                document.getElementById('btg').innerText = parse(xmlhttpBtg, "USD", 0).toFixed(0) + "$";
                document.getElementById('btg_btc').innerText = parse(xmlhttpBtg, "BTC", 0).toFixed(4);
            }
        };

        xmlhttpEth = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpEth.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,BTC,ZEC", true);
        xmlhttpEth.setRequestHeader(IMS, OLD);
        xmlhttpEth.send();
        xmlhttpEth.onReadyStateChange = function() {                 
            if (xmlhttpEth.readyState == 4 && xmlhttpEth.status == 200) {
                document.getElementById('eth').innerText = parse(xmlhttpEth, "USD", 0).toFixed(0) + "$";
                document.getElementById('eth_btc').innerText = parse(xmlhttpEth, "BTC", 0).toFixed(4);
            }
        };

        xmlhttpEtc = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpEtc.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ETC&tsyms=USD,BTC", true);
        xmlhttpEtc.setRequestHeader(IMS, OLD);
        xmlhttpEtc.send();
        xmlhttpEtc.onReadyStateChange = function() {                 
            if (xmlhttpEtc.readyState == 4 && xmlhttpEtc.status == 200) {
                document.getElementById('etc').innerText = parse(xmlhttpEtc, "USD", 0).toFixed(0) + "$";
                document.getElementById('etc_btc').innerText = parse(xmlhttpEtc, "BTC", 0).toFixed(4);
            }
        };

        xmlhttpZec = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpZec.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ZEC&tsyms=USD,BTC,ETH", true);
        xmlhttpZec.setRequestHeader(IMS, OLD);
        xmlhttpZec.send();
        xmlhttpZec.onReadyStateChange = function() {                 
            if (xmlhttpZec.readyState == 4 && xmlhttpZec.status == 200) {
                document.getElementById('zec').innerText = parse(xmlhttpZec, "USD", 0).toFixed(0) + "$";
                document.getElementById('zec_btc').innerText = parse(xmlhttpZec, "BTC", 0).toFixed(4);
            }
        };
        xmlhttpZen = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpZen.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ZEN&tsyms=USD,BTC,ETH", true);
        xmlhttpZen.setRequestHeader(IMS, OLD);
        xmlhttpZen.send();
        xmlhttpZen.onReadyStateChange = function() {                 
            if (xmlhttpZen.readyState == 4 && xmlhttpZen.status == 200) {
                document.getElementById('zen').innerText = parse(xmlhttpZen, "USD", 0).toFixed(0) + "$";
                document.getElementById('zen_btc').innerText = parse(xmlhttpZen, "BTC", 0).toFixed(4);
            }
        };
        xmlhttpZcl = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpZcl.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ZCL&tsyms=USD,BTC,ETH", true);
        xmlhttpZcl.setRequestHeader(IMS, OLD);
        xmlhttpZcl.send();
        xmlhttpZcl.onReadyStateChange = function() {                 
            if (xmlhttpZcl.readyState == 4 && xmlhttpZcl.status == 200) {
                document.getElementById('zcl').innerText = parse(xmlhttpZcl, "USD", 0).toFixed(0) + "$";
                document.getElementById('zcl_btc').innerText = parse(xmlhttpZcl, "BTC", 0).toFixed(4);
            }
        };
        xmlhttpZen = new ActiveXObject("Microsoft.XMLHTTP");
        xmlhttpZen.open("GET", "https://min-api.cryptocompare.com/data/price?fsym=ZEN&tsyms=USD,BTC,ETH", true);
        xmlhttpZen.setRequestHeader(IMS, OLD);
        xmlhttpZen.send();
        xmlhttpZen.onReadyStateChange = function() {                 
            if (xmlhttpZen.readyState == 4 && xmlhttpZen.status == 200) {
                document.getElementById('zen').innerText = parse(xmlhttpZen, "USD", 0).toFixed(0) + "$";
                document.getElementById('zen_btc').innerText = parse(xmlhttpZen, "BTC", 0).toFixed(4);
            }
        };
        xmlHttpBTCZ = new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttpBTCZ.open("GET", "http://pool.bitcoinzguiding.ovh/api/worker_stats?t1TtaSf9NiLepNLRw5heMCuvLfueuBpG6zH", true);
        xmlHttpBTCZ.setRequestHeader(IMS, OLD);
        xmlHttpBTCZ.send();
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

        xmlHttpEthereumClsNano = new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttpEthereumClsNano.open("GET", "https://api.nanopool.org/v1/etc/user/" + etc_addr, true);
        xmlHttpEthereumClsNano.setRequestHeader(IMS, OLD);
        xmlHttpEthereumClsNano.send();
        xmlHttpEthereumClsNano.onReadyStateChange = function() {
            if (xmlHttpEthereumClsNano.readyState == 4 && xmlHttpEthereumClsNano.status == 200) {
                var etc_nano_curr_hash = parse(xmlHttpEthereumClsNano, "hashrate", 0);
                var etc_nano_avg_hash = parse(xmlHttpEthereumClsNano, "h6", 0);
                var etc_nano_balance = parse(xmlHttpEthereumClsNano, "balance", 0);
                // var etc_nano_coins_min = parse(xmlHttpEthereumClsNano, "coinsPerMin", 0);

                document.getElementById('etc_nano_curr_hash').innerText = etc_nano_curr_hash.toFixed(0) + " MH/s";
                document.getElementById('etc_nano_avg_hash').innerText = etc_nano_avg_hash.toFixed(0) + " MH/s";
                document.getElementById('etc_nano_balance').innerText = etc_nano_balance.toFixed(4);
                // document.getElementById('etc_nano_coins').innerText = (etc_nano_coins_min*60*24*30).toFixed(2);
                nanoCalcAddress = etc_nano_avg_hash.toFixed(0);
            }
        };
        xmlHttpZenCash = new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttpZenCash.open("GET", "https://minez.zone/api/worker_stats?" + zen_addr, true);
        xmlHttpZenCash.setRequestHeader(IMS, OLD);
        xmlHttpZenCash.send();
        xmlHttpZenCash.onReadyStateChange = function() {
            if (xmlHttpZenCash.readyState == 4 && xmlHttpZenCash.status == 200) {
                var zen_curr_hash = parse(xmlHttpZenCash, "hashrateString", 0);
                var zen_paid = parse(xmlHttpZenCash, "paid", 0);
                var zen_balance = parse(xmlHttpZenCash, "balance", 0);
                var zen_upd = parse(xmlHttpZenCash, "time", 0);

                document.getElementById('zen_curr_hash').innerText = "zen_curr_hash";
                document.getElementById('zen_paid').innerText = zen_paid;
                document.getElementById('zen_balance').innerText = zen_balance;
                document.getElementById('zen_balance').innerText = zen_upd;
            }
        };
        xmlHttpZclassic = new ActiveXObject("Microsoft.XMLHTTP");
        xmlHttpZclassic.open("GET", "https://minez.zone/api/worker_stats?t1ZZgre1t73hMFFJPyJzMsnQZCA66T74ft4", true);
        xmlHttpZclassic.setRequestHeader(IMS, OLD);
        xmlHttpZclassic.send();
        xmlHttpZclassic.onReadyStateChange = function() {
            if (xmlHttpZclassic.readyState == 4 && xmlHttpZclassic.status == 200) {
                var zcl_curr_hash = parse(xmlHttpZclassic, "hashrateString", 0);
                var zcl_paid = parse(xmlHttpZclassic, "totalShares", 0);
                var zcl_balance = parse(xmlHttpZclassic, "balance", 0);
                var zcl_upd = parse(xmlHttpZclassic, "time", 0);

                document.getElementById('zcl_curr_hash').innerText = "111";
                document.getElementById('zcl_paid').innerText = zcl_paid;
                document.getElementById('zcl_balance').innerText = zcl_balance;
                document.getElementById('zcl_balance').innerText = zcl_upd;
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
