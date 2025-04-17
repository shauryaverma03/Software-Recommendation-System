// Add this to your index.html or a separate JS file
const API_KEY = "AIzaSyAqJXj39JAabzqLXsPykvwe6q6u4KYWPb4";

async function getRecommendations(prompt) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Provide detailed software recommendations for: ${prompt}. Include name, description, key features, pricing (if applicable), and official website links.`
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
    const requirements = document.getElementById('user-requirements').value;
    const responseElement = document.getElementById('software-response');
    
    // Show loading state
    responseElement.innerHTML = '<p class="loading-text">Finding the best software for you</p>';
    showSection('results');
    
    const result = await getRecommendations(requirements);
    
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
    // This is a basic formatter - you might need to adjust based on how Gemini formats its response
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Convert markdown bold to HTML
    html = html.replace(/\n/g, '<br>'); // Convert newlines to line breaks
    
    return `<div class="api-response">${html}</div>
            <button onclick="showRecommendations()" class="secondary-btn">New Search <i class="fas fa-redo"></i></button>`;
}