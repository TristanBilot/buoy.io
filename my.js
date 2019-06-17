
let config = {
    width: 800,
    height: 600,


    bridge_nb_tiles: 17,

    boat_width: 200,
    boat_height: 20,
    boat_density: 0.06,


    boat_color: '#555',
    sky_color: '#77b5fe',
    water_color: '#5C6BC0',

};

let defaultCategory = 0x0001,
    bridgeCategory = 0x0002;


//Pour gerer l'emission de socket
let sending = false;


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
setTimeout(function() {
  Render.run(render);
}, 500);


// create runner
let runner = Runner.create();
Runner.run(runner, engine);


let group = Body.nextGroup(true);

let bridge = Composites.stack(config.width/2, config.height - 200, config.bridge_nb_tiles, 1, 0, 0, function (x, y) {
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
    //Sol invisible pour empecher le bateau de couler
    Bodies.rectangle(config.width/2, config.height-50, config.width, 100, {
        isStatic: true,
        render: {
            fillStyle: config.water_color,
        },
        collisionFilter: {
            group: group,
            category: bridgeCategory
        },
    }),

    bridge,
    boat,


    //contraintes du bridge
    Constraint.create({
        pointA: {x: -30, y: config.height-100},
        bodyB: bridge.bodies[0],
        length: 1,
        stiffness: 0.9,
        render: {
            visible: true,
        }
    }),
    Constraint.create({
        pointA: {x: config.width + 30, y: config.height-100},
        bodyB: bridge.bodies[bridge.bodies.length - 1],
        length: 1,
        stiffness: 0.9,
        render: {
            visible: true,
        }
    }),
    //Contraintes du boat
    Constraint.create({
        pointA: { x:  - 300, y: config.height },
        pointB: { x: -config.boat_width/2, y: 0 },
        bodyB: boat,
        length: 2,
        stiffness: 0.001,
        render: {
            visible: false,
        }
    }),
    Constraint.create({
        pointA: { x:  config.width + 300, y: config.height },
        pointB: { x: config.boat_width/2, y: 0 },
        bodyB: boat,
        length: 2,
        stiffness: 0.001,
        render: {
            visible: false,
        }
    }),
]);

let user = Bodies.rectangle(config.width/2, config.height - 250, 20, 50, {
        collisionFilter: {mask: defaultCategory},
        density: 0.06,
        mass: 20,
        render : {
            fillStyle: '#FF55AA',
        },
        id: Math.floor(Math.random() * 10000000),
    });
setInterval(() =>
              {socket.emit("location", { x: user.position.x, y: user.position.y, id: user.id })}, 200);

World.add(world, user);
//Controle of the player
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
    }
};
// setInterval(() => {
//     Body.applyForce(bridge.bodies[Math.floor(config.bridge_nb_tiles/3)], { x: bridge.bodies[Math.floor(config.bridge_nb_tiles/3)].position.x, y: bridge.bodies[Math.floor(config.bridge_nb_tiles/3)].position.y }, { x: 0, y: Math.random()*3 });
//     Body.applyForce(bridge.bodies[Math.floor(config.bridge_nb_tiles/2)], { x: bridge.bodies[Math.floor(config.bridge_nb_tiles/2)].position.x, y: bridge.bodies[Math.floor(config.bridge_nb_tiles/2)].position.y }, { x: 0, y: Math.random()*3 });
//     Body.applyForce(bridge.bodies[Math.floor(config.bridge_nb_tiles/3*2)], { x: bridge.bodies[Math.floor(config.bridge_nb_tiles/3*2)].position.x, y: bridge.bodies[Math.floor(config.bridge_nb_tiles/3*2)].position.y }, { x: 0, y: Math.random()*3 });
// }, 500);



// add mouse control
/*let mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            stiffness: 0.1,
            render: {
                visible: false
            }
        }
    });

World.add(world, mouseConstraint);*/

// keep the mouse in sync with rendering
//render.mouse = mouse;
