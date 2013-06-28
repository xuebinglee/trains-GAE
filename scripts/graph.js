// This is a modified version of a d3.js example called Directed Graph Editor,
// which can be found at http://bl.ocks.org/rkirsling/5001347
// Const
var DEFAULT_LENGTH = 5;

// set up SVG for D3
var width  = 1024,
    height = 502,
    colors = d3.scale.category10();

var svg = d3.select('body')
  .insert('svg', '#firstP')
  .attr('width', width)
  .attr('height', height)
  .attr('id', 'canvas');

// set up initial nodes and links
//  - nodes are known by 'id', not by index in array.
//  - reflexive edges are indicated on the node (as a bold black circle).
//  - links are always source < target; edge directions are set by 'left' and 'right'.
var nodes = [
    {id: 0, reflexive: true},
    {id: 1, reflexive: true },
    {id: 2, reflexive: true}
  ],
  lastNodeId = 2,
  links = [
    {source: nodes[0], target: nodes[1], left: false, right: true , length: DEFAULT_LENGTH},
    {source: nodes[1], target: nodes[2], left: false, right: true , length: DEFAULT_LENGTH}
  ];

// init D3 force layout
var force = d3.layout.force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .linkDistance(200)
    .charge(-1000)
    .on('tick', tick)

// define arrow markers for graph links
svg.append('svg:defs').append('svg:marker')
    .attr('id', 'end-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 6)
    .attr('markerWidth', 4)
    .attr('markerHeight', 4)
    .attr('orient', 'auto')
  .append('svg:path')
    .attr('d', 'M0,-5L10,0L0,5')
    .attr('fill', '#000');

svg.append('svg:defs').append('svg:marker')
    .attr('id', 'start-arrow')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 4)
    .attr('markerWidth', 4)
    .attr('markerHeight', 4)
    .attr('orient', 'auto')
  .append('svg:path')
    .attr('d', 'M10,-5L0,0L10,5')
    .attr('fill', '#000');

// line displayed when dragging new nodes
var drag_line = svg.append('svg:path')
  .attr('class', 'link dragline hidden')
  .attr('d', 'M0,0L0,0');

// handles to link and node element groups
var path = svg.append('svg:g').selectAll('path'),
    circle = svg.append('svg:g').selectAll('g');

// mouse event vars
var selected_node = null,
    selected_link = null,
    mousedown_link = null,
    mousedown_node = null,
    mouseup_node = null;

function resetMouseVars() {
  mousedown_node = null;
  mouseup_node = null;
  mousedown_link = null;
}

// update force layout (called automatically each iteration)
function tick() {
  // draw directed edges with proper padding from node centers
  path.attr('d', function(d) {
    var deltaX = d.target.x - d.source.x,
        deltaY = d.target.y - d.source.y,
        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
        normX = deltaX / dist,
        normY = deltaY / dist,
        sourcePadding = d.left ? 24 : 20,
        targetPadding = d.right ? 24 : 20,
        sourceX = d.source.x + (sourcePadding * normX),
        sourceY = d.source.y + (sourcePadding * normY),
        targetX = d.target.x - (targetPadding * normX),
        targetY = d.target.y - (targetPadding * normY);
    return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
  });

  circle.attr('transform', function(d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  });
}

