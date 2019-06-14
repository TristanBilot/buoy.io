var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Composites = Matter.Composites,
        Common = Matter.Common,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            showAngleIndicator: false
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var group = Body.nextGroup(true);

    var bridge = Composites.stack(160, 290, 20, 1, 0, 0, function(x, y) {
        return Bodies.rectangle(x - 20, y, 50, 20, { 
            collisionFilter: { group: group },
            chamfer: 5,
            density: 0.005,
            frictionAir: 0.05,
            render: {
                fillStyle: '#00ffff'
            }
        });
    });
    Composites.chain(bridge, 0.3, 0, -0.3, 0, { 
        stiffness: 1,
        length: 0,
        render: {
            visible: false,
        }
    });


    var rope = Composites.stack(100, 400, 10, 1, 0, 0, function(x, y) {
        return Bodies.rectangle(x - 20, y, 53, 2, { 
            density: 0.9,
            frictionAir: 0.05,
            render: {
                fillStyle: '#00ffff'
            }
        });
    });
    
    Composites.chain(rope, 0.3, 0, -0.3, 0, { 
        stiffness: 1,
        length: 0,
        render: {
            visible: false,
        }
    });
    var boat = Bodies.rectangle(100, 400, 10, 200, {density: 0.06});

    /*var stack = Composites.stack(250, 50, 6, 3, 0, 0, function(x, y) {
        return Bodies.rectangle(x, y, 50, 50, Common.random(20, 40));
    });*/

    World.add(world, [

        //Start Limite du terrain
        Bodies.rectangle(0, 0, 10, 1200, { isStatic: true, }),
        Bodies.rectangle(800, 0, 10, 1200, { isStatic: true, }),
        Bodies.rectangle(400, 600, 800, 10, { isStatic: true, }),
        //Fin Limite du terrain
        
		bridge,
        //stack,
        boat, //The boat
        /*Bodies.rectangle(770, 490, 220, 380, { 
            isStatic: true, 
        }),*/
        Constraint.create({ 
            pointA: { x: -30, y: 500 }, 
            bodyB: bridge.bodies[0], 
            pointB: { x: -25, y: 0 },
            length: 2,
            stiffness: 0.9,
            render: {
	            visible: true,
	        }
        }),
        Constraint.create({ 
            pointA: { x: 830, y: 500 }, 
            bodyB: bridge.bodies[bridge.bodies.length - 1], 
            pointB: { x: 25, y: 0 },
            length: 2,
            stiffness: 0.9,
            render: {
	            visible: true,
	        }
        }),

        /*Constraint.create({ 
            pointA: { x: 400, y: 400 },
            //pointB: { x: 400, y: 400 }, 
            bodyB: boat, 
            length: 2,
            stiffness: 0.9,
            render: {
	            visible: true,
	        }
        }),*/
    ]);

    


    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.1,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });