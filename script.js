document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('lessonForm');
    const generateBtn = document.getElementById('generateBtn');
    const editBtn = document.getElementById('editBtn');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const generatedContent = document.getElementById('generatedContent');
    const btnText = generateBtn.querySelector('.btn-text');
    const loadingSpinner = generateBtn.querySelector('.loading-spinner');
    
    // Generate lesson plan
    generateBtn.addEventListener('click', generateLessonPlan);
    
    // Edit content
    editBtn.addEventListener('click', function() {
        const objectivesField = document.getElementById('behavioralObjectives');
        const summaryField = document.getElementById('summary');
        
        objectivesField.removeAttribute('readonly');
        summaryField.removeAttribute('readonly');
        
        objectivesField.style.background = '#fff';
        summaryField.style.background = '#fff';
        
        editBtn.textContent = 'Lock Editing';
        editBtn.onclick = lockEditing;
    });
    
    // Regenerate content
    regenerateBtn.addEventListener('click', generateLessonPlan);
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveLessonPlan();
    });
    
    async function generateLessonPlan() {
        const subject = document.getElementById('subject').value.trim();
        const topic = document.getElementById('topic').value.trim();
        const classLevel = document.getElementById('classLevel').value;
        
        // Validation
        if (!subject || !topic || !classLevel) {
            showError('Please fill in all fields before generating.');
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        hideError();
        
        try {
            const response = await fetch('/.netlify/functions/generate-lesson', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subject,
                    topic,
                    classLevel
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Populate form fields
            document.getElementById('behavioralObjectives').value = 
                data.behavioralObjectives.join('\n• ').replace(/^•/, '');
            document.getElementById('summary').value = data.summary;
            
            // Show generated content
            generatedContent.style.display = 'block';
            
            // Scroll to generated content
            generatedContent.scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Error generating lesson plan:', error);
            showError(`Failed to generate lesson plan: ${error.message}`);
        } finally {
            setLoadingState(false);
        }
    }
    
    function setLoadingState(isLoading) {
        generateBtn.disabled = isLoading;
        btnText.style.display = isLoading ? 'none' : 'inline';
        loadingSpinner.style.display = isLoading ? 'inline' : 'none';
    }
    
    function lockEditing() {
        const objectivesField = document.getElementById('behavioralObjectives');
        const summaryField = document.getElementById('summary');
        
        objectivesField.setAttribute('readonly', true);
        summaryField.setAttribute('readonly', true);
        
        objectivesField.style.background = '#f8f9fa';
        summaryField.style.background = '#f8f9fa';
        
        editBtn.textContent = 'Edit Content';
        editBtn.onclick = null;
        editBtn.addEventListener('click', arguments.callee.caller);
    }
    
    function saveLessonPlan() {
        // Here you can implement saving logic
        // For example, send to a database, localStorage, or download as file
        const lessonData = {
            subject: document.getElementById('subject').value,
            topic: document.getElementById('topic').value,
            classLevel: document.getElementById('classLevel').value,
            behavioralObjectives: document.getElementById('behavioralObjectives').value,
            summary: document.getElementById('summary').value,
            createdAt: new Date().toISOString()
        };
        
        // Save to localStorage as example
        localStorage.setItem('lessonPlan', JSON.stringify(lessonData));
        
        alert('Lesson plan saved successfully!');
    }
    
    function showError(message) {
        hideError();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.id = 'errorMessage';
        form.insertBefore(errorDiv, generateBtn);
    }
    
    function hideError() {
        const existingError = document.getElementById('errorMessage');
        if (existingError) {
            existingError.remove();
        }
    }
});