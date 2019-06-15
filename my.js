
var config = {
    width: 1500,
    height: 800,
    boat_width: 200,
    boat_height: 10,
};

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Composites = Matter.Composites,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
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
        width: config.width,
        height: config.height,
        showAngleIndicator: false
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);


var defaultCategory = 0x0001,
    userCategory = 0x0002,
    bridgeCategory = 0x0004;

var group = Body.nextGroup(true);

var bridge = Composites.stack(config.width/2, config.height - 200, 30, 1, 0, 0, function (x, y) {
    return Bodies.rectangle(x - 20, y, 53, 60, {
        collisionFilter: {group: group, category: bridgeCategory},
        chamfer: 5,
        density: 0.005,
        frictionAir: 0.05,
        render: {
            fill: '#ff0',
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

var boat = Bodies.rectangle(config.width/2, config.height - 200, config.boat_width, config.boat_height,
    {density: 0.06, collisionFilter: {category: defaultCategory}});


World.add(world, [

    //Start Limite du terrain
    Bodies.rectangle(0, 0, 10, config.height*2, {isStatic: true,}),
    Bodies.rectangle(config.width, 0, 10, config.height*2, {isStatic: true,}),
    Bodies.rectangle(config.width/2, config.height, config.width, 10, {isStatic: true,}),
    //Fin Limite du terrain
    //Sol invisible pour empecher de passer en dessous
    Bodies.rectangle(config.width/2, config.height-30, config.width, 100, {
        isStatic: true,
        render: {visible: !false,},
        collisionFilter: {group: group, category: bridgeCategory},
    }),

    bridge,
    boat,


    //constraints du pont
    Constraint.create({
        pointA: {x: -30, y: config.height-100},
        bodyB: bridge.bodies[0],
        //pointB: {x: -25, y: 0},
        length: 1,
        stiffness: 0.9,
        render: {
            visible: true,
        }
    }),
    Constraint.create({
        pointA: {x: config.width + 30, y: config.height-100},
        bodyB: bridge.bodies[bridge.bodies.length - 1],
        //pointB: {x: 25, y: 0},
        length: 1,
        stiffness: 0.9,
        render: {
            visible: true,
        }
    }),
    //Constraints du boat
    Constraint.create({
        pointA: { x:  - 300, y: config.height },
        pointB: { x: -config.boat_width/2, y: 0 },
        bodyB: boat,
        length: 2,
        stiffness: 0.0001,
        render: {
            visible: false,
        }
    }),
    Constraint.create({
        pointA: { x:  config.width + 300, y: config.height },
        pointB: { x: config.boat_width/2, y: 0 },
        bodyB: boat,
        length: 2,
        stiffness: 0.0001,
        render: {
            visible: false,
        }
    }),
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

var user = Bodies.rectangle(config.width/2, config.height - 250, 20, 50,
    {collisionFilter: {mask: defaultCategory}, density: 0.06, mass: 20});
var user2 = Bodies.rectangle(config.width/2, config.height - 250, 20, 50,
    {collisionFilter: {mask: defaultCategory}, density: 0.06, mass: 20});

document.onkeydown = function(e){
    //console.log(e.code);
    switch (e.code) {
        case "ArrowLeft":
            Body.applyForce(user, { x: user.position.x, y: user.position.y }, { x: -0.05, y: 0 });
            break;
        case "ArrowRight":
            Body.applyForce(user, { x: user.position.x, y: user.position.y }, { x: 0.05, y: 0 });
            break;
        case "ArrowUp":
            Body.applyForce(user, { x: user.position.x, y: user.position.y }, { x: 0, y: -1 });
            break;
        case "KeyD":
            Body.applyForce(user2, { x: user2.position.x, y: user2.position.y }, { x: 0.05, y: 0 });
            break;
        case "KeyW":
            Body.applyForce(user2, { x: user2.position.x, y: user2.position.y }, { x: 0, y: -1 });
            break;
        case "KeyA":
            Body.applyForce(user2, { x: user2.position.x, y: user2.position.y }, { x: -0.05, y: 0 });
            break;
    }
};
setInterval(() => {
    Body.applyForce(bridge.bodies[15], { x: bridge.bodies[15].position.x, y: bridge.bodies[15].position.y }, { x: 0, y: Math.random()*30+10 });
}, 3000);

World.add(world, [user, user2]);


// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
Render.lookAt(render, {
    min: {x: 0, y: 0},
    max: {x: config.width, y: config.height,}
});