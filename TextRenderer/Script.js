// Event delegation: listen on the document or a container
document.addEventListener("click", (e) => {
    // Check if the clicked element has the popup-btn class
    if (e.target.classList.contains("popup-trigger")) {
        const button = e.target;

        // Get parameters from data attributes, with defaults
        const emoji = button.getAttribute('data-emoji') || '';
        const title = button.getAttribute('data-title') || '';
        const description = button.getAttribute('data-description') || '';

    // Create notification container
    const notification = document.createElement('div');
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            background: 'linear-gradient(135deg, #242424, #555)',
            borderRadius: '10px',
            padding: '18px 32px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            color: '#fff',
            fontSize: '1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateY(32px)',
            transition: 'opacity 0.3s, transform 0.3s'
        });

    // Notification content
    notification.innerHTML = `
            <span style="font-size:2rem;">${emoji}</span>
        <span>
                <strong>${title}</strong>
            <br>
                <span style="font-size:0.95rem;">${description}</span>
        </span>
            <button class="closeNotification" style="
            margin-left:18px;
            background:none;
            border:none;
            color:#fff;
            font-size:1.3rem;
            cursor:pointer;
            border-radius:4px;
            outline:none;
            padding:4px;
            transition: background 0.18s;
        " title="Close">&times;</button>
    `;

        document.body.appendChild(notification);

        // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

        // Auto-close after 3 seconds
        let autoRemove = setTimeout(() => closeNotification(), 3000);

        // Close function
        function closeNotification() {
        clearTimeout(autoRemove);
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(32px)';
        setTimeout(() => {
            if (notification.parentNode) notification.parentNode.removeChild(notification);
        }, 300);
        }

        // Close button
        notification.querySelector(".closeNotification").addEventListener("click", closeNotification);
    }
});

// ============================================
// 2D Grid and Bresenham's Line Algorithm
// ============================================

// Create a 2D grid: 128 spaces wide, 48 spaces tall (96p half height resolution)
// Grid is accessed as grid[y][x] where y is row (0-143) and x is column (0-255)
const GRID_WIDTH = 128;
const GRID_HEIGHT = 48;
const grid = [];

// Initialize the grid with empty spaces
function initializeGrid(targetGrid) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
        targetGrid[y] = [];
        for (let x = 0; x < GRID_WIDTH; x++) {
            targetGrid[y][x] = '  '; // Empty space
        }
    }
}

/**
 * Bresenham's line algorithm to draw a line between two points
 * @param {number} x0 - Starting x coordinate (0-853)
 * @param {number} y0 - Starting y coordinate (0-479)
 * @param {number} x1 - Ending x coordinate (0-853)
 * @param {number} y1 - Ending y coordinate (0-479)
 * @param {string} symbol - Symbol to use for drawing (default: '■')
 * @param {Array} targetGrid - Grid array to draw on (defaults to main grid)
 */
function drawLine(x0, y0, x1, y1, symbol = '■', targetGrid = grid) {
    // Clamp coordinates to grid bounds
    x0 = Math.max(0, Math.min(Math.floor(x0), GRID_WIDTH - 1));
    y0 = Math.max(0, Math.min(Math.floor(y0), GRID_HEIGHT - 1));
    x1 = Math.max(0, Math.min(Math.floor(x1), GRID_WIDTH - 1));
    y1 = Math.max(0, Math.min(Math.floor(y1), GRID_HEIGHT - 1));

    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    let x = x0;
    let y = y0;

    while (true) {
        // Set the symbol at current position
        targetGrid[y][x] = symbol;

        // Check if we've reached the end point
        if (x === x1 && y === y1) break;

        const e2 = 2 * err;
        
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }
}

// ============================================
// Grid Display and Rendering
// ============================================

let gridContainer = null;
let renderTimeout = null;

/**
 * Create the grid display container in the DOM
 */
