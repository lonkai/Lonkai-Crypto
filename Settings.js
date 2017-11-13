var numberRegex = /[^\d.,-]/g;
var positiveNumberRegex = /[^\d.,]/g;

function load() {
    System.Gadget.onSettingsClosing = onClosing;

    document.getElementById('zec_show').checked = System.Gadget.Settings.read("zec_show");
    document.getElementById('eth_show').checked = System.Gadget.Settings.read("eth_show");
    document.getElementById('etc_show').checked = System.Gadget.Settings.read("etc_show");
    document.getElementById('btg_show').checked = System.Gadget.Settings.read("btg_show");
    document.getElementById('btz_show').checked = System.Gadget.Settings.read("btz_show");
    document.getElementById('ethermine_show').checked = System.Gadget.Settings.read("ethermine_show");
    document.getElementById('nanopool_show').checked = System.Gadget.Settings.read("nanopool_show");
    if (document.getElementById('eth_show').checked) {
        document.getElementById('ethereum').style.display = "block";
    }
    else {
        document.getElementById('ethereum').style.display = "none";
    }

    document.getElementById('zec_addr').innerText = System.Gadget.Settings.readString("zec_addr");
    document.getElementById('eth_addr').innerText = System.Gadget.Settings.readString("eth_addr");
    document.getElementById('etc_addr').innerText = System.Gadget.Settings.readString("etc_addr");

}

function check(show) {
    var checkbox = document.getElementById('zec_show').checked + 
        document.getElementById('ethermine_show').checked +
        document.getElementById('nanopool_show').checked +
        document.getElementById('etc_show').checked;

    if  (checkbox === 3)  { 
        document.getElementById(show).checked = false;
    }

    if (document.getElementById('eth_show').checked) {
        document.getElementById('ethereum').style.display = "block";
    }
    else {
        document.getElementById('ethereum').style.display = "none";
        document.getElementById("ethermine_show").checked = false;
        document.getElementById("nanopool_show").checked = false;
    }
}

function checkEth(show) {
    var checkbox = document.getElementById('zec_show').checked + 
        document.getElementById('ethermine_show').checked +
        document.getElementById('nanopool_show').checked +
        document.getElementById('etc_show').checked;

    document.getElementById('eth_show').checked = true;

    if  (checkbox === 3)  { 
        document.getElementById(show).checked = false;
    }

}

function onClosing(event) {
    if (event.closeAction == event.Action.commit) {

        System.Gadget.Settings.write("zec_show", document.getElementById("zec_show").checked);
        System.Gadget.Settings.write("eth_show", document.getElementById("eth_show").checked);
        System.Gadget.Settings.write("etc_show", document.getElementById("etc_show").checked);
        System.Gadget.Settings.write("btg_show", document.getElementById("btg_show").checked);
        System.Gadget.Settings.write("btz_show", document.getElementById("btz_show").checked);

        System.Gadget.Settings.write("ethermine_show", document.getElementById("ethermine_show").checked);
        System.Gadget.Settings.write("nanopool_show", document.getElementById("nanopool_show").checked);

        System.Gadget.Settings.writeString("zec_addr", trim(document.getElementById('zec_addr').value));
        System.Gadget.Settings.writeString("eth_addr", trim(document.getElementById('eth_addr').value));
        System.Gadget.Settings.writeString("etc_addr", trim(document.getElementById('etc_addr').value));

        event.cancel = false;
    }
}

function trim(str) {
    var str = str.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
}

function onFocus(el) {
    if (window.copyToClipboard && window.copyToClipboard(el)) {
        document.getElementById('noteCopied').style.display = '';
    } else {
        document.getElementById('noteNotCopied').style.display = '';
    }
    window.scrollTo(0, document.body.scrollHeight);
}

function onBlur() {
    document.getElementById('noteCopied').style.display = 'none';
    document.getElementById('noteNotCopied').style.display = 'none';
}

window.copyToClipboard = function(source) {
    source.select();
    if (window.clipboardData) {
        clipboardData.setData('Text', source.value);
        return 1;
    } else {
        return 0;
    }
}
