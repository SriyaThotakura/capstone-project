// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random animation duration and delay
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${delay}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// Navigation functionality
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show the selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to the clicked nav item
    const navItems = document.querySelectorAll('.nav-item');
    for (let i = 0; i < navItems.length; i++) {
        if (navItems[i].getAttribute('onclick').includes(sectionId)) {
            navItems[i].classList.add('active');
            break;
        }
    }
    
    // Scroll to top of the section
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Initialize particles when page loads
window.addEventListener('load', () => {
    createParticles();
    createNetworkGraph();
});

// Create network graph visualization
function createNetworkGraph() {
    const container = document.getElementById('network-graph');
    if (!container) return;

    // Graph data
    const graph = {
        nodes: [
            { id: "Titan Terrain Data", type: "Data Source" },
            { id: "Mars MOLA DEM", type: "Data Source" },
            { id: "Methane Lakes", type: "Geographic Feature" },
            { id: "Robot Infrastructure", type: "System Component" },
            { id: "Bio-mimicry Organisms", type: "System Component" },
            { id: "Cyborg Ecosystem", type: "System Layer" },
            { id: "Planetary Urbanism", type: "Theme" },
            { id: "Post-Human Society", type: "Theme" },
            { id: "Energy Flows", type: "Dynamic Process" },
            { id: "Data Loops", type: "Dynamic Process" },
            { id: "Game Simulation", type: "Platform" },
            { id: "Vertical Datascape Drawing", type: "Output" },
            { id: "Material Gesture Model", type: "Output" }
        ],
        links: [
            { source: "Titan Terrain Data", target: "Methane Lakes" },
            { source: "Mars MOLA DEM", target: "Robot Infrastructure" },
            { source: "Methane Lakes", target: "Bio-mimicry Organisms" },
            { source: "Robot Infrastructure", target: "Cyborg Ecosystem" },
            { source: "Bio-mimicry Organisms", target: "Cyborg Ecosystem" },
            { source: "Cyborg Ecosystem", target: "Planetary Urbanism" },
            { source: "Cyborg Ecosystem", target: "Post-Human Society" },
            { source: "Cyborg Ecosystem", target: "Energy Flows" },
            { source: "Energy Flows", target: "Data Loops" },
            { source: "Data Loops", target: "Game Simulation" },
            { source: "Game Simulation", target: "Vertical Datascape Drawing" },
            { source: "Game Simulation", target: "Material Gesture Model" }
        ]
    };

    // Color scale for node types
    const colorScale = d3.scaleOrdinal()
        .domain(["Data Source", "Geographic Feature", "System Component", "System Layer", "Theme", "Dynamic Process", "Platform", "Output"])
        .range(["#6baed6", "#9ecae1", "#31a354", "#756bb1", "#e6550d", "#fd8d3c", "#f768a1", "#9e9ac8"]);

    // Create SVG
    const width = container.clientWidth;
    const height = 600;
    
    const svg = d3.select('#network-graph')
        .append('svg')
        .attr('width', '100%')
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto;');

    // Add zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.5, 3])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    // Create a group for the graph
    const g = svg.append('g');

    // Create the simulation
    const simulation = d3.forceSimulation(graph.nodes)
        .force('link', d3.forceLink(graph.links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-500))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide().radius(60));

    // Create links
    const link = g.append('g')
        .selectAll('line')
        .data(graph.links)
        .join('line')
        .attr('class', 'link')
        .attr('stroke', '#00ff88')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', 1.5);

    // Create nodes
    const node = g.append('g')
        .selectAll('g')
        .data(graph.nodes)
        .join('g')
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
        .attr('r', 20)
        .attr('fill', d => colorScale(d.type))
        .attr('stroke', '#00ff88')
        .attr('stroke-width', 1.5)
        .on('mouseover', function() {
            d3.select(this).attr('stroke-width', 3);
        })
        .on('mouseout', function() {
            d3.select(this).attr('stroke-width', 1.5);
        });

    // Add labels to nodes
    node.append('text')
        .text(d => {
            // Split long labels into multiple lines
            const words = d.id.split(' ');
            return words.length > 2 ? words.slice(0, 2).join(' ') + '\n' + words.slice(2).join(' ') : d.id;
        })
        .attr('text-anchor', 'middle')
        .attr('dy', 4)
        .attr('fill', '#00ff88')
        .attr('font-size', '8px')
        .attr('pointer-events', 'none');

    // Add type labels to nodes
    node.append('text')
        .text(d => d.type)
        .attr('text-anchor', 'middle')
        .attr('dy', 30)
        .attr('fill', '#00ff88')
        .attr('font-size', '6px')
        .attr('opacity', 0.8)
        .attr('pointer-events', 'none');

    // Update positions on each tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

        node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // Add legend
    const legend = d3.select('#network-graph')
        .append('div')
        .attr('class', 'legend');

    const legendItems = Array.from(new Set(graph.nodes.map(d => d.type)));
    
    legend.selectAll('.legend-item')
        .data(legendItems)
        .enter()
        .append('div')
        .attr('class', 'legend-item')
        .html(d => `
            <div class="legend-color" style="background-color: ${colorScale(d)}"></div>
            <span>${d}</span>
        `);

    // Handle window resize
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        svg.attr('width', newWidth)
           .attr('viewBox', [0, 0, newWidth, height]);
        simulation.force('center', d3.forceCenter(newWidth / 2, height / 2));
        simulation.alpha(0.3).restart();
    });
}

// Add some interactivity to deliverables
document.addEventListener('DOMContentLoaded', () => {
    // Make deliverables slightly interactive on hover
    const deliverables = document.querySelectorAll('.deliverable');
    deliverables.forEach(deliverable => {
        deliverable.addEventListener('mouseenter', () => {
            deliverable.style.transform = 'translateY(-5px)';
            deliverable.style.boxShadow = '0 5px 15px rgba(255, 200, 0, 0.2)';
        });
        
        deliverable.addEventListener('mouseleave', () => {
            deliverable.style.transform = 'translateY(0)';
            deliverable.style.boxShadow = 'none';
        });
    });
    
    // Set the first section as active by default if none is active
    if (!document.querySelector('.section.active')) {
        document.querySelector('.section').classList.add('active');
    }
    
    // Add active class to the first nav item by default if none is active
    if (!document.querySelector('.nav-item.active')) {
        document.querySelector('.nav-item').classList.add('active');
    }
});