function createGridDisplay() {
    // Check if we're on the game page
    if (!document.body.classList.contains('GamePage')) {
        return;
    }

    // Create container if it doesn't exist
    if (!gridContainer) {
        gridContainer = document.createElement('div');
        gridContainer.id = 'grid-display';
        Object.assign(gridContainer.style, {
            fontFamily: 'monospace',
            fontSize: 'min(calc(100vw / 128), calc(100vh / 48))',
            lineHeight: '1',
            whiteSpace: 'pre',
            color: '#fff',
            backgroundColor: '#000',
            padding: '0',
            margin: '0',
            overflow: 'hidden',
            width: '100vw',
            height: '100vh',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        
        // Create inner wrapper for proper centering
        const innerWrapper = document.createElement('div');
        innerWrapper.style.textAlign = 'left';
        gridContainer.appendChild(innerWrapper);
        
        document.body.appendChild(gridContainer);
    }
}

// Variable to hold the grid reference for rendering
let gridToRender = grid;

/**
 * Render the grid to the DOM
 */
function renderGrid() {
    if (!gridContainer) {
        createGridDisplay();
    }
    
    if (!gridContainer) {
        return; // Not on game page or container creation failed
    }

    // Build the grid string row by row
    let gridString = '';
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const cell = gridToRender[y] && gridToRender[y][x] !== undefined ? gridToRender[y][x] : ' ';
            gridString += cell || ' '; // Use space if empty
        }
        gridString += '\n';
    }

    // Use inner wrapper if it exists, otherwise use container directly
    const targetElement = gridContainer.querySelector('div') || gridContainer;
    targetElement.textContent = gridString;
}

/**
 * Schedule a render (debounced to avoid excessive re-renders)
 */
function scheduleRender() {
    if (renderTimeout) {
        clearTimeout(renderTimeout);
    }
    renderTimeout = setTimeout(() => {
        renderGrid();
        renderTimeout = null;
    }, 0);
}

/**
 * Create a proxy wrapper for the grid to detect changes
 */
function createGridProxy() {
    return new Proxy(grid, {
        set(target, property, value) {
            const result = Reflect.set(target, property, value);
            if (typeof property === 'string' && !isNaN(property)) {
                scheduleRender();
            }
            return result;
        },
        get(target, property) {
            const value = Reflect.get(target, property);
            if (typeof property === 'string' && !isNaN(property) && Array.isArray(value)) {
                // Return a proxy for the row array as well
                return new Proxy(value, {
                    set(rowTarget, rowProperty, rowValue) {
                        const rowResult = Reflect.set(rowTarget, rowProperty, rowValue);
                        scheduleRender();
                        return rowResult;
                    }
                });
            }
            return value;
        }
    });
}

// Replace grid with proxied version for auto-rendering
const proxiedGrid = createGridProxy();
gridToRender = proxiedGrid; // Update render reference

// Re-initialize through proxy to ensure it's set up correctly
initializeGrid(proxiedGrid);

// Override drawLine to trigger render after drawing
const originalDrawLine = drawLine;
function drawLineWithRender(x0, y0, x1, y1, symbol = '■') {
    originalDrawLine(x0, y0, x1, y1, symbol, proxiedGrid);
    // Render is already scheduled by proxy, but we can also call it directly for immediate update
    scheduleRender();
}

// Initialize display when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        createGridDisplay();
        renderGrid();
    });
} else {
    createGridDisplay();
    renderGrid();
}

// Make functions available globally
window.grid = proxiedGrid;
window.drawLine = drawLineWithRender;
window.renderGrid = renderGrid;
window.GRID_WIDTH = GRID_WIDTH;
window.GRID_HEIGHT = GRID_HEIGHT;


// ============================================
// Prim's Maze Algorithm
// ============================================

const MAZE_SIZE = 100;
const maze = [];

/**
 * Initialize the maze with all walls (1)
 */
function initializeMaze() {
    for (let y = 0; y < MAZE_SIZE; y++) {
        maze[y] = [];
        for (let x = 0; x < MAZE_SIZE; x++) {
            maze[y][x] = 1; // All walls initially
        }
    }
}

/**
 * Get neighboring cells (up, down, left, right)
 */
function getNeighbors(x, y) {
    const neighbors = [];
    const directions = [
        [0, -1], // up
        [0, 1],  // down
        [-1, 0], // left
        [1, 0]   // right
    ];
    
    for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < MAZE_SIZE && ny >= 0 && ny < MAZE_SIZE) {
            neighbors.push([nx, ny]);
        }
    }
    return neighbors;
}

/**
 * Get adjacent passage cells (cells that are 0)
 */
function getAdjacentPassages(x, y) {
    const passages = [];
    const neighbors = getNeighbors(x, y);
    for (const [nx, ny] of neighbors) {
        if (maze[ny][nx] === 0) {
            passages.push([nx, ny]);
        }
    }
    return passages;
}

/**
 * Generate a maze using Recursive Backtracking algorithm
 * This creates a proper maze with walls and passages
 */
