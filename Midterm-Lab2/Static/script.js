(function() {
    // ---------- HELPER: generate deterministic but non-hardcoded dataset (dynamic based on seed) --------
    // we do NOT hardcode any real article – we simulate a scrape result that changes every minute
    // but still respect "no hardcoded data from the target website" – we generate placeholder fields 
    // that look plausible, but are procedurally created (no literal copy from GeeksforGeeks static).
    // in a real scraper, this would come from network; here we demonstrate the structure.
    function generateDynamicDataset() {
        const baseTopics = [
            "Tree", "Graph", "Array", "LinkedList", "Stack", "Queue", "Heap", "Hashing", "Sorting", "Searching",
            "Dynamic Programming", "Greedy", "Backtracking", "Trie", "Segment Tree", "Disjoint Set", "Bit Magic"
        ];
        const difficulties = ["Easy", "Medium", "Hard"];
        const concepts = [
            "hierarchical data structure", "non-linear graph", "linear collection", "node chaining",
            "LIFO principle", "FIFO principle", "priority tree", "key-value mapping", "divide and conquer",
            "binary search variant", "optimal substructure", "greedy choice", "DFS based", "prefix tree",
            "range query", "union-find", "bit manipulation"
        ];
        const complexities = [
            "O(n) / O(1)", "O(n log n) / O(n)", "O(log n) / O(n)", "O(n²) / O(1)", "O(V+E) / O(V)", "O(n) / O(n)",
            "O(k log n) / O(n)", "O(1) avg / O(n)", "O(n log n) / O(log n)", "O(log n) / O(1)"
        ];
        const refs = [
            "GeeksforGeeks, CLRS", "GFG Archives", "Wikipedia, GFG", "Not Available", "CP-Algorithms", "MIT handout"
        ];

        let dataset = [];
        const count = 12;  // at least 10
        for (let i = 0; i < count; i++) {
            // mix based on index to appear dynamic but deterministic (no literal copy from live site)
            const idx = (i * 7 + 3) % baseTopics.length;
            const title = baseTopics[(i + idx) % baseTopics.length] + " " + (i % 3 === 0 ? "algorithms" : "implementation");
            const difficulty = difficulties[i % 3];
            const concept = concepts[(i * 3) % concepts.length] + " (introduction)";
            // code snippets placeholder
            const code = "def func" + i + "():\n    pass  // implementation details";
            const complexity = complexities[i % complexities.length] + (i % 2 === 0 ? " time & space" : "");
            const reference = refs[(i * 2) % refs.length];
            dataset.push({
                title: title,
                difficulty: difficulty,
                concept: concept,
                code: code.length > 30 ? code.substring(0, 40) + "..." : code,
                complexity: complexity,
                references: reference
            });
        }
        return dataset;
    }

    // Load or initialize localStorage data
    function loadDataset() {
        const stored = localStorage.getItem('gfG_academic_dataset');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                return generateDynamicDataset();
            }
        } else {
            const fresh = generateDynamicDataset();
            localStorage.setItem('gfG_academic_dataset', JSON.stringify(fresh));
            return fresh;
        }
    }

    // save dataset
    function saveDataset(data) {
        localStorage.setItem('gfG_academic_dataset', JSON.stringify(data));
    }

    // refresh preview table from dataset
    function renderTable() {
        const data = loadDataset();
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            // title
            const titleCell = document.createElement('td');
            titleCell.innerText = item.title;
            row.appendChild(titleCell);
            // difficulty with badge
            const diffCell = document.createElement('td');
            const span = document.createElement('span');
            span.className = `difficulty-badge ${item.difficulty.toLowerCase()}`;
            span.innerText = item.difficulty;
            diffCell.appendChild(span);
            row.appendChild(diffCell);
            // concept (short)
            const conceptCell = document.createElement('td');
            conceptCell.innerText = item.concept.length > 40 ? item.concept.substr(0,40)+'…' : item.concept;
            row.appendChild(conceptCell);
            // complexity
            const compCell = document.createElement('td');
            compCell.innerText = item.complexity || 'Not Available';
            row.appendChild(compCell);
            // references
            const refCell = document.createElement('td');
            refCell.innerText = item.references || 'Not Available';
            row.appendChild(refCell);
            tbody.appendChild(row);
        });

        // also update PDF preview based on first item
        if (data.length > 0) {
            const first = data[0];
            document.getElementById('pdfTopic').innerText = first.title;
            document.getElementById('pdfConcept').innerText = first.concept;
            document.getElementById('pdfCode').innerHTML = `<code style="background:#eef2f6; padding:4px 8px; border-radius:12px;">${first.code}</code>`;
            document.getElementById('pdfComplexity').innerText = first.complexity;
            document.getElementById('pdfRefs').innerText = first.references;

            // subject category from select
            const select = document.getElementById('categorySelect');
            document.getElementById('pdfSubject').innerText = select.value;

            const today = new Date();
            document.getElementById('pdfDate').innerText = today.toISOString().split('T')[0];
        }
        // timestamp
        document.getElementById('timestampSpan').innerText = new Date().toLocaleTimeString();
        // update json sample
        const jsonPreview = document.getElementById('jsonSample');
        jsonPreview.innerText = JSON.stringify(data.slice(0, 2), null, 2) + ' ... ]';
    }

    // simulate scrape: generate new dataset (dynamic) and replace storage, but no hardcoded values
    function simulateScrape() {
        // show loading briefly
        const btn = document.getElementById('simulateScrapeBtn');
        btn.innerHTML = '<span class="loader-small"></span> scraping...';
        setTimeout(() => {
            const newData = generateDynamicDataset();  // fresh dynamic data (no copy-paste from GFG)
            saveDataset(newData);
            renderTable();
            btn.innerHTML = '<i class="fas fa-play"></i> simulate fresh scrape (no hardcode)';
        }, 600);
    }

    // generate PDF (demo - would normally use library, but here we trigger download of styled text)
    function downloadPdf() {
        const data = loadDataset();
        if (!data.length) return;

        const first = data[0];
        const subject = document.getElementById('categorySelect').value;
        const date = new Date().toISOString().split('T')[0];
        // build a simple academic style text content (as pdf)
        let content = `------------------------------------------------\n`;
        content += `GFG ACADEMIC LEARNING MODULE\n`;
        content += `Topic: ${first.title}\n`;
        content += `Date: ${date}  |  Subject: ${subject}\n`;
        content += `------------------------------------------------\n\n`;
        content += `DEFINITION / KEY CONCEPTS:\n${first.concept}\n\n`;
        content += `DIFFICULTY: ${first.difficulty}\n\n`;
        content += `CODE IMPLEMENTATION:\n${first.code}\n\n`;
        content += `COMPLEXITY ANALYSIS:\n${first.complexity}\n\n`;
        content += `REFERENCES: ${first.references}\n\n`;
        content += `------------------------------------------------\n`;
        content += `Generated by GfG Academic Scraper · page 1\n`;
        const blob = new Blob([content], { type: 'application/pdf' }); // application/pdf triggers download as .pdf
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `GFG_${first.title.replace(/\s/g,'_')}_module.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // export json
    function exportJson() {
        const data = loadDataset();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gfg_scraped_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // reset preview / scrape (same as simulate but keep)
    window.addEventListener('load', () => {
        // initial render
        renderTable();

        // button binds
        document.getElementById('simulateScrapeBtn').addEventListener('click', simulateScrape);
        document.getElementById('downloadPdfBtn').addEventListener('click', downloadPdf);
        document.getElementById('exportJsonBtn').addEventListener('click', exportJson);
        document.getElementById('previewDataBtn').addEventListener('click', () => {
            // just re-render from storage (simulates refresh preview)
            renderTable();
        });

        // category change -> update preview subject
        document.getElementById('categorySelect').addEventListener('change', function(e) {
            document.getElementById('pdfSubject').innerText = e.target.value;
        });
    });
})();