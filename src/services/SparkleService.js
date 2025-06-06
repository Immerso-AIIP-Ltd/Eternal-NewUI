// src/services/SparkleService.js
/**
 * Global service for creating sparkle effects across the application
 */
class SparkleService {
    constructor() {
      this.isInitialized = false;
      this.mouseMoveHandler = this.handleMouseMove.bind(this);
    }
    
    /**
     * Initialize the sparkle service
     */
    init() {
      if (this.isInitialized) return;
      
      // Add event listener for mouse movement
      document.addEventListener('mousemove', this.mouseMoveHandler);
      this.isInitialized = true;
      
      // Create a container for sparkles if it doesn't exist
      if (!document.getElementById('sparkle-container')) {
        const container = document.createElement('div');
        container.id = 'sparkle-container';
        container.style.position = 'fixed';
        container.style.top = '0';
        container.style.left = '0';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
      }
      
      // Start creating random sparkles (reduced frequency)
      this.startRandomSparkles();
    }
    
    /**
     * Clean up event listeners
     */
    cleanup() {
      document.removeEventListener('mousemove', this.mouseMoveHandler);
      this.isInitialized = false;
      
      if (this.randomSparkleInterval) {
        clearInterval(this.randomSparkleInterval);
      }
      
      // Remove the sparkle container
      const container = document.getElementById('sparkle-container');
      if (container) {
        document.body.removeChild(container);
      }
    }
    
    /**
     * Handle mouse movement to create sparkles
     */
    handleMouseMove(e) {
      if (Math.random() < 0.03) { // Reduced from 0.05 to 0.03 (3% chance)
        this.createSparkle(e.clientX, e.clientY);
      }
    }
    
    /**
     * Create a sparkle at a specific position
     */
    createSparkle(x, y) {
      const container = document.getElementById('sparkle-container');
      if (!container) return;
      
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      container.appendChild(sparkle);
      
      // Remove sparkle after animation completes
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 3000);
    }
    
    /**
     * Start creating random sparkles across the screen
     */
    startRandomSparkles() {
      this.randomSparkleInterval = setInterval(() => {
        // Create 1-2 random sparkles (reduced from 2-5)
        const count = Math.floor(Math.random() * 2) + 1;
        
        for (let i = 0; i < count; i++) {
          const x = Math.random() * window.innerWidth;
          const y = Math.random() * window.innerHeight;
          
          // Small delay between each sparkle
          setTimeout(() => {
            this.createSparkle(x, y);
          }, i * 200);
        }
      }, 1500); // Every 1.5 seconds (increased interval time)
    }
    
    /**
     * Create a few sparkles at once (for special effects)
     */
    createSparkleCluster(x, y, count = 3) { // Reduced from 10 to 3
      for (let i = 0; i < count; i++) {
        // Create sparkles in a small area around the point
        const offsetX = (Math.random() - 0.5) * 50; // Reduced from 100 to 50
        const offsetY = (Math.random() - 0.5) * 50; // Reduced from 100 to 50
        
        setTimeout(() => {
          this.createSparkle(x + offsetX, y + offsetY);
        }, i * 50);
      }
    }
  }
  
  // Export singleton instance
  export default new SparkleService();