function generateMaze() {
    // Initialize maze with all walls
    initializeMaze();
    
    // Visited cells tracker
    const visited = [];
    for (let y = 0; y < MAZE_SIZE; y++) {
        visited[y] = [];
        for (let x = 0; x < MAZE_SIZE; x++) {
            visited[y][x] = false;
        }
    }
    
    // Stack for backtracking
    const stack = [];
    
    // Start from a random cell (avoid borders)
    const startX = Math.floor(Math.random() * (MAZE_SIZE - 2)) + 1;
    const startY = Math.floor(Math.random() * (MAZE_SIZE - 2)) + 1;
    
    // Mark starting cell as visited and passage
    visited[startY][startX] = true;
    maze[startY][startX] = 0;
    stack.push([startX, startY]);
    
    // Directions: up, down, left, right
    const directions = [
        [0, -1], // up
        [0, 1],  // down
        [-1, 0], // left
        [1, 0]   // right
    ];
    
    while (stack.length > 0) {
        const [currentX, currentY] = stack[stack.length - 1];
        
        // Get unvisited neighbors
        const unvisitedNeighbors = [];
        for (const [dx, dy] of directions) {
            const nextX = currentX + dx * 2; // Step 2 cells away (skip wall)
            const nextY = currentY + dy * 2;
            
            if (nextX >= 1 && nextX < MAZE_SIZE - 1 && 
                nextY >= 1 && nextY < MAZE_SIZE - 1 && 
                !visited[nextY][nextX]) {
                unvisitedNeighbors.push([nextX, nextY, dx, dy]);
            }
        }
        
        if (unvisitedNeighbors.length > 0) {
            // Pick a random unvisited neighbor
            const [nextX, nextY, dx, dy] = unvisitedNeighbors[
                Math.floor(Math.random() * unvisitedNeighbors.length)
            ];
            
            // Remove wall between current and next
            const wallX = currentX + dx;
            const wallY = currentY + dy;
            maze[wallY][wallX] = 0;
            
            // Mark next as visited and make it a passage
            visited[nextY][nextX] = true;
            maze[nextY][nextX] = 0;
            
            // Push to stack
            stack.push([nextX, nextY]);
        } else {
            // Backtrack
            stack.pop();
        }
    }
    
    // Ensure outer borders are walls
    for (let x = 0; x < MAZE_SIZE; x++) {
        maze[0][x] = 1; // Top border
        maze[MAZE_SIZE - 1][x] = 1; // Bottom border
    }
    for (let y = 0; y < MAZE_SIZE; y++) {
        maze[y][0] = 1; // Left border
        maze[y][MAZE_SIZE - 1] = 1; // Right border
    }
}

// Initialize and generate the maze
generateMaze();

// ============================================
// Camera/Player Position System
// ============================================

// Camera position in maze coordinates (using floating point for smooth movement)
let cameraX = 1.5;
let cameraY = 1.5;
let cameraAngle = 0; // Camera rotation angle in radians (0 = facing right/east)

// Camera settings
const FOV = Math.PI / 3; // Field of view (60 degrees)
const MOVE_SPEED = 0.1;
const ROTATION_SPEED = 0.1;

/**
 * Set camera position (clamped to valid maze coordinates)
 */
function setCameraPosition(x, y) {
    cameraX = Math.max(0.5, Math.min(x, MAZE_SIZE - 0.5));
    cameraY = Math.max(0.5, Math.min(y, MAZE_SIZE - 0.5));
    renderMazeToGrid();
}

/**
 * Move camera forward/backward relative to camera angle
 */
function moveCameraForward(distance, immediateRender = false) {
    const newX = cameraX + Math.cos(cameraAngle) * distance;
    const newY = cameraY + Math.sin(cameraAngle) * distance;
    
    // Check if we can move (not into a wall)
    const cellX = Math.floor(newX);
    const cellY = Math.floor(newY);
    if (cellX >= 0 && cellX < MAZE_SIZE && cellY >= 0 && cellY < MAZE_SIZE) {
        if (maze[cellY][cellX] === 0) {
            cameraX = Math.max(0.5, Math.min(newX, MAZE_SIZE - 0.5));
            cameraY = Math.max(0.5, Math.min(newY, MAZE_SIZE - 0.5));
            if (immediateRender) {
                renderMazeToGrid();
            } else {
                setCameraPosition(cameraX, cameraY);
            }
        }
    }
}

/**
 * Strafe camera left/right relative to camera angle
 */
