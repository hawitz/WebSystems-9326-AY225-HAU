import requests
from bs4 import BeautifulSoup
import time
import random
from urllib.parse import urljoin, urlparse
import re

class GeeksforGeeksScraper:
    """Web scraper for GeeksforGeeks Data Science content"""
    
    def __init__(self):
        self.base_url = "https://www.geeksforgeeks.org"
        self.data_science_urls = [
            "/data-science/",
            "/machine-learning/",
            "/python-data-science-tutorial/",
            "/data-science-with-python-tutorial/",
            "/data-analysis-with-python/"
        ]
        
        # Headers to mimic browser request
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        # Respect robots.txt - add delay between requests
        self.request_delay = 2  # seconds
    
    def _make_request(self, url):
        """Make HTTP request with delay and error handling"""
        time.sleep(self.request_delay + random.uniform(0, 1))
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response
        except requests.RequestException as e:
            print(f"Error fetching {url}: {e}")
            return None
    
    def _extract_difficulty(self, soup):
        """Extract difficulty level from article"""
        difficulty_patterns = [
            r'(easy|medium|hard)',
            r'difficulty.*?(easy|medium|hard)',
            r'level.*?(easy|medium|hard)'
        ]
        
        # Look for difficulty badges
        difficulty_elements = soup.find_all(['span', 'div', 'p'], 
                                           class_=re.compile(r'(difficulty|badge|level)', re.I))
        
        for element in difficulty_elements:
            text = element.get_text().lower()
            for pattern in difficulty_patterns:
                match = re.search(pattern, text)
                if match:
                    return match.group(1).capitalize()
        
        # Try to find in meta tags
        meta_desc = soup.find('meta', {'name': 'description'})
        if meta_desc:
            text = meta_desc.get('content', '').lower()
            for pattern in difficulty_patterns:
                match = re.search(pattern, text)
                if match:
                    return match.group(1).capitalize()
        
        return "Not Available"
    
    def _extract_key_concepts(self, soup):
        """Extract key concepts and introduction"""
        concepts = []
        
        # Look for introduction paragraphs
        intro_selectors = [
            'div.introduction p',
            'div.content p',
            'article p',
            '.entry-content p',
            'p:first-of-type'
        ]
        
        for selector in intro_selectors:
            elements = soup.select(selector)
            if elements:
                for element in elements[:2]:  # Get first 2 paragraphs
                    text = element.get_text().strip()
                    if text and len(text) > 50:  # Meaningful paragraph
                        concepts.append(text)
        
        # Look for definition lists
        dl_elements = soup.find_all('dl')
        for dl in dl_elements:
            dt = dl.find('dt')
            dd = dl.find('dd')
            if dt and dd:
                concepts.append(f"{dt.get_text().strip()}: {dd.get_text().strip()}")
        
        return concepts[0] if concepts else "Not Available"
    
    def _extract_code_snippets(self, soup):
        """Extract code snippets"""
        code_snippets = []
        
        # Look for code blocks
        code_selectors = [
            'pre code',
            'div.code-block code',
            'pre.prettyprint',
            'code.language-python',
            'code.language-r',
            'code.language-sql'
        ]
        
        for selector in code_selectors:
            elements = soup.select(selector)
            for element in elements:
                code = element.get_text().strip()
                if code and len(code) > 20:  # Meaningful code
                    # Clean up the code
                    code = re.sub(r'\s+', ' ', code)
                    code_snippets.append(code[:200] + '...' if len(code) > 200 else code)
        
        return code_snippets[0] if code_snippets else "Not Available"
    
    def _extract_complexity(self, soup):
        """Extract time and space complexity"""
        complexity_info = []
        
        # Look for complexity analysis
        complexity_patterns = [
            r'time complexity.*?[OΘΩ][(][^)]+[)]',
            r'space complexity.*?[OΘΩ][(][^)]+[)]',
            r'complexity.*?[OΘΩ][(][^)]+[)]'
        ]
        
        # Find all text content
        text_content = soup.get_text()
        text_content = re.sub(r'\s+', ' ', text_content)
        
        for pattern in complexity_patterns:
            matches = re.findall(pattern, text_content, re.I)
            if matches:
                complexity_info.extend(matches[:2])  # Get first 2 matches
        
        # Look in specific sections
        complexity_sections = soup.find_all(['h2', 'h3', 'h4'], 
                                           string=re.compile(r'complexity', re.I))
        
        for section in complexity_sections:
            next_elem = section.find_next(['p', 'ul', 'div'])
            if next_elem:
                text = next_elem.get_text().strip()
                if text and 'complexity' in text.lower():
                    complexity_info.append(text)
        
        return ' | '.join(complexity_info[:2]) if complexity_info else "Not Available"
    
    def _extract_references(self, soup):
        """Extract references and related links"""
        references = []
        
        # Look for reference section
        ref_selectors = [
            'div.references a',
            'div.related-links a',
            'div.footnotes a',
            'div.see-also a'
        ]
        
        for selector in ref_selectors:
            elements = soup.select(selector)
            for element in elements[:3]:  # Get first 3 references
                href = element.get('href')
                if href and not href.startswith('#'):
                    if not href.startswith('http'):
                        href = urljoin(self.base_url, href)
                    references.append(href)
        
        # Look for citation links
        citation_links = soup.find_all('a', href=re.compile(r'(wiki|reference|citation)', re.I))
        for link in citation_links[:3]:
            href = link.get('href')
            if href and not href.startswith('#'):
                if not href.startswith('http'):
                    href = urljoin(self.base_url, href)
                if href not in references:
                    references.append(href)
        
        return references[0] if references else "Not Available"
    
    def scrape_data_science_topics(self, limit=15):
        """Scrape Data Science topics from GeeksforGeeks"""
        all_articles = []
        
        print(f"Starting to scrape Data Science topics from GeeksforGeeks...")
        
        for section_url in self.data_science_urls:
            full_url = urljoin(self.base_url, section_url)
            print(f"Fetching from: {full_url}")
            
            response = self._make_request(full_url)
            if not response:
                continue
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Find article links
            article_links = []
            
            # Try different selectors for article links
            link_selectors = [
                'article a',
                '.entry-title a',
                'h2 a',
                'h3 a',
                '.post-title a',
                '.article-list a'
            ]
            
            for selector in link_selectors:
                links = soup.select(selector)
                for link in links:
                    href = link.get('href')
                    if href and '/data-science/' in href or any(topic in href for topic in ['machine-learning', 'python', 'data-analysis']):
                        if href not in article_links:
                            article_links.append(href)
                
                if len(article_links) >= limit:
                    break
            
            # Scrape each article
            for i, article_url in enumerate(article_links[:limit]):
                if len(all_articles) >= limit:
                    break
                
                print(f"Scraping article {i+1}/{min(len(article_links), limit)}: {article_url}")
                
                if not article_url.startswith('http'):
                    article_url = urljoin(self.base_url, article_url)
                
                response = self._make_request(article_url)
                if not response:
                    continue
                
                article_soup = BeautifulSoup(response.content, 'html.parser')
                
                # Extract article data
                title = article_soup.find('h1')
                title = title.get_text().strip() if title else "Not Available"
                
                article_data = {
                    'title': title,
                    'difficulty': self._extract_difficulty(article_soup),
                    'concepts': self._extract_key_concepts(article_soup),
                    'code': self._extract_code_snippets(article_soup),
                    'complexity': self._extract_complexity(article_soup),
                    'references': self._extract_references(article_soup),
                    'url': article_url
                }
                
                all_articles.append(article_data)
                print(f"✓ Scraped: {title[:50]}...")
                
                # Add random delay between articles
                time.sleep(random.uniform(1, 3))
            
            if len(all_articles) >= limit:
                break
        
        print(f"\n✓ Successfully scraped {len(all_articles)} Data Science topics!")
        return all_articles[:limit]

# Example usage
if __name__ == "__main__":
    scraper = GeeksforGeeksScraper()
    data = scraper.scrape_data_science_topics(limit=10)
    
    # Save to file for testing
    import json
    with open('scraped_data_test.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print("\nSample of scraped data:")
    for i, topic in enumerate(data, 1):
        print(f"\n{i}. {topic['title']}")
        print(f"   Difficulty: {topic['difficulty']}")
        print(f"   Concepts: {topic['concepts'][:100]}...")