// RSS feed URL (replace with your feed)  
// const RSS_FEED_URL = "https://rss.nytimes.com/services/xml/rss/nyt/World.xml";
let titulo = null
// Fetch the RSS feed  
async function fetchFeed(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const xmlText = await response.text(); // Get XML as text  
        return xmlText;
    } catch (error) {
        console.error("Error fetching RSS feed:", error);
        throw error; // Propagate error to handle later  
    }
}
function parseXml(xmlText) {
    const parser = new DOMParser();
    return parser.parseFromString(xmlText, "text/xml"); // Parse XML  
}
// Extract feed data from parsed XML  
function extractFeedData1(xmlDoc) {
    const channel = xmlDoc.querySelector("channel");
    if (!channel) {
        throw new Error("Invalid RSS feed: No <channel> element found");
    }

    // Extract channel metadata  
    const feedData = {
        title: channel.querySelector("title")?.textContent || "Untitled Feed",
        link: channel.querySelector("link")?.textContent || "#",
        description: channel.querySelector("description")?.textContent || "No description",
        items: []
    };

    // Extract items  
    const items = xmlDoc.querySelectorAll("item");
    items.forEach(item => {
        const feedItem = {
            title: item.querySelector("title")?.textContent || "Untitled Item",
            link: item.querySelector("link")?.textContent || "#",
            description: item.querySelector("description")?.textContent || "No description",
            pubDate: item.querySelector("pubDate")?.textContent || "Unknown date"
        };
        feedData.items.push(feedItem);
    });

    return feedData;
}

async function final(url) {
    try {
        const xmlText = await fetchFeed(url);
        console.log("xmlText:", xmlText);
        const xmlDoc = parseXml(xmlText);
        console.log("xmlDoc:", xmlDoc);
        const feedData = extractFeedData1(xmlDoc);
        console.log("feedData:", feedData);
        return feedData;
    } catch (error) {
        console.error("Error en final():", error);
        throw error;
    }
}
// async function final2(){
//     try{
//         const xmlText
//     }
//     catch (error){
//         console.error("Error en final2()", error)
//         throw error;
//     }
// }
async function LT() {
    const feedData = await final("https://rss.nytimes.com/services/xml/rss/nyt/World.xml");
    const LTMTElement = document.getElementById("LTMT");
    LTMTElement.innerHTML = feedData.title;
    const LTMLElement = document.getElementById("LTML");
    LTMLElement.innerHTML = feedData.link;
    const LTT0Element = document.getElementById("LTT0")
    LTT0Element.innerHTML = feedData.items[0].title
    const LTD0Element = document.getElementById("LTD0");
    LTD0Element.innerHTML = feedData.items[0].description
    const LTT1Element = document.getElementById("LTT1")
    LTT1Element.innerHTML = feedData.items[1].title
    const LTD1Element = document.getElementById("LTD1");
    LTD1Element.innerHTML = feedData.items[1].description

}
LT()
async function RT() {
    const feedData = await final(`/api/rss/hn`);
    const RTMTElement = document.getElementById("RTMT");
    RTMTElement.innerHTML = feedData.title;
    const RTMLElement = document.getElementById("RTML");
    RTMLElement.innerHTML = feedData.link;
    const RTT0Element = document.getElementById("RTT0")
    RTT0Element.innerHTML = feedData.items[0].title
    const RTD0Element = document.getElementById("RTD0");
    RTD0Element.innerHTML = feedData.items[0].description
    const RTT1Element = document.getElementById("RTT1")
    RTT1Element.innerHTML = feedData.items[1].title
    const RTD1Element = document.getElementById("RTD1");
    RTD1Element.innerHTML = feedData.items[1].description

}
RT()