function strafeCamera(distance, immediateRender = false) {
    const strafeAngle = cameraAngle + Math.PI / 2; // Perpendicular to camera direction
    const newX = cameraX + Math.cos(strafeAngle) * distance;
    const newY = cameraY + Math.sin(strafeAngle) * distance;
    
    const cellX = Math.floor(newX);
    const cellY = Math.floor(newY);
    if (cellX >= 0 && cellX < MAZE_SIZE && cellY >= 0 && cellY < MAZE_SIZE) {
        if (maze[cellY][cellX] === 0) {
            cameraX = Math.max(0.5, Math.min(newX, MAZE_SIZE - 0.5));
            cameraY = Math.max(0.5, Math.min(newY, MAZE_SIZE - 0.5));
            if (immediateRender) {
                renderMazeToGrid();
            } else {
                setCameraPosition(cameraX, cameraY);
            }
        }
    }
}

/**
 * Rotate camera
 */
function rotateCamera(angleDelta, immediate = true) {
    cameraAngle += angleDelta;
    // Normalize angle to 0-2π range
    cameraAngle = ((cameraAngle % (Math.PI * 2)) + (Math.PI * 2)) % (Math.PI * 2);
    renderMazeToGrid(immediate);
}

// ============================================
// Maze Rendering to Grid
// ============================================

/**
 * Cast a ray and return distance to wall
 * Uses DDA (Digital Differential Analyzer) algorithm
 */
function castRay(angle) {
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    
    // Handle edge cases (vertical/horizontal rays)
    if (Math.abs(dx) < 0.0001) {
        // Vertical ray
        const stepY = dy > 0 ? 1 : -1;
        let mapY = Math.floor(cameraY);
        if (stepY > 0) mapY += 1;
        
        while (mapY >= 0 && mapY < MAZE_SIZE) {
            const mapX = Math.floor(cameraX);
            if (mapX < 0 || mapX >= MAZE_SIZE) break;
            if (maze[mapY][mapX] === 1) {
                return Math.abs((mapY - cameraY) / dy);
            }
            mapY += stepY;
        }
        return 1000; // Max distance
    }
    
    if (Math.abs(dy) < 0.0001) {
        // Horizontal ray
        const stepX = dx > 0 ? 1 : -1;
        let mapX = Math.floor(cameraX);
        if (stepX > 0) mapX += 1;
        
        while (mapX >= 0 && mapX < MAZE_SIZE) {
            const mapY = Math.floor(cameraY);
            if (mapY < 0 || mapY >= MAZE_SIZE) break;
            if (maze[mapY][mapX] === 1) {
                return Math.abs((mapX - cameraX) / dx);
            }
            mapX += stepX;
        }
        return 1000; // Max distance
    }
    
    // Current position
    let x = cameraX;
    let y = cameraY;
    
    // Step size and direction
    const deltaDistX = Math.abs(1 / dx);
    const deltaDistY = Math.abs(1 / dy);
    
    let stepX, stepY;
    let sideDistX, sideDistY;
    
    // Determine which direction to step
    if (dx < 0) {
        stepX = -1;
        sideDistX = (x - Math.floor(x)) * deltaDistX;
    } else {
        stepX = 1;
        sideDistX = (Math.floor(x) + 1.0 - x) * deltaDistX;
    }
    
    if (dy < 0) {
        stepY = -1;
        sideDistY = (y - Math.floor(y)) * deltaDistY;
    } else {
        stepY = 1;
        sideDistY = (Math.floor(y) + 1.0 - y) * deltaDistY;
    }
    
    // DDA algorithm
    let mapX = Math.floor(x);
    let mapY = Math.floor(y);
    let hit = false;
    let side = 0; // 0 = x-side, 1 = y-side
    
    while (!hit) {
        // Jump to next map square
        if (sideDistX < sideDistY) {
            sideDistX += deltaDistX;
            mapX += stepX;
            side = 0;
        } else {
            sideDistY += deltaDistY;
            mapY += stepY;
            side = 1;
        }
        
        // Check if we hit a wall
        if (mapX < 0 || mapX >= MAZE_SIZE || mapY < 0 || mapY >= MAZE_SIZE) {
            hit = true;
        } else if (maze[mapY][mapX] === 1) {
            hit = true;
        }
    }
    
    // Calculate distance
    let perpWallDist;
    if (side === 0) {
        perpWallDist = (mapX - x + (1 - stepX) / 2) / dx;
    } else {
        perpWallDist = (mapY - y + (1 - stepY) / 2) / dy;
    }
    
    return Math.abs(perpWallDist);
}

