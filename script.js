console.log("Script loaded successfully.");
// script.js - Reading Speed Test Application

class ReadingSpeedTest {
    constructor() {
        this.testData = null;
        this.currentLineIndex = 0;
        this.isTestRunning = false;
        this.displayTimer = null;
        this.pauseTimer = null;
        
        this.init();
    }
    
    init() {
        this.setupUI();
        this.attachEventListeners();
    }
    
    setupUI() {
        // Create main container
        const container = document.createElement('div');
        container.className = 'reading-test-container';
        container.innerHTML = `
            <div class="header">
                <h1>Reading Speed Test</h1>
            </div>
            
            <!-- Host Controls -->
            <div id="hostControls" class="section">
                <h2>Host Controls</h2>
                <div class="upload-area">
                    <input type="file" id="fileInput" accept=".txt" />
                    <label for="fileInput" class="file-label">
                        📁 Choose Text File
                    </label>
                    <div id="fileInfo" class="file-info"></div>
                </div>
                <button id="startTest" class="btn primary" disabled>Start Test</button>
                <button id="resetTest" class="btn secondary">Reset</button>
            </div>
            
            <!-- Test Information -->
            <div id="testInfo" class="section info-section" style="display: none;">
                <h3>Test Information</h3>
                <p>Level: <span id="levelDisplay"></span></p>
                <p>Total Lines: <span id="totalLines"></span></p>
                <p>Display Time per Line: <span id="displayTime"></span> seconds</p>
                <p>Writing Time: <span id="writingTime"></span> seconds</p>
            </div>
            
            <!-- Display Area -->
            <div id="displayArea" class="section display-section">
                <div id="lineDisplay" class="line-display">
                    <span id="displayText">Upload a file to begin</span>
                </div>
                <div id="progressBar" class="progress-bar" style="display: none;">
                    <div id="progressFill" class="progress-fill"></div>
                </div>
                <div id="statusText" class="status-text"></div>
            </div>
            
            <!-- Writing Area -->
            <div id="writingArea" class="section writing-section" style="display: none;">
                <h3>Write the sentence:</h3>
                <textarea id="writingInput" placeholder="Type the sentence here..." rows="4"></textarea>
                <div id="writingTimer" class="timer"></div>
            </div>
        `;
        
        document.body.appendChild(container);
        this.addStyles();
    }
    
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                padding: 20px;
            }
            
            .reading-test-container {
                max-width: 900px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                padding: 40px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .header h1 {
                color: #333;
                font-size: 2.5em;
                margin-bottom: 10px;
            }
            
            .section {
                margin-bottom: 30px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 10px;
            }
            
            .section h2, .section h3 {
                color: #555;
                margin-bottom: 15px;
            }
            
            .upload-area {
                margin-bottom: 20px;
            }
            
            #fileInput {
                display: none;
            }
            
            .file-label {
                display: inline-block;
                padding: 12px 24px;
                background: #667eea;
                color: white;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
                font-weight: 500;
            }
            
            .file-label:hover {
                background: #5a67d8;
                transform: translateY(-2px);
            }
            
            .file-info {
                margin-top: 15px;
                color: #666;
                font-size: 0.95em;
            }
            
            .btn {
                padding: 12px 30px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s;
                margin-right: 10px;
            }
            
            .btn.primary {
                background: #48bb78;
                color: white;
            }
            
            .btn.primary:hover:not(:disabled) {
                background: #38a169;
                transform: translateY(-2px);
            }
            
            .btn.secondary {
                background: #fc8181;
                color: white;
            }
            
            .btn.secondary:hover {
                background: #f56565;
                transform: translateY(-2px);
            }
            
            .btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .info-section {
                background: #e6fffa;
                border-left: 4px solid #48bb78;
            }
            
            .info-section p {
                margin: 8px 0;
                color: #2c5282;
            }
            
            .info-section span {
                font-weight: bold;
                color: #2b6cb1;
            }
            
            .display-section {
                background: #fff;
                border: 2px solid #e2e8f0;
                min-height: 200px;
                position: relative;
            }
            
            .line-display {
                font-size: 1.8em;
                text-align: center;
                padding: 40px;
                min-height: 150px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            #displayText {
                color: #2d3748;
                line-height: 1.6;
            }
            
            .progress-bar {
                height: 6px;
                background: #e2e8f0;
                border-radius: 3px;
                overflow: hidden;
                margin: 20px 0;
            }
            
            .progress-fill {
                height: 100%;
                background: #667eea;
                transition: width 0.3s;
                width: 0%;
            }
            
            .status-text {
                text-align: center;
                color: #718096;
                font-size: 0.95em;
                margin-top: 15px;
            }
            
            .writing-section {
                background: #fef5e7;
                border-left: 4px solid #f39c12;
            }
            
            #writingInput {
                width: 100%;
                padding: 15px;
                border: 2px solid #cbd5e0;
                border-radius: 8px;
                font-size: 16px;
                font-family: inherit;
                resize: vertical;
            }
            
            #writingInput:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .timer {
                margin-top: 15px;
                text-align: center;
                font-size: 1.2em;
                color: #e67e22;
                font-weight: bold;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .fade-in {
                animation: fadeIn 0.5s ease-out;
            }
        `;
        document.head.appendChild(style);
    }
    
    attachEventListeners() {
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileUpload(e));
        document.getElementById('startTest').addEventListener('click', () => this.startTest());
        document.getElementById('resetTest').addEventListener('click', () => this.resetTest());
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        if (!file.name.endsWith('.txt')) {
            alert('Please upload a .txt file');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.parseFileContent(content);
            
            // Update file info display
            document.getElementById('fileInfo').innerHTML = `
                ✅ File loaded: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(2)} KB)
            `;
        };
        
        reader.onerror = () => {
            alert('Error reading file');
        };
        
        reader.readAsText(file);
    }
    
    parseFileContent(content) {
        const lines = content.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
            alert('File must contain at least 2 lines (header + content)');
            return;
        }
        
        // Parse first line for metadata
        const firstLine = lines[0];
        const levelMatch = firstLine.match(/level:\s*(\w+)/i);
        const timeMatch = firstLine.match(/time:\s*(\d+),\s*(\d+)/i);
        
        if (!levelMatch || !timeMatch) {
            alert('Invalid file format. First line should be: level: a; time: b, c');
            return;
        }
        
        this.testData = {
            level: levelMatch[1],
            displayTime: parseInt(timeMatch[1]),
            writingTime: parseInt(timeMatch[2]),
            content: lines.slice(1)
        };
        
        // Update UI with test information
        this.updateTestInfo();
        document.getElementById('startTest').disabled = false;
        document.getElementById('displayText').textContent = 'Ready to start test';
    }
    
    updateTestInfo() {
        if (!this.testData) return;
        
        document.getElementById('testInfo').style.display = 'block';
        document.getElementById('levelDisplay').textContent = this.testData.level;
        document.getElementById('totalLines').textContent = this.testData.content.length;
        document.getElementById('displayTime').textContent = this.testData.displayTime;
        document.getElementById('writingTime').textContent = this.testData.writingTime;
    }
    
    startTest() {
        if (!this.testData || this.isTestRunning) return;
        
        this.isTestRunning = true;
        this.currentLineIndex = 0;
        
        document.getElementById('startTest').disabled = true;
        document.getElementById('fileInput').disabled = true;
        document.getElementById('progressBar').style.display = 'block';
        
        this.displayNextLine();
    }
    
    displayNextLine() {
        if (this.currentLineIndex >= this.testData.content.length) {
            this.completeTest();
            return;
        }
        
        const line = this.testData.content[this.currentLineIndex];
        const progressPercent = ((this.currentLineIndex + 1) / this.testData.content.length) * 100;
        
        // Update display
        document.getElementById('displayText').textContent = line;
        document.getElementById('displayText').classList.add('fade-in');
        document.getElementById('progressFill').style.width = `${progressPercent}%`;
        document.getElementById('statusText').textContent = `Line ${this.currentLineIndex + 1} of ${this.testData.content.length}`;
        
        // Show line for display time
        this.displayTimer = setTimeout(() => {
            this.startWritingPhase();
        }, this.testData.displayTime * 1000);
    }
    
    startWritingPhase() {
        document.getElementById('displayText').textContent = '✍️ Writing time...';
        document.getElementById('writingArea').style.display = 'block';
        document.getElementById('writingInput').value = '';
        document.getElementById('writingInput').focus();
        
        // Update writing timer countdown
        let remainingTime = this.testData.writingTime;
        const updateTimer = () => {
            document.getElementById('writingTimer').textContent = `Time remaining: ${remainingTime} seconds`;
            remainingTime--;
            
            if (remainingTime >= 0) {
                setTimeout(updateTimer, 1000);
            }
        };
        updateTimer();
        
        // Move to next line after writing time
        this.pauseTimer = setTimeout(() => {
            document.getElementById('writingArea').style.display = 'none';
            document.getElementById('displayText').classList.remove('fade-in');
            this.currentLineIndex++;
            this.displayNextLine();
        }, this.testData.writingTime * 1000);
    }
    
    completeTest() {
        this.isTestRunning = false;
        document.getElementById('displayText').textContent = '🎉 Test Complete!';
        document.getElementById('statusText').textContent = 'All lines have been displayed';
        document.getElementById('progressFill').style.width = '100%';
        document.getElementById('startTest').disabled = false;
        document.getElementById('fileInput').disabled = false;
    }
    
    resetTest() {
        clearTimeout(this.displayTimer);
        clearTimeout(this.pauseTimer);
        
        this.isTestRunning = false;
        this.currentLineIndex = 0;
        this.testData = null;
        
        document.getElementById('fileInput').value = '';
        document.getElementById('fileInfo').innerHTML = '';
        document.getElementById('testInfo').style.display = 'none';
        document.getElementById('displayText').textContent = 'Upload a file to begin';
        document.getElementById('progressBar').style.display = 'none';
        document.getElementById('progressFill').style.width = '0%';
        document.getElementById('writingArea').style.display = 'none';
        document.getElementById('statusText').textContent = '';
        document.getElementById('startTest').disabled = true;
        document.getElementById('fileInput').disabled = false;
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ReadingSpeedTest();
});

