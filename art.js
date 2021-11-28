var Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Composites = Matter.Composites,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Composite = Matter.Composite,
  Bodies = Matter.Bodies;
Body = Matter.Body;
Events = Matter.Events;

var engine = Engine.create(),
  world = engine.world;

let canvas = document.querySelector('#canvas');

let width = canvas.offsetWidth,
  height = canvas.offsetHeight;
console.log(width, height);

var render = Render.create({
  element: canvas,
  engine: engine,
  options: {
    width: canvas.offsetWidth,
    height: canvas.offsetHeight,
    wireframes: false,
  },
});

engine.gravity = {
  x: 0,
  y: 0,
};

Matter.Runner.run(engine);
Render.run(render);

// walls
let wallsOptions = {
  isStatic: true,
  render: {
    fillStyle: 'none',
  },
};
let pixelWidth = 40;
let thiccnezz = pixelWidth * 2;
Composite.add(world, [
  Bodies.rectangle(width / 2, 0, width, thiccnezz, wallsOptions),
  Bodies.rectangle(width, height / 2, thiccnezz, height, wallsOptions),
  Bodies.rectangle(0, height / 2, thiccnezz, height, wallsOptions),
  Bodies.rectangle(width / 2, height, width, thiccnezz, wallsOptions),
]);

let cursorSize = 20;
// cursor
let mouseCircle = Bodies.circle(width / 2, height / 2, cursorSize, {
  isStatic: true,
  render: {
    fillStyle: 'none',
    lineWidth: 2,
    strokeStyle: 'white',
  },
});

Composite.add(world, [mouseCircle]);

let pixelOptions = {
  isStatic: false,
  render: { fillStyle: 'white' },
};

let line = (x, y, length, direction) => {
  let xCount = 1;
  let yCount = 1;
  switch (direction) {
    case 'y':
      xCount = length;
      break;
    case 'x':
      yCount = length;
      break;
    default:
    // code block
  }
  return Composites.stack(x, y, yCount, xCount, 0, 0, function (x, y) {
    return Bodies.rectangle(x, y, pixelWidth, pixelWidth, pixelOptions);
  });
};

// incredibly sloppy way to make the we3 logo here

let pw = (int) => {
  return int * pixelWidth;
};

// w
Composite.add(world, [
  line(pw(5), pw(5), 5, 'y'),
  line(pw(6), pw(9), 3, 'x'),
  line(pw(9), pw(5), 5, 'y'),
  line(pw(7), pw(6), 3, 'y'),
]);
// e
Composite.add(world, [
  line(pw(11), pw(5), 5, 'y'),
  line(pw(12), pw(5), 4, 'x'),
  line(pw(12), pw(9), 4, 'x'),
  line(pw(12), pw(7), 3, 'x'),
]);

// 3
Composite.add(world, [
  line(pw(17), pw(5), 5, 'x'),
  line(pw(17), pw(9), 5, 'x'),
  line(pw(18), pw(7), 3, 'x'),
  line(pw(21), pw(6), 3, 'y'),
]);

var mouse = Mouse.create(render.canvas),
  mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;

// have a little stroke ball thing that follows the mouse
Events.on(engine, 'afterUpdate', function () {
  if (!mouse.position.x) {
    return;
  }

  Body.setVelocity(mouseCircle, {
    x: mouseCircle.position.x - mouse.position.x,
    y: mouseCircle.position.y - mouse.position.y,
  });

  Body.setPosition(mouseCircle, {
    x: mouse.position.x,
    y: mouse.position.y,
  });
});

// switch case to make bigger or smaller
document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowUp':
      Body.scale(mouseCircle, 1.2, 1.2);
      break;

    case 'ArrowDown':
      Body.scale(mouseCircle, 0.8, 0.8);

      break;

    default:
      break;
  }
});
