from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
import requests
from transformers import pipeline
import logging
import torch

app = Flask(__name__)

# Initialize logging
logging.basicConfig(level=logging.INFO)

# Check if GPU is available and set the device accordingly
device = 0 if torch.cuda.is_available() else -1

# Log the device being used
if device == 0:
    logging.info("Using GPU for summarization")
else:
    logging.info("Using CPU for summarization")

# Initialize the summarization pipeline with GPU support if available
summarizer = pipeline("summarization", model="t5-base", device=device)

def extract_text_from_webpage(url):
    # Send a GET request to the webpage
    response = requests.get(url)
    
    # Parse the HTML content of the webpage
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract text from all <p> and <span> tags, including nested ones
    def extract_text(tag):
        if tag.name in ['p', 'span']:
            return tag.get_text(strip=True, separator=' ')
        else:
            return ''
    
    text = ' '.join(extract_text(tag) for tag in soup.find_all())
    words = text.split()
    if len(words) > 500:
        text = ' '.join(words[:500])

    # Log the extracted text
    logging.info(f"Extracted text from {url}: {text}")
    return text

@app.route('/summary', methods=['GET'])
def summarize():
    # Get the URL of the webpage from the query parameters
    url = request.args.get('url')
    
    # Extract text from the webpage
    article = extract_text_from_webpage(url)

    # Perform summarization using the pipeline
    summary = summarizer(article, max_length=230, min_length=130, do_sample=False)

    # Return the summary as JSON
    return jsonify({'summary': summary[0]['summary_text']})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
