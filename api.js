// API Key setup
const API_KEY = "AIzaSyB000JJvPeDCcIMUTEe2wvwo7CSv49X1g4";

async function getEsportsTeamManagerRecommendations() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Provide a detailed list of the best esports team manager software tools. Include for each: name, description, key features, pricing (if available), and official website links.`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";

        return {
            status: "success",
            recommendations: text
        };
    } catch (error) {
        console.error("Error getting recommendations:", error);
        return {
            status: "error",
            error: error.message
        };
    }
}

// Update your form submission handler in index.html
document.getElementById('recommendations-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const responseElement = document.getElementById('software-response');

    // Show loading state
    responseElement.innerHTML = '<p class="loading-text">Finding the best esports team manager tools for you...</p>';
    showSection('results');

    const result = await getEsportsTeamManagerRecommendations();

    if (result.status === 'success') {
        responseElement.innerHTML = formatRecommendations(result.recommendations);
    } else {
        responseElement.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error getting recommendations: ${result.error}</p>
            </div>
            <button onclick="showRecommendations()" class="secondary-btn">Try Again <i class="fas fa-redo"></i></button>
        `;
    }
});

function formatRecommendations(text) {
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold markdown to HTML
    html = html.replace(/\n/g, '<br>'); // Newlines to <br>

    return `<div class="api-response">${html}</div>
            <button onclick="showRecommendations()" class="secondary-btn">New Search <i class="fas fa-redo"></i></button>`;
}
