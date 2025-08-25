const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.genAI = null;
    this.isInitialized = false;
    
    try {
      if (process.env.GEMINI_API_KEY) {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.isInitialized = true;
      } else {
        console.warn('⚠️  GEMINI_API_KEY not found. AI features will be disabled.');
        console.warn('   Set GEMINI_API_KEY in your .env file to enable AI analysis.');
      }
    } catch (error) {
      console.error('❌ Error initializing Gemini AI:', error.message);
      this.isInitialized = false;
    }
  }

  /**
   * Analyze images with AI and generate descriptions
   * @param {Array} imageUrls - Array of image URLs
   * @returns {Array} Array of objects with imageUrl, imageNumber, and description
   */
  async analyzeImagesWithAI(imageUrls) {
    try {
      if (!this.isInitialized) {
        // Return mock descriptions if AI is not available
        return imageUrls.map((url, index) => ({
          imageUrl: url,
          imageNumber: index + 1,
          description: `Professional image ${index + 1} showcasing quality and style.`
        }));
      }

      const imageDescriptions = [];
      
      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];
        const description = await this.analyzeSingleImage(imageUrl);
        
        imageDescriptions.push({
          imageUrl: imageUrl,
          imageNumber: i + 1,
          description: description
        });
      }

      return imageDescriptions;
    } catch (error) {
      console.error('Error analyzing images with AI:', error);
      // Fallback to mock descriptions
      return imageUrls.map((url, index) => ({
        imageUrl: url,
        imageNumber: index + 1,
        description: `Professional image ${index + 1} showcasing quality and style.`
      }));
    }
  }

  /**
   * Analyze title and description to generate enhanced versions
   * @param {string} title - User's input title
   * @param {string} description - User's input description
   * @returns {Object} Object with enhanced title and description
   */
  async analyzeAllImagesTogether(title, description) {
    try {
      if (!this.isInitialized) {
        return {
          enhancedTitle: title,
          enhancedDescription: description
        };
      }

      // Generate enhanced title and description using Gemini
      const enhancedContent = await this.generateEnhancedContentWithGemini(title, description);
      
      return enhancedContent;
    } catch (error) {
      console.error('Error analyzing title and description:', error);
      return {
        enhancedTitle: title,
        enhancedDescription: description
      };
    }
  }

  /**
   * Analyze a single image URL and generate a description
   * @param {string} imageUrl - Image URL
   * @returns {string} AI-generated description
   */
  async analyzeSingleImage(imageUrl) {
    try {
      if (!this.isInitialized) {
        return `Professional image showcasing quality and style.`;
      }

      // Generate description using Gemini with image URL
      const description = await this.generateDescriptionWithGemini(imageUrl);
      
      return description;
    } catch (error) {
      console.error('Error analyzing single image:', error);
      return `Professional image showcasing quality and style.`;
    }
  }

  /**
   * Generate description using Gemini AI
   * @param {string} imageUrl - Image URL
   * @returns {string} Generated description
   */
  async generateDescriptionWithGemini(imageUrl) {
    try {
      if (!this.genAI) {
        throw new Error('Gemini AI not initialized');
      }

      // Try different Gemini models
      const modelsToTry = [
        'gemini-1.5-flash'
      ];

      let lastError = null;
      
      for (const modelName of modelsToTry) {
        try {
          console.log(`🔄 Trying Gemini model: ${modelName}`);
          const model = this.genAI.getGenerativeModel({ model: modelName });

          const prompt = `
            Analyze this image: ${imageUrl}
            Provide a concise, professional description in exactly 20 words. 
            Focus on the main subject, style, mood, and any notable features that would be relevant for a brochure.
            Be descriptive but concise. Return only the description, no additional text.
          `;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const description = response.text().trim();

          console.log(`✅ Successfully used model: ${modelName}`);

          // Ensure description is approximately 20 words
          const wordCount = description.split(/\s+/).length;
          if (wordCount > 25) {
            // Truncate if too long
            const words = description.split(/\s+/).slice(0, 20);
            return words.join(' ') + '...';
          }

          return description;
        } catch (modelError) {
          console.log(`❌ Model ${modelName} failed: ${modelError.message}`);
          lastError = modelError;
          continue; // Try next model
        }
      }

      // If all models failed, throw the last error
      throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
      
    } catch (error) {
      console.error('Error generating description with Gemini:', error);
      return 'Professional image showcasing quality and style.';
    }
  }

  /**
   * Generate enhanced title and description using Gemini AI
   * @param {string} title - User's input title
   * @param {string} description - User's input description
   * @returns {Object} Object with enhanced title and description
   */
  async generateEnhancedContentWithGemini(title, description) {
    try {
      if (!this.genAI) {
        throw new Error('Gemini AI not initialized');
      }

      // Try different Gemini models
      const modelsToTry = [
        'gemini-1.5-flash'
      ];

      let lastError = null;
      
      for (const modelName of modelsToTry) {
        try {
          console.log(`🔄 Trying Gemini model: ${modelName}`);
          const model = this.genAI.getGenerativeModel({ model: modelName });

          const prompt = `
            Enhance the following title and description to make them more professional, engaging, and suitable for a brochure:

            Original Title: ${title}
            Original Description: ${description}

            Requirements:
            1. Create a compelling, professional title (15-25 words)
            2. Create a detailed, engaging description (50-100 words)
            3. Make it suitable for a business brochure
            4. Keep the original meaning but enhance the language
            5. Return in this exact format:
               Enhanced Title: [your enhanced title]
               Enhanced Description: [your enhanced description]
          `;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const content = response.text().trim();

          console.log(`✅ Successfully used model: ${modelName}`);

          // Parse the response to extract title and description
          const enhancedTitle = this.extractEnhancedTitle(content);
          const enhancedDescription = this.extractEnhancedDescription(content);

          return {
            enhancedTitle: enhancedTitle || title,
            enhancedDescription: enhancedDescription || description
          };

        } catch (modelError) {
          console.log(`❌ Model ${modelName} failed: ${modelError.message}`);
          lastError = modelError;
          continue; // Try next model
        }
      }

      // If all models failed, throw the last error
      throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
      
    } catch (error) {
      console.error('Error generating enhanced content with Gemini:', error);
      return {
        enhancedTitle: title,
        enhancedDescription: description
      };
    }
  }

  /**
   * Extract enhanced title from AI response
   * @param {string} content - AI response content
   * @returns {string} Enhanced title
   */
  extractEnhancedTitle(content) {
    const titleMatch = content.match(/Enhanced Title:\s*(.+?)(?:\n|Enhanced Description:|$)/i);
    return titleMatch ? titleMatch[1].trim() : null;
  }

  /**
   * Extract enhanced description from AI response
   * @param {string} content - AI response content
   * @returns {string} Enhanced description
   */
  extractEnhancedDescription(content) {
    const descMatch = content.match(/Enhanced Description:\s*(.+?)(?:\n|$)/i);
    return descMatch ? descMatch[1].trim() : null;
  }

  /**
   * Final analysis: Combine enhanced content with image analysis for optimal brochure layout
   * @param {Object} enhancedContent - Enhanced title and description
   * @param {Array} aiDescriptions - Array of image descriptions with URLs
   * @returns {Object} Final optimized brochure content with image positioning
   */
  async finalizeBrochureContent(enhancedContent, aiDescriptions) {
    try {
      if (!this.isInitialized) {
        return {
          finalTitle: enhancedContent.enhancedTitle,
          finalDescription: enhancedContent.enhancedDescription,
          imageLayout: aiDescriptions.map((img, index) => ({
            ...img,
            suggestedPosition: index + 1
          }))
        };
      }

      // Generate final optimized content using Gemini
      const finalContent = await this.generateFinalBrochureContent(enhancedContent, aiDescriptions);
      
      return finalContent;
    } catch (error) {
      console.error('Error finalizing brochure content:', error);
      return {
        finalTitle: enhancedContent.enhancedTitle,
        finalDescription: enhancedContent.enhancedDescription,
        imageLayout: aiDescriptions.map((img, index) => ({
          ...img,
          suggestedPosition: index + 1
        }))
      };
    }
  }

  /**
   * Generate final brochure content with optimal image positioning
   * @param {Object} enhancedContent - Enhanced title and description
   * @param {Array} aiDescriptions - Array of image descriptions with URLs
   * @returns {Object} Final optimized brochure content
   */
  async generateFinalBrochureContent(enhancedContent, aiDescriptions) {
    try {
      if (!this.genAI) {
        throw new Error('Gemini AI not initialized');
      }

      // Try different Gemini models
      const modelsToTry = [
        'gemini-1.5-flash',
      ];

      let lastError = null;
      
      for (const modelName of modelsToTry) {
        try {
          console.log(`🔄 Trying Gemini model: ${modelName} for final optimization`);
          const model = this.genAI.getGenerativeModel({ model: modelName });

          // Create detailed prompt for final analysis
          const imageDetails = aiDescriptions.map((img, index) => 
            `Image ${index + 1}: ${img.imageUrl}\n   AI Description: ${img.description}`
          ).join('\n\n');

          const prompt = `
            You are a professional brochure designer. Analyze the following content and optimize it for the best brochure layout:

            ENHANCED CONTENT:
            Title: ${enhancedContent.enhancedTitle}
            Description: ${enhancedContent.enhancedDescription}

            IMAGE ANALYSIS:
            ${imageDetails}

            TASK: Create the final optimized brochure content by:
            1. Refine the title and description if needed
            2. Analyze each image and suggest the best order/position
            3. Explain why each image fits in that position
            4. Ensure the flow makes sense for a professional brochure

            Return in this exact format:
            FINAL TITLE: [optimized title]
            FINAL DESCRIPTION: [optimized description]
            IMAGE LAYOUT:
            Position 1: [image number] - [why it fits here]
            Position 2: [image number] - [why it fits here]
            Position 3: [image number] - [why it fits here]
            [continue for all images]
          `;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const content = response.text().trim();

          console.log(`✅ Successfully used model: ${modelName} for final optimization`);

          // Parse the response to extract final content
          const finalContent = this.parseFinalBrochureContent(content, aiDescriptions);

          return finalContent;

        } catch (modelError) {
          console.log(`❌ Model ${modelName} failed: ${modelError.message}`);
          lastError = modelError;
          continue; // Try next model
        }
      }

      // If all models failed, throw the last error
      throw new Error(`All Gemini models failed for final optimization. Last error: ${lastError?.message}`);
      
    } catch (error) {
      console.error('Error generating final brochure content with Gemini:', error);
      return {
        finalTitle: enhancedContent.enhancedTitle,
        finalDescription: enhancedContent.enhancedDescription,
        imageLayout: aiDescriptions.map((img, index) => ({
          ...img,
          suggestedPosition: index + 1,
          reasoning: 'Default positioning'
        }))
      };
    }
  }

  /**
   * Parse the final brochure content from AI response
   * @param {string} content - AI response content
   * @param {Array} aiDescriptions - Original image descriptions
   * @returns {Object} Parsed final content
   */
  parseFinalBrochureContent(content, aiDescriptions) {
    try {
      // Extract final title
      const titleMatch = content.match(/FINAL TITLE:\s*(.+?)(?:\n|FINAL DESCRIPTION:|$)/i);
      const finalTitle = titleMatch ? titleMatch[1].trim() : 'Enhanced Title';

      // Extract final description
      const descMatch = content.match(/FINAL DESCRIPTION:\s*(.+?)(?:\n|IMAGE LAYOUT:|$)/i);
      const finalDescription = descMatch ? descMatch[1].trim() : 'Enhanced Description';

      // Extract image layout
      const layoutMatches = content.match(/Position \d+:\s*(\d+)\s*-\s*(.+?)(?:\n|Position \d+:|$)/gi);
      
      let imageLayout = aiDescriptions.map((img, index) => ({
        ...img,
        suggestedPosition: index + 1,
        reasoning: 'Default positioning'
      }));

      if (layoutMatches) {
        layoutMatches.forEach(match => {
          const posMatch = match.match(/Position (\d+):\s*(\d+)\s*-\s*(.+)/i);
          if (posMatch) {
            const position = parseInt(posMatch[1]);
            const imageNumber = parseInt(posMatch[2]);
            const reasoning = posMatch[3].trim();
            
            if (imageNumber > 0 && imageNumber <= aiDescriptions.length) {
              imageLayout[imageNumber - 1] = {
                ...imageLayout[imageNumber - 1],
                suggestedPosition: position,
                reasoning: reasoning
              };
            }
          }
        });
      }

      return {
        finalTitle,
        finalDescription,
        imageLayout
      };

    } catch (error) {
      console.error('Error parsing final brochure content:', error);
      return {
        finalTitle: 'Enhanced Title',
        finalDescription: 'Enhanced Description',
        imageLayout: aiDescriptions.map((img, index) => ({
          ...img,
          suggestedPosition: index + 1,
          reasoning: 'Default positioning'
        }))
      };
    }
  }
}

// Create and export instance
const aiService = new AIService();

module.exports = {
  analyzeImagesWithAI: (imageUrls) => aiService.analyzeImagesWithAI(imageUrls),
  analyzeAllImagesTogether: (title, description) => aiService.analyzeAllImagesTogether(title, description),
  finalizeBrochureContent: (enhancedContent, aiDescriptions) => aiService.finalizeBrochureContent(enhancedContent, aiDescriptions)
};