/**
 * Render first-person view using raycasting
 */
function renderMazeToGrid(immediate = false) {
    // Clear the grid first
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            proxiedGrid[y][x] = ' ';
        }
    }
    
    // For each column of the screen, cast a ray
    for (let screenX = 0; screenX < GRID_WIDTH; screenX++) {
        // Calculate ray angle (camera plane)
        const cameraX = 2 * screenX / GRID_WIDTH - 1; // -1 to 1
        const rayAngle = cameraAngle + Math.atan(cameraX * Math.tan(FOV / 2));
        
        // Cast ray and get distance
        const distance = castRay(rayAngle);
        
        // Calculate wall height (fisheye correction already done in castRay)
        const lineHeight = Math.floor(GRID_HEIGHT / (distance + 0.0001)); // Avoid division by zero
        
        // Calculate where to draw the line
        const drawStart = Math.max(0, Math.floor((GRID_HEIGHT - lineHeight) / 2));
        const drawEnd = Math.min(GRID_HEIGHT - 1, Math.floor((GRID_HEIGHT + lineHeight) / 2));
        
        // Choose symbol based on distance for depth effect
        let symbol;
        if (distance < 1) {
            symbol = '█';
        } else if (distance < 2) {
            symbol = '▓';
        } else if (distance < 3) {
            symbol = '▒';
        } else if (distance < 5) {
            symbol = '░';
        } else {
            symbol = '·';
        }
        
        // Draw the vertical line
        for (let y = drawStart; y <= drawEnd; y++) {
            if (y >= 0 && y < GRID_HEIGHT) {
                proxiedGrid[y][screenX] = symbol;
            }
        }
    }
    
    // Trigger render (immediate or debounced)
    if (immediate) {
        // Clear any pending debounced render
        if (renderTimeout) {
            clearTimeout(renderTimeout);
            renderTimeout = null;
        }
        renderGrid();
    } else {
        scheduleRender();
    }
}

// Initialize camera position to first passage found
function initializeCameraPosition() {
    for (let y = 0; y < MAZE_SIZE; y++) {
        for (let x = 0; x < MAZE_SIZE; x++) {
            if (maze[y][x] === 0) {
                cameraX = x + 0.5; // Center in cell
                cameraY = y + 0.5;
                cameraAngle = 0; // Start facing east
                return;
            }
        }
    }
}

// Override generateMaze to also update camera and render
const originalGenerateMaze = generateMaze;
function generateMazeWithRender() {
    originalGenerateMaze();
    initializeCameraPosition();
    renderMazeToGrid();
}

// Initialize camera and render maze
initializeCameraPosition();
renderMazeToGrid();

// Camera getters
Object.defineProperty(window, 'cameraX', {
    get: () => cameraX,
    enumerable: true,
    configurable: true
});

Object.defineProperty(window, 'cameraY', {
    get: () => cameraY,
    enumerable: true,
    configurable: true
});

Object.defineProperty(window, 'cameraAngle', {
    get: () => cameraAngle,
    enumerable: true,
    configurable: true
});

// Make functions available globally
window.maze = maze;
window.generateMaze = generateMazeWithRender;
window.MAZE_SIZE = MAZE_SIZE;
window.setCameraPosition = setCameraPosition;
window.moveCameraForward = moveCameraForward;
window.strafeCamera = strafeCamera;
window.rotateCamera = rotateCamera;
window.renderMazeToGrid = renderMazeToGrid;
window.requestPointerLock = requestPointerLock;

// ============================================
// Keyboard Input Handling
// ============================================

/**
 * Handle keyboard input for camera movement
 */
function handleKeyDown(event) {
    // Convert to uppercase for case-insensitive checking
    const key = event.key.toUpperCase();
    
    switch (key) {
        case 'W':
            // Move forward
            isMovingForward = true;
            event.preventDefault();
            break;
        case 'S':
            // Move backward
            isMovingBackward = true;
            event.preventDefault();
            break;
        case 'A':
            // Strafe left
            isStrafingLeft = true;
            event.preventDefault();
            break;
        case 'D':
            // Strafe right
            isStrafingRight = true;
            event.preventDefault();
            break;
        case 'Q':
            // Rotate left
            rotateCamera(-ROTATION_SPEED);
            event.preventDefault();
            break;
        case 'E':
            // Rotate right
            rotateCamera(ROTATION_SPEED);
            event.preventDefault();
            break;
    }
}

