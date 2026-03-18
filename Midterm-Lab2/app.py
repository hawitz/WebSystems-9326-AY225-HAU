from flask import Flask, render_template, jsonify, request, send_file
from flask_cors import CORS
import json
import os
from datetime import datetime
from scraper import GeeksforGeeksScraper
from pdf_generator import PDFGenerator
import threading

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['DATA_FOLDER'] = 'data'
app.config['PDF_FOLDER'] = 'generated_pdfs'

# Ensure directories exist
os.makedirs(app.config['DATA_FOLDER'], exist_ok=True)
os.makedirs(app.config['PDF_FOLDER'], exist_ok=True)

DATA_FILE = os.path.join(app.config['DATA_FOLDER'], 'scraped_data.json')
PDF_FILE = os.path.join(app.config['PDF_FOLDER'], 'data_science_learning_material.pdf')

# Global variables for tracking scraping progress
scraping_status = {
    'in_progress': False,
    'progress': 0,
    'message': '',
    'topics_scraped': 0
}

@app.route('/')
def index():
    """Render the main dashboard"""
    return render_template('index.html')

@app.route('/api/scrape', methods=['POST'])
def scrape():
    """Start the scraping process"""
    global scraping_status
    
    if scraping_status['in_progress']:
        return jsonify({
            'success': False,
            'message': 'Scraping already in progress'
        })
    
    def run_scraper():
        global scraping_status
        scraping_status['in_progress'] = True
        scraping_status['progress'] = 0
        scraping_status['message'] = 'Initializing scraper...'
        
        try:
            scraper = GeeksforGeeksScraper()
            
            # Update progress
            scraping_status['progress'] = 20
            scraping_status['message'] = 'Fetching Data Science topics...'
            
            # Scrape data
            data = scraper.scrape_data_science_topics(limit=15)
            
            scraping_status['progress'] = 60
            scraping_status['message'] = 'Processing and saving data...'
            
            # Save to file
            with open(DATA_FILE, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            
            scraping_status['progress'] = 100
            scraping_status['message'] = f'Scraped {len(data)} topics successfully!'
            scraping_status['topics_scraped'] = len(data)
            
        except Exception as e:
            scraping_status['message'] = f'Error: {str(e)}'
        finally:
            scraping_status['in_progress'] = False
    
    # Start scraping in background thread
    thread = threading.Thread(target=run_scraper)
    thread.daemon = True
    thread.start()
    
    return jsonify({
        'success': True,
        'message': 'Scraping started in background'
    })

@app.route('/api/scrape-status', methods=['GET'])
def scrape_status():
    """Get current scraping status"""
    global scraping_status
    return jsonify(scraping_status)

@app.route('/api/preview', methods=['GET'])
def preview():
    """Preview scraped data"""
    try:
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
            return jsonify(data)
        else:
            return jsonify([])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-pdf', methods=['POST'])
def generate_pdf():
    """Generate PDF from scraped data"""
    try:
        if not os.path.exists(DATA_FILE):
            return jsonify({
                'success': False,
                'message': 'No data available. Please scrape first.'
            })
        
        # Load scraped data
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Generate PDF
        pdf_gen = PDFGenerator()
        filename = pdf_gen.generate_learning_material(data, PDF_FILE)
        
        return jsonify({
            'success': True,
            'message': 'PDF generated successfully',
            'filename': filename
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/api/download-pdf', methods=['GET'])
def download_pdf():
    """Download the generated PDF"""
    try:
        if os.path.exists(PDF_FILE):
            return send_file(
                PDF_FILE,
                as_attachment=True,
                download_name=f'data_science_learning_material_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf',
                mimetype='application/pdf'
            )
        else:
            return jsonify({
                'success': False,
                'message': 'PDF not found. Please generate first.'
            }), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clear-data', methods=['POST'])
def clear_data():
    """Clear scraped data"""
    try:
        if os.path.exists(DATA_FILE):
            os.remove(DATA_FILE)
        if os.path.exists(PDF_FILE):
            os.remove(PDF_FILE)
        
        return jsonify({
            'success': True,
            'message': 'Data cleared successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)