// update graph (called when needed)
function restart() {
  // path (link) group
  path = path.data(links);

  // update existing links
  path.classed('selected', function(d) { return d === selected_link; })
    .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
    .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; });


  // add new links
  path.enter().append('svg:path')
    .attr('class', 'link')
    .classed('selected', function(d) { return d === selected_link; })
    .style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
    .style('marker-end', function(d) { return d.right ? 'url(#end-arrow)' : ''; })
    .on('mousedown', function(d) {
      if(d3.event.ctrlKey) return;

      // select link
      mousedown_link = d;
      if(mousedown_link === selected_link) {
        selected_link = null;
        viewWeightUpdate();
      }
      else {
        selected_link = mousedown_link;
        if(selected_link.left && selected_link.right)
          console.log('Link '+selected_link.source.id+'<->'+selected_link.target.id+' selected.');
        else if(selected_link.left && !selected_link.right)
          console.log('Link '+selected_link.target.id+'->'+selected_link.source.id+' selected.');
        else
          console.log('Link '+selected_link.source.id+'->'+selected_link.target.id+' selected.');
        viewWeightUpdate();
      }
      selected_node = null;
      restart();
    });

  // remove old links
  path.exit().remove();


  // circle (node) group
  // NB: the function arg is crucial here! nodes are known by id, not by index!
  circle = circle.data(nodes, function(d) { return d.id; });

  // update existing nodes (reflexive & selected visual states)
  circle.selectAll('circle')
    .style('fill', function(d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
    .classed('reflexive', function(d) { return d.reflexive; });

  // add new nodes
  var g = circle.enter().append('svg:g');

  g.append('svg:circle')
    .attr('class', 'node')
    .attr('r', 18)
    .style('fill', function(d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
    .style('stroke', function(d) { return d3.rgb(colors(d.id)).darker().toString(); })
    .classed('reflexive', function(d) { return d.reflexive; })
    .on('mouseover', function(d) {
      if(!mousedown_node || d === mousedown_node) return;
      // enlarge target node
      d3.select(this).attr('transform', 'scale(1.2)');
    })
    .on('mouseout', function(d) {
      if(!mousedown_node || d === mousedown_node) return;
      // unenlarge target node
      d3.select(this).attr('transform', '');
    })
    .on('mousedown', function(d) {
      if(d3.event.ctrlKey) return;

      // select node
      mousedown_node = d;
      if(mousedown_node === selected_node) selected_node = null;
      else {
        selected_node = mousedown_node;
        console.log('Node '+selected_node.id+' selected.');
      }
      selected_link = null;
      viewWeightUpdate();

      // reposition drag line
      drag_line
        .style('marker-end', 'url(#end-arrow)')
        .classed('hidden', false)
        .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);

      restart();
    })
    .on('mouseup', function(d) {
      if(!mousedown_node) return;

      // needed by FF
      drag_line
        .classed('hidden', true)
        .style('marker-end', '');

      // check for drag-to-self
      mouseup_node = d;
      if(mouseup_node === mousedown_node) { resetMouseVars(); return; }

      // unenlarge target node
      d3.select(this).attr('transform', '');

      // add link to graph (update if exists)
      // NB: links are strictly source < target; arrows separately specified by booleans
      var source, target, direction;
      if(mousedown_node.id < mouseup_node.id) {
        source = mousedown_node;
        target = mouseup_node;
        direction = 'right';
      } else {
        source = mouseup_node;
        target = mousedown_node;
        direction = 'left';
      }


      var link;
      // try to find a link with the same source and target
      link = links.filter(function(l) {
        return (l.source === source && l.target === target);
      })[0];

      if(link) { // if such link exists
        // update the found link with the other direction
        if (link[direction] == false)
        {
          if (direction == 'right') {
            ajaxAddEdge(source.id, target.id, link.length);
            console.log('Link '+source.id+'->'+target.id+' created.');
          }
          else {
            ajaxAddEdge(target.id, source.id, link.length);
            console.log('Link '+target.id+'->'+source.id+' created.');
          }
          link[direction] = true;
        } // otherwise there's no need to update
      } else {
        // create a new link
        if (direction == 'right') {
          ajaxAddEdge(source.id, target.id, DEFAULT_LENGTH);
          console.log('Link '+source.id+'->'+target.id+' created.');
        }
        else {
          ajaxAddEdge(target.id, source.id, DEFAULT_LENGTH);
          console.log('Link '+target.id+'->'+source.id+' created.');
        }
        link = {source: source, target: target, left: false, right: false, length: DEFAULT_LENGTH};
        link[direction] = true;
        links.push(link);
      }

      // select new link
      selected_link = link;
      viewWeightUpdate();
      selected_node = null;
      restart();
    });

  // show node IDs
  g.append('svg:text')
      .attr('x', 0)
      .attr('y', 4)
      .attr('class', 'id')
      .text(function(d) { return d.id; });

  // remove old nodes
  circle.exit().remove();

  // set the graph in motion
  force.start();
}

function dblclick() {
  // prevent I-bar on drag
  d3.event.preventDefault();

  // because :active only works in WebKit?
  svg.classed('active', false);

  if(d3.event.ctrlKey || mousedown_node || mousedown_link) return;

  // insert new node at point
  var point = d3.mouse(this),
      node = {id: ++lastNodeId, reflexive: true};
  node.x = point[0];
  node.y = point[1];
  nodes.push(node);
  ajaxAddTown(node.id);
  console.log('Node '+node.id+' created.');

  restart();
}

function mousemove() {
  if(!mousedown_node) return;

  // update drag line
  drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]);

  restart();
}

function mouseup() {
  if(mousedown_node) {
    // hide drag line
    drag_line
      .classed('hidden', true)
      .style('marker-end', '');
  }

  // because :active only works in WebKit?
  svg.classed('active', false);

  // clear mouse event vars
  resetMouseVars();
}

function spliceLinksForNode(node) {
  var toSplice = links.filter(function(l) {
    return (l.source === node || l.target === node);
  });
  toSplice.map(function(l) {
    links.splice(links.indexOf(l), 1);
    if(l.left && l.right) {
      ajaxDeleteEdge(l.source.id, l.target.id);
      ajaxDeleteEdge(l.target.id, l.source.id);
      console.log('Link '+l.source.id+'<->'+l.target.id+' deleted.');
    }
    else if(l.left && !l.right) {
      ajaxDeleteEdge(l.target.id, l.source.id);
      console.log('Link '+l.target.id+'->'+l.source.id+' deleted.');
    }
    else {
      ajaxDeleteEdge(l.source.id, l.target.id);
      console.log('Link '+l.source.id+'->'+l.target.id+' deleted.');
    }
  });
}

// only respond once per keydown
var lastKeyDown = -1;

function keydown() {
  d3.event.preventDefault();

  if(lastKeyDown !== -1) return;
  lastKeyDown = d3.event.keyCode;

  // ctrl
  if(d3.event.keyCode === 17) {
    circle.call(force.drag);
    svg.classed('ctrl', true);
  }

  if(!selected_node && !selected_link) return;
  switch(d3.event.keyCode) {
    case 46: // delete
      if(selected_node) {
        nodes.splice(nodes.indexOf(selected_node), 1);
        spliceLinksForNode(selected_node);
        ajaxDeleteTown(selected_node.id);
        console.log('Node '+selected_node.id+' deleted.');
      } else if(selected_link) {
        links.splice(links.indexOf(selected_link), 1);
        if(selected_link.left && selected_link.right) {
          ajaxDeleteEdge(selected_link.source.id, selected_link.target.id);
          ajaxDeleteEdge(selected_link.target.id, selected_link.source.id);
          console.log('Link '+selected_link.source.id+'<->'+selected_link.target.id+' deleted.');
        }
        else if(selected_link.left && !selected_link.right) {
          ajaxDeleteEdge(selected_link.target.id, selected_link.source.id);
          console.log('Link '+selected_link.target.id+'->'+selected_link.source.id+' deleted.');
        }
        else {
          ajaxDeleteEdge(selected_link.source.id, selected_link.target.id);
          console.log('Link '+selected_link.source.id+'->'+selected_link.target.id+' deleted.');
        }
      }
      selected_link = null;
      viewWeightUpdate();
      selected_node = null;
      restart();
      break;
    case 38: // up arrow
      if(selected_link) {
        selected_link.length++;
        viewWeightUpdate();
        if(selected_link.left && selected_link.right) {
          ajaxUpdateEdge(selected_link.source.id, selected_link.target.id, selected_link.length);
          ajaxUpdateEdge(selected_link.target.id, selected_link.source.id, selected_link.length);
          console.log('The length of link '+selected_link.source.id+'<->'+selected_link.target.id+' changed to '+selected_link.length+'.');
        }
        else if(selected_link.left && !selected_link.right) {
          ajaxUpdateEdge(selected_link.target.id, selected_link.source.id, selected_link.length);
          console.log('The length of link '+selected_link.target.id+'->'+selected_link.source.id+' changed to '+selected_link.length+'.');
        }
        else {
          ajaxUpdateEdge(selected_link.source.id, selected_link.target.id, selected_link.length);
          console.log('The length of link '+selected_link.source.id+'->'+selected_link.target.id+' changed to '+selected_link.length+'.');
        }
      }
      break;
    case 40: // down arrow
      if(selected_link) {
        if(selected_link.length > 1) {
          selected_link.length--;
          viewWeightUpdate();
          if(selected_link.left && selected_link.right) {
            ajaxUpdateEdge(selected_link.source.id, selected_link.target.id, selected_link.length);
            ajaxUpdateEdge(selected_link.target.id, selected_link.source.id, selected_link.length);
            console.log('The length of link '+selected_link.source.id+'<->'+selected_link.target.id+' changed to '+selected_link.length+'.');
          }
          else if(selected_link.left && !selected_link.right) {
            ajaxUpdateEdge(selected_link.target.id, selected_link.source.id, selected_link.length);
            console.log('The length of link '+selected_link.target.id+'->'+selected_link.source.id+' changed to '+selected_link.length+'.');
          }
          else {
            ajaxUpdateEdge(selected_link.source.id, selected_link.target.id, selected_link.length);
            console.log('The length of link '+selected_link.source.id+'->'+selected_link.target.id+' changed to '+selected_link.length+'.');
          }
        }
      }
      break;
  }
}

function keyup() {
  lastKeyDown = -1;

  // ctrl
  if(d3.event.keyCode === 17) {
    circle
      .on('mousedown.drag', null)
      .on('touchstart.drag', null);
    svg.classed('ctrl', false);
  }
}

function viewWeightUpdate() {
  if (selected_link)
    d3.select('#firstP').text('Weight: '+selected_link.length);
  else
    d3.select('#firstP').text('');
}

// app starts here
svg.on('dblclick', dblclick)
  .on('mousemove', mousemove)
  .on('mouseup', mouseup);
d3.select(window)
  .on('keydown', keydown)
  .on('keyup', keyup);
restart();
