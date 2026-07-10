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
    const feedData = await final(`https://rss.nytimes.com/services/xml/rss/nyt/World.xml`);
    const LBMTElement = document.getElementById("LTMT");
    LBMTElement.innerHTML = feedData.title;
    const LBMTlElement = document.getElementById("LTMT");
    LBMTlElement.href = feedData.link;

    const entries = [0,1,2,3,4,5,6,7,8,9];
    entries.forEach(index => {
        const titleEl = document.getElementById(`LTT${index}`);
        const descEl = document.getElementById(`LTD${index}`);
        if (titleEl && feedData.items[index]) {
            titleEl.innerHTML = feedData.items[index].title;
            titleEl.href = feedData.items[index].link;
        }
        if (descEl && feedData.items[index]) {
            descEl.innerHTML = feedData.items[index].description;
        }
    });
}
LT()
async function RT() {
    const feedData = await final(`/api/rss/hn`);
    const LBMTElement = document.getElementById("RTMT");
    LBMTElement.innerHTML = feedData.title;
    const LBMTlElement = document.getElementById("RTMT");
    LBMTlElement.href = feedData.link;

    const entries = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19];
    entries.forEach(index => {
        const titleEl = document.getElementById(`RTT${index}`);
        const linkEl = document.getElementById(`RTL${index}`);
        if (titleEl && feedData.items[index]) {
            titleEl.innerHTML = feedData.items[index].title;
        }
        if (linkEl && feedData.items[index]) {
            linkEl.href = feedData.items[index].link
        }
    });
}
RT()
async function LB() {
    const feedData = await final(`/api/rss/un`);
    const LBMTElement = document.getElementById("LBMT");
    LBMTElement.innerHTML = feedData.title;
    const LBMTlElement = document.getElementById("LBMT");
    LBMTlElement.href = feedData.link;

    const entries = [0,1,2,3,4,5,6,7,8,9];
    entries.forEach(index => {
        const titleEl = document.getElementById(`LBT${index}`);
        const descEl = document.getElementById(`LBD${index}`);
        if (titleEl && feedData.items[index]) {
            titleEl.innerHTML = feedData.items[index].title;
            titleEl.href = feedData.items[index].link;
        }
        if (descEl && feedData.items[index]) {
            descEl.innerHTML = feedData.items[index].description;
        }
    });
}
LB()
async function RB(){
    const feedData = await final('/api/rss/wd');
    const RBMTElement = document.getElementById("RBMT");
    RBMTElement.innerHTML = feedData.title;
    const RBMTlElement = document.getElementById("RBMT");
    RBMTlElement.href = feedData.link;

    const entries = [0,1,2,3,4,5,6,7,8,9];
    entries.forEach(index => {
        const titleEl = document.getElementById(`RBT${index}`);
        const descEl = document.getElementById(`RBD${index}`);
        if (titleEl && feedData.items[index]) {
            titleEl.innerHTML = feedData.items[index].title;
            titleEl.href = feedData.items[index].link;
        }
        if (descEl && feedData.items[index]) {
            descEl.innerHTML = feedData.items[index].description;
        }
    });
}
RB()