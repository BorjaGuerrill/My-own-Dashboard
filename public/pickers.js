const commonNamesForex = ['FX_IDC:USDCLP', 'FX_IDC:USDEUR', 'SAXO:USDCNH', 'BITSTAMP:BTCUSD', 'BITSTAMP:ETHUSD'];
const commonNamesCommodities = ['EASYMARKETS:OILUSD', 'TVC:GOLD', 'TVC:SILVER'];
const commonNamesClStock = ['BCS:COPEC', 'BME:SAN', 'BCS:CENCOMALLS', 'BCS:MALLPLAZA', 'BCS:CCU', 'BCS:LTM'];
const commonNamesStock = ['NASDAQ:MSFT', 'NASDAQ:NVDA', 'BCBA:TSMC', 'NASDAQ:AMZN', 'PSECZ:SHELL', 'NASDAQ:GOOG', 'NYSE:MA', 'NASDAQ:SPCX']

/* asi se importa:
*import { commonNamesForex } from 'pickers.js'*/

// Get the button element by its ID
const bForex = document.getElementById("forex");
// Add a click event listener
bForex.onclick = forex

const bCommodities = document.getElementById("commodities");
bCommodities.onclick = commodities

const bClStock = document.getElementById("clStock");
bClStock.onclick = clStock

const bStock = document.getElementById("stock");
bStock.onclick = stock

function forex() {
    function removeStrip() {
        const strip = document.getElementById('strip')
        if (strip) {
            strip.remove();
        }
    }
    removeStrip()
    const names = (typeof commonNamesForex !== 'undefined' && Array.isArray(commonNamesForex) && commonNamesForex.length) ? commonNamesForex : /*esto es un fallback*/['BCS:COPEC'];
    const symbols = names.map(n => ({ proName: n }));
    const config = {
        symbols: symbols,
        theme: "dark",
        locale: "en",
        largeChartUrl: "",
        isTransparent: true,
        showSymbolLogo: true,
    };
    const s = document.createElement('script');
    s.id = 'strip'
    s.type = 'text/javascript';
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js';
    s.async = true;
    s.text = JSON.stringify(config, null, 2);
    const container = document.querySelector('.tradingview-widget-container');
    container.appendChild(s);
};
function commodities() {
    function removeStrip() {
        const strip = document.getElementById('strip')
        if (strip) {
            strip.remove();
        }
    }
    removeStrip()
    const names = (typeof commonNamesForex !== 'undefined' && Array.isArray(commonNamesCommodities) && commonNamesCommodities.length) ? commonNamesCommodities : /*esto es un fallback*/['BCS:COPEC'];
    const symbols = names.map(n => ({ proName: n }));
    const config = {
        symbols: symbols,
        theme: "dark",
        locale: "en",
        largeChartUrl: "",
        isTransparent: true,
        showSymbolLogo: true,
    };
    const s = document.createElement('script');
    s.id = 'strip'
    s.type = 'text/javascript';
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js';
    s.async = true;
    s.text = JSON.stringify(config, null, 2);
    const container = document.querySelector('.tradingview-widget-container');
    container.appendChild(s);
};
function clStock() {
    function removeStrip() {
        const strip = document.getElementById('strip')
        if (strip) {
            strip.remove();
        }
    }
    removeStrip()
    const names = (typeof commonNamesClStock !== 'undefined' && Array.isArray(commonNamesClStock) && commonNamesClStock.length) ? commonNamesClStock : /*esto es un fallback*/['BCS:COPEC'];
    const symbols = names.map(n => ({ proName: n }));
    const config = {
        symbols: symbols,
        theme: "dark",
        locale: "en",
        largeChartUrl: "",
        isTransparent: true,
        showSymbolLogo: true,
    };
    const s = document.createElement('script');
    s.id = 'strip'
    s.type = 'text/javascript';
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js';
    s.async = true;
    s.text = JSON.stringify(config, null, 2);
    const container = document.querySelector('.tradingview-widget-container');
    container.appendChild(s);
};
function stock() {
    function removeStrip() {
        const strip = document.getElementById('strip')
        if (strip) {
            strip.remove();
        }
    }
    removeStrip()
    const names = (typeof commonNamesStock !== 'undefined' && Array.isArray(commonNamesStock) && commonNamesStock.length) ? commonNamesStock : /*esto es un fallback*/['BCS:COPEC'];
    const symbols = names.map(n => ({ proName: n }));
    const config = {
        symbols: symbols,
        theme: "dark",
        locale: "en",
        largeChartUrl: "",
        isTransparent: true,
        showSymbolLogo: true,
    };
    const s = document.createElement('script');
    s.id = 'strip'
    s.type = 'text/javascript';
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js';
    s.async = true;
    s.text = JSON.stringify(config, null, 2);
    const container = document.querySelector('.tradingview-widget-container');
    container.appendChild(s);
};
//Lo corre una vez para que haya algo cargado al meterse a la pagina
forex()