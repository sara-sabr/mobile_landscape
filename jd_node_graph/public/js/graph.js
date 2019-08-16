(function(){
    var myDiagram;

    // getData();
    
    // async function getData(){
    //     const response = await fetch('api');
    //     const data = await response.json();
    //     console.log(data);
    // }

    init();
    
    // document.getElementById("zoomInBtn").addEventListener("click", onZoomInClick);
    // document.getElementById("zoomOutBtn").addEventListener("click", onZoomOutClick);
    // document.getElementById("filterBtn").addEventListener("click", onDoFilterClick);

    // Get modal element
    var modal = document.getElementById('simpleModal');

    // Get close button
    var closeBtn = document.getElementById('closeBtn');
    
    // Listen for close click
    closeBtn.addEventListener('click', closeModal);

    // Listen for close click
    window.addEventListener('click', outsideClick);


  
    async function init() {    
        var $ = go.GraphObject.make;  // for conciseness in defining templates
  
        const response = await fetch('api');
        const data = await response.json();
        console.log(data);

        myDiagram =
          $(go.Diagram, "myDiagram",  // must be the ID or reference to div
            { 
              initialContentAlignment: go.Spot.Center,
              hoverDelay: 100,  // controls how long to wait motionless (msec) before showing Adornment
            });
  
        myDiagram.toolManager.mouseWheelBehavior = go.ToolManager.WheelZoom; // Don't set Diagram.autoScale if you want the user to zoom the diagram.
        
        // define all of the gradient brushes
        var rootBrush = $(go.Brush, { color: "#005A8C" });
        var mainGroupBrush = $(go.Brush, { color: "#FCA14F" });
        var subGroupBrush = $(go.Brush, { color: "#0072C1" });
        var subSubGroupBrush = $(go.Brush, { color: "#07889b" });
        var leafBrush = $(go.Brush, { color: "#4484ce" });
  
        // this is shown by the mouseHover event handler
        var nodeHoverAdornment =
          $(go.Adornment, "Spot",
            {
              background: "transparent",
              // hide the Adornment when the mouse leaves it
              mouseLeave: function(e, obj) {
                var ad = obj.part;
                ad.adornedPart.removeAdornment("mouseHover");
              },
              click: function(e, obj) {
                var ad = obj.part;
                debugger
              }
            },
            $(go.Placeholder,
              {
                background: "transparent",  // to allow this Placeholder to be "seen" by mouse events
                isActionable: true,  // needed because this is in a temporary Layer
                click: function(e, obj) {
                  var node = obj.part.adornedPart;
                  node.diagram.select(node);
                }
              }),
            $(go.Panel, "Auto",
              { alignment: new go.Spot(0.5, 0, 0, -20) },
              $(go.Panel, "Vertical",
                { name: 'actionsPanel' },
                $(go.Panel, "Auto",
                  $(go.Shape, "RoundedRectangle",
                    { 
                      fill: "#333333",
                      stroke: "#333333",                    
                      height: 30,
                      margin: 0,
                      strokeWidth: 1,   
                      shadowVisible: false,     
                      parameter1: 2, // border radius
                    }),
                  $(go.Panel, "Horizontal",
                    $("Button",                  
                      { 
                        width: 30,
                        height: 30,
                        margin: 0,
                        "ButtonBorder.fill": "transparent", // background color
                        "ButtonBorder.stroke": "transparent", // border color     
                        "_buttonFillOver": "#535353",
                        "_buttonStrokeOver": "transparent", // border color on hover
                        toolTip:
                          $("ToolTip",
                            $(go.TextBlock, { margin: 1, text: "add" })
                          ),
                        click: onAddSubItemClick                      
                      },
                      new go.Binding("visible", "addingSubItemAllowed"),
                      $(go.Shape, {
                        geometry: go.Geometry.parse('M1600 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z', true),
                        fill: "#ffffff",
                        stroke: "#ffffff",
                        strokeWidth: 0,
                        width: 12,
                        height: 12,
                        maxSize: new go.Size(12, 12)
                      })                      
                     ),
                    $("Button",                  
                      { 
                        width: 30,
                        height: 30,
                        margin: 0,                      
                        "ButtonBorder.fill": "transparent", // background color
                        "ButtonBorder.stroke": "transparent", // border color     
                        "_buttonFillOver": "#535353",
                        "_buttonStrokeOver": "transparent", // border color on hover
                        toolTip:
                          $("ToolTip",
                            $(go.TextBlock, { margin: 1, text: "del" })
                          ),
                        click: onRemoveItemClick                  
                      }, 
                      new go.Binding("visible", "removeAllowed"),
                      $(go.Shape, {
                        geometry: go.Geometry.parse('M704 1376v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm256 0v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm256 0v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm-544-992h448l-48-117q-7-9-17-11h-317q-10 2-17 11zm928 32v64q0 14-9 23t-23 9h-96v948q0 83-47 143.5t-113 60.5h-832q-66 0-113-58.5t-47-141.5v-952h-96q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h309l70-167q15-37 54-63t79-26h320q40 0 79 26t54 63l70 167h309q14 0 23 9t9 23z', true),
                        stroke: "#ffffff",
                        fill: "#ffffff",
                        strokeWidth: 0,
                        width: 12,
                        height: 12,
                        maxSize: new go.Size(12, 12)
                      })  
                     )
                    )                
                ),
                $(go.Shape, "TriangleDown",
                  { 
                    fill: "#333333",
                    stroke: "#333333",
                    width: 20,
                    height: 10,
                    strokeWidth: 0,
                    margin: 0,
                    segmentOffset: new go.Point(0, 10)
                  })
              )
            )
          );
  
        // define the Node template for non-terminal nodes
        myDiagram.nodeTemplate =
          $(go.Node, "Vertical",
            {
              name: "node",
              margin: 0,
              isTreeExpanded: false,  // by default collapsed
              click: onNodeClick,
              isShadowed: true,
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.2)",
              shadowOffset: new go.Point(0, 1),
              selectionAdorned: false, // remove node focus outline    
              cursor: "pointer"
            },
            new go.Binding("isTreeExpanded", "expanded"),
            $(go.Panel, "Auto",
              {margin: 0},
              $(go.Shape, "RoundedRectangle",
                { 
                  maxSize: new go.Size(NaN, 28),
                  fill: leafBrush,
                  margin: 0,
                  stroke: "transparent",
                  strokeWidth: 0,
                  shadowVisible: true,              
                  parameter1: 2, // border radius
                  portId: "",  // now the Shape is the port, not the whole Node
                  fromSpot: go.Spot.Right,  // port properties go on the port!
                  toSpot: go.Spot.Left
                },
                new go.Binding("fill", "color")),
              $(go.Panel, "Horizontal",
                {margin: 0},
                $(go.Panel, "Horizontal",
                  {
                    height: 28,
                    margin: 0,
                    name: "hoverPart",
                    maxSize: new go.Size(100, 28),
                    // show the Adornment when a mouseHover event occurs
                    mouseHover: function(e, obj) {
                      var hoverPart = obj.part.findObject("hoverPart");
                      var node = obj.part;
                      if(hoverPart && (node.data.addingSubItemAllowed || node.data.removeAllowed)) {
                        nodeHoverAdornment.adornedObject = hoverPart;
                        node.addAdornment("mouseHover", nodeHoverAdornment);
                      }                  
                    }
                  },
                 $(go.TextBlock,
                  {
                    font: "bold 11px Helvetica, bold Arial, sans-serif",
                    margin: 3,
                    isMultiline: false,
                    maxLines: 1, 
                    wrap: go.TextBlock.WrapBreakAll,
                    overflow: go.TextBlock.OverflowEllipsis, 
                    stroke: "#FFFFFF",     
                    alignment: go.Spot.Left,
                    /*toolTip: $("ToolTip",
                      $(go.TextBlock, 
                        { margin: 1 },
                        new go.Binding("text", "text"))
                      )*/
                  },
                  new go.Binding("text", "text")),
                  new go.Binding("margin", "hasChildren", function(hasChildren) { return hasChildren ? new go.Margin(5, 35, 5, 5) : new go.Margin(5, 5, 5, 5); })
               )
                ),
               $("TreeExpanderButton",             
                 {
                   width: 30,
                   height: 28,
                   margin: 0,
                   "ButtonIcon.stroke": "#FFFFFF", // font color
                   "ButtonBorder.fill": "rgba(55, 55, 55, 0.2)", // background color
                   "ButtonBorder.stroke": "transparent", // border color
                   "_buttonFillOver": "rgba(55, 55, 55, 0.4)", // background color on hover
                   "_buttonStrokeOver": "transparent", // border color on hover
                   alignment: go.Spot.Right,
                   alignmentFocus: go.Spot.Top
                 }
                )          
             )
           );
  
        // define the Link template
        myDiagram.linkTemplate =
            $(go.Link,
              {
                curve: go.Link.Bezier,
                toEndSegmentLength: 30, fromEndSegmentLength: 30
              },
              $(go.Shape, { strokeWidth: 1, stroke: "#B1B1B1" }) // the link shape, with the default black stroke
            );
  
        myDiagram.layout = $(go.TreeLayout, {
          arrangement: go.TreeLayout.ArrangementFixedRoots, // Roots position is not changed while expanding/collapsing nodes.
          comparer: function(a, b) { return a.node.data.text.localeCompare(b.node.data.text); }, // Nodes are ordered ascending by 'text' property.
          sorting: go.TreeLayout.SortingAscending,
          setsChildPortSpot: false
        });
  
        myDiagram.addDiagramListener("TreeExpanded", onTreeExpanded);
        myDiagram.addDiagramListener("TreeCollapsed", onTreeCollapsed);

        var graphData = data.nodes;
        console.log(graphData);
        myDiagram.model = new go.TreeModel(graphData);
          
      }
  
    function onNodeClick(e, obj) {
      var evt = e.copy();
      var node = obj.part;
      var data = node.data;
      // console.log("node click")
      console.log(data)
      openModal(data);
    }

    //function to open modal
    function openModal(data){
      modal.style.display = 'block';
      // Header and Footer color
      //Without JSON
      // document.querySelector('.modal-header').style.background = data.color.Gk;
      // document.querySelector('.modal-footer').style.background = data.color.Gk;
      // With JSON
      document.querySelector('.modal-header').style.background = data.color;
      document.querySelector('.modal-footer').style.background = data.color;
      document.querySelector('#nodeTitle').textContent = data.text;
      document.querySelector('#nodeDesc').textContent = data.desc;
      document.querySelector('#nodeFoot').textContent = data.footer;
    }

    // function close modal
    function closeModal(){
      modal.style.display = 'none';
    }

    // function outside click
    function outsideClick(e){
      if(e.target == modal){
        modal.style.display = 'none';
      }
      
    }

    function onAddSubItemClick(e, obj) {
      var node = obj.part;
      var data = node.data;
      console.log("add subitem click")
      console.log(data)
      e.handled = true; // prevent bubbling
      alert("on add subitem to '" + data.text + "' click");
    }
  
    function onRemoveItemClick(e, obj) {
      var node = obj.part;
      var data = node.data;
      console.log("add remove item click")
      console.log(data)
      e.handled = true; // prevent bubbling
      alert("on remove item '" + data.text + "' click");
    }
  
    function onTreeExpanded(e) {
      console.log("expanded nodes:")
      var iterator = e.subject.iterator;
      while(iterator.next()) {                  
        console.log(iterator.value.data);
      }
  
      console.log("clicked node:");
      console.log(e.subject.first().data);
    }
  
    function onTreeCollapsed(e) {
      console.log("collapsed nodes:")
      var iterator = e.subject.iterator;
      while(iterator.next()) {                  
        console.log(iterator.value.data);
      }
  
      console.log("clicked node:");
      console.log(e.subject.first().data);
    }
    
    function onZoomInClick() {
      if(myDiagram.commandHandler.canIncreaseZoom()) {
        myDiagram.commandHandler.increaseZoom();
      }    
    }
  
    function onZoomOutClick() {
      if(myDiagram.commandHandler.canDecreaseZoom()) {
        myDiagram.commandHandler.decreaseZoom();
      }    
    }
    
    function onDoFilterClick() {
      var filterText = document.getElementById("filterText").value;
      var allNodes = getAllNodes();
      var visibleNodes = [];
      
      // find nodes that match the filter and all its direct parents
      if(filterText.length) {
        var matchingNodes = getMatchingNodes(filterText);
        visibleNodes = getVisibleNodes(matchingNodes, allNodes);
      }
      
      for(var i = 0, length = allNodes.length; i < length; i++) {
        var n = allNodes[i];
        var key = n.data.key;
        
        if(filterText.length) {
          var visible = visibleNodes.includes(key);
          if(visible) {
            n.expandTree();
          }
          n.visible = visible;        
          //n.isTreeLeaf = !visible;
          continue;
        }
        
        // if filter is empty show default state based on initial data
        n.visible = true;
        //n.isTreeLeaf = false;
        if(n.data.expanded) {
          n.expandTree();
        } else {
          n.collapseTree();
        }
      }
    }
    
    function getAllNodes() {
      var allNodes = [];
      
      for (var it = myDiagram.nodes; it.next(); ) {
        var n = it.value;  // n is now a Node or a Group
        var key = it.value.data.key;   
        allNodes.push(it.value);
      }
      
      return allNodes;
    }
    
    function getMatchingNodes(filterText) {
      var regex = new RegExp(filterText, "i");
      var results = myDiagram.findNodesByExample({ text: regex });
      var iterator = results.iterator;
      var matchingNodes = [];
        
      while (iterator.next()) {        
        matchingNodes.push(iterator.value);
      }
      
      return matchingNodes;
    }
    
    function getVisibleNodes(matchingNodes, allNodes) {
      let allParents = [];
      
      matchingNodes.forEach(function(n) {
         allParents = allParents.concat(getParentNodes(n, allNodes));
      });
      
      allParents = allParents.concat(matchingNodes);
      
      allParents = allParents
        .map(function (n) { return n.data.key; })
        .filter(function(value, index, self) { return self.indexOf(value) === index; });
  
      return allParents;
    }
    
    function getParentNodes(node, allNodes) {
      var parents = [];
      var parentNode = allNodes.find(function(n) { return n.data.key === node.data.parent });
  
      while(parentNode) {
        parents.push(parentNode);
        parentNode = allNodes.find(function(n) { return n.data.key === parentNode.data.parent });
      }
  
      return parents;
    };
  })();