from flask import Flask, request, render_template, jsonify
from bs4 import BeautifulSoup
import requests
from transformers import pipeline
import logging

app = Flask(__name__)

# Initialize the summarization pipeline
summarizer = pipeline("summarization", model="t5-base")

# Configure logging
logging.basicConfig(level=logging.INFO)

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
    if len(words) > 1000:
        text = ' '.join(words[:1000])

    # Log the extracted text
    logging.info(f"Extracted text from {url}: {text}")
    return text

@app.route('/summary', methods=['GET', 'POST'])
def summarize():
    if request.method == 'GET':
        # Get the URL of the webpage from the query parameters
        url = request.args.get('url')
        
        # Extract text from the webpage
        article = extract_text_from_webpage(url)
    elif request.method == 'POST':
        # Get the text to summarize from the request body
        data = request.json
        article = data.get('text', '')

    # Perform summarization using the pipeline
    summary = summarizer(article, max_length=130, min_length=30, do_sample=False)

    # Return the summary as JSON
    return jsonify({'summary': summary[0]['summary_text']})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