/**
 * Handle keyboard release
 */
function handleKeyUp(event) {
    const key = event.key.toUpperCase();
    
    switch (key) {
        case 'W':
            isMovingForward = false;
            event.preventDefault();
            break;
        case 'S':
            isMovingBackward = false;
            event.preventDefault();
            break;
        case 'A':
            isStrafingLeft = false;
            event.preventDefault();
            break;
        case 'D':
            isStrafingRight = false;
            event.preventDefault();
            break;
    }
}

// Add keyboard event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// ============================================
// Mouse Input Handling
// ============================================

let isPointerLocked = false;
let mouseSensitivity = 0.002; // Sensitivity for mouse rotation

// Make mouse sensitivity adjustable
Object.defineProperty(window, 'mouseSensitivity', {
    get: () => mouseSensitivity,
    set: (value) => { mouseSensitivity = Math.max(0.0001, Math.min(0.01, value)); },
    enumerable: true,
    configurable: true
});

/**
 * Request pointer lock when clicking on the game page
 */
function requestPointerLock() {
    const canvas = document.body;
    canvas.requestPointerLock = canvas.requestPointerLock || 
                                canvas.mozRequestPointerLock || 
                                canvas.webkitRequestPointerLock;
    
    if (canvas.requestPointerLock) {
        canvas.requestPointerLock();
    }
}

/**
 * Handle pointer lock change
 */
function handlePointerLockChange() {
    isPointerLocked = document.pointerLockElement === document.body ||
                      document.mozPointerLockElement === document.body ||
                      document.webkitPointerLockElement === document.body;
}

/**
 * Handle mouse movement for camera rotation
 */
function handleMouseMove(event) {
    if (!isPointerLocked) return;
    
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    
    // Rotate camera horizontally based on mouse X movement
    if (movementX !== 0) {
        rotateCamera(movementX * mouseSensitivity);
    }
    
    // Optional: Add vertical look (pitch) if needed in the future
    // For now, we'll just use horizontal rotation
}

/**
 * Handle mouse click to lock pointer
 */
function handleMouseClick(event) {
    // Only lock on game page
    if (document.body.classList.contains('GamePage')) {
        requestPointerLock();
    }
}

/**
 * Handle mouse button for movement
 */
let isMovingForward = false;
let isMovingBackward = false;
let isStrafingLeft = false;
let isStrafingRight = false;

function handleMouseDown(event) {
    if (event.button === 0) { // Left mouse button
        isMovingForward = true;
    } else if (event.button === 2) { // Right mouse button
        isMovingBackward = true;
    }
}

function handleMouseUp(event) {
    if (event.button === 0) {
        isMovingForward = false;
    } else if (event.button === 2) {
        isMovingBackward = false;
    }
}

// Movement update loop using requestAnimationFrame for smooth rendering
let lastFrameTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

function updateMovement(currentTime) {
    // Calculate delta time for frame-rate independent movement
    const deltaTime = currentTime - lastFrameTime;
    
    if (deltaTime >= frameInterval) {
        let moved = false;
        
        if (isMovingForward) {
            moveCameraForward(MOVE_SPEED, true); // Immediate render
            moved = true;
        }
        if (isMovingBackward) {
            moveCameraForward(-MOVE_SPEED, true); // Immediate render
            moved = true;
        }
        if (isStrafingLeft) {
            strafeCamera(-MOVE_SPEED, true); // Immediate render
            moved = true;
        }
        if (isStrafingRight) {
            strafeCamera(MOVE_SPEED, true); // Immediate render
            moved = true;
        }
        
        lastFrameTime = currentTime - (deltaTime % frameInterval);
    }
    
    requestAnimationFrame(updateMovement);
}

// Set up mouse event listeners
document.addEventListener('click', handleMouseClick);
document.addEventListener('mousemove', handleMouseMove);
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);

// Prevent context menu on right click (for game page)
document.addEventListener('contextmenu', (event) => {
    if (document.body.classList.contains('GamePage')) {
        event.preventDefault();
    }
});

// Pointer lock change events
document.addEventListener('pointerlockchange', handlePointerLockChange);
document.addEventListener('mozpointerlockchange', handlePointerLockChange);
document.addEventListener('webkitpointerlockchange', handlePointerLockChange);

// Start the movement update loop
requestAnimationFrame(updateMovement);
