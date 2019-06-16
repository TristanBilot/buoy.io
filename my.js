
let config = {
    width: 1500,
    height: 800,
    boat_width: 200,
    boat_height: 20,
    boat_density: 0.03,


    boat_color: '#555',
    sky_color: '#77b5fe',
    water_color: '#20B2AA',

};

let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Bodies = Matter.Bodies;

// create engine
let engine = Engine.create(),
    world = engine.world;


// create renderer
let render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: config.width,
        height: config.height,
        wireframes: false,
        showAngleIndicator: false,
        background: config.sky_color
    }
});

Render.run(render);

// create runner
let runner = Runner.create();
Runner.run(runner, engine);


let defaultCategory = 0x0001,
    bridgeCategory = 0x0002;

let group = Body.nextGroup(true);

let bridge = Composites.stack(config.width/2, config.height - 200, 31, 1, 0, 0, function (x, y) {
    return Bodies.rectangle(x - 20, y, 53, 100, {
        collisionFilter: {group: group, category: bridgeCategory},
        density: 0.005,
        frictionAir: 0.05,
        render: {
            fillStyle: config.water_color,
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

let boat = Bodies.rectangle(config.width/2, config.height - 200, config.boat_width, config.boat_height, {
    density: config.boat_density,
    collisionFilter: {category: defaultCategory},
    render: {fillStyle: config.boat_color}
});


World.add(world, [

    //Start Limite du terrain
    Bodies.rectangle(0, 0, 10, config.height*2, {
        isStatic: true,
        collisionFilter: {group: group},
        render: {visible: false},
    }),
    Bodies.rectangle(config.width, 0, 10, config.height*2, {
        isStatic: true,
        collisionFilter: {group: group},
        render: {visible: false},
    }),
    Bodies.rectangle(config.width/2, config.height, config.width, 10, {
        isStatic: true,
        collisionFilter: {group: group},
        render: {visible: false},
    }),
    //Fin Limite du terrain
    //Sol invisible pour empecher de passer en dessous
    Bodies.rectangle(config.width/2, config.height-30, config.width, 100, {
        isStatic: true,
        render: {
            fillStyle: config.water_color,
        },
        collisionFilter: {
            group: group,
            category: bridgeCategory},
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
let mouse = Mouse.create(render.canvas),
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

let user = Bodies.rectangle(config.width/2, config.height - 250, 20, 50, {
        collisionFilter: {mask: defaultCategory},
        density: 0.06,
        mass: 20,
        render : {
            fillStyle: '#FF55AA',
        },
    });
let user2 = Bodies.rectangle(config.width/2, config.height - 250, 20, 50, {
    collisionFilter: {mask: defaultCategory},
    density: 0.06,
    mass: 20,
    render: {
        fillStyle: '#FFA',
    },
});

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
    Body.applyForce(bridge.bodies[15], { x: bridge.bodies[15].position.x, y: bridge.bodies[15].position.y }, { x: 0, y: Math.random()*40+20 });
}, 3000);
setInterval(() => {
    Body.applyForce(bridge.bodies[5], { x: bridge.bodies[5].position.x, y: bridge.bodies[5].position.y }, { x: 0, y: Math.random()*3 });
    Body.applyForce(bridge.bodies[15], { x: bridge.bodies[15].position.x, y: bridge.bodies[15].position.y }, { x: 0, y: Math.random()*3 });
    Body.applyForce(bridge.bodies[25], { x: bridge.bodies[25].position.x, y: bridge.bodies[25].position.y }, { x: 0, y: Math.random()*3 });
}, 500);

World.add(world, [user, user2]);


// keep the mouse in sync with rendering
render.mouse = mouse;

// fit the render viewport to the scene
/*Render.lookAt(render, {
    min: {x: 0, y: 0},
    max: {x: config.width, y: config.height,}
});*/