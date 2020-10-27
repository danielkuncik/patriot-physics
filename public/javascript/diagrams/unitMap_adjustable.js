/*
This is a unit map that students can adjust in order to determine what their grade WOULD be if they reached
a particular point in the unit map
 */

// this needs to incorporate the back end????
// this will take some work, but it will be fun???

// its the only way to stop the endless questions about 'what will my grade be if.....'

// it really should be an html file???

function getMaxDimensionsOfUnitObject(unitObject) {
    const firstPod = unitObject.pods[Object.keys(unitObject.pods)[0]];
    let maxHorizontal = firstPod.horizontal;
    let minHorizontal = firstPod.horizontal;
    let maxVertical = firstPod.level;
    let minVertical = firstPod.level;
    Object.keys(unitObject.pods).forEach((podKey) => {
        let level = unitObject.pods[podKey].level;
        let horizontalPosition = unitObject.pods[podKey].horizontal;
        if (level > maxVertical) {
            maxVertical = level;
        }
        if (level < minVertical) {
            minVertical = level;
        }
        if (horizontalPosition > maxHorizontal) {
            maxHorizontal = horizontalPosition;
        }
        if (horizontalPosition < minHorizontal) {
            minHorizontal = horizontalPosition;
        }
    });
    return {
        minHorizontal: minHorizontal,
        maxHorizontal: maxHorizontal,
        minVertical: minVertical,
        maxVertical: maxVertical
    }
}

// will i need some global variables?
// or can i do it all with html data tags?

// create a helper and some back end programs that get the 'unitObjectWithGrades' to the front end
function drawAdjustableUnitMap(unitObject, gradeMap, goalLevel) {
    const totalWidth = 1000;
    const totalHeight = 1500;
    const {minHorizontal, maxHorizontal, minVertical, maxVertical} = getMaxDimensionsOfUnitObject(unitObject);
    const wiggleRoom = 50;
    const width_available = totalWidth - wiggleRoom * 2;
    const height_available = totalHeight - wiggleRoom * 2;
    const verticalUnit = height_available / (maxVertical - minVertical + 1);
    const horizontalUnit = width_available / (maxHorizontal - minHorizontal + 1);
    const circleRadius = Math.min(verticalUnit, horizontalUnit) * 0.5;
    const letterFont = circleRadius * 0.5;



}




const testUnit = {
    "title": "Quantitative Dynamics (Newton's Second Law)",
    "number": 2,
    "value":
    {
        "AP_physics_1": "innerCore",
        "honors_physics": "innerCore",
        "physics_A": "innerCore"
    },
    "uuid": "330a7cbc-220b-4274-a775-db2f246d5de0",
    "standards":
    {
        "mass_2016": "HS-PS2-1",
        "NGSS": "HS-PS2-1",
        "AP_Physics_1": ""
    },
    "pods":
    {
        "finding_net_force":
        {
            "title": "Finding Net Force",
            "subtitle": "Finding Net Force in One Dimension",
            "level": 1,
            "horizontal": 3,
            "letter": "A",
            "prerequisites": [],
            "objective": "Given a 1-dimensional quantitative free-body diagram, determine the magnitude and direction of net force acting on an object.",
            "content": "Net force is calculated from a quantitative free-body diagram of an object.",
            "uuid": "193942db-85ca-404f-b453-886450e5e415"
        },
        "newtons_second_law":
        {
            "title": "Newton's Second Law",
            "subtitle": "Using Newton's Second Law Numerically",
            "level": 1,
            "horizontal": 5,
            "letter": "B",
            "prerequisites": [],
            "objective": "Use Newton's Second Law to solve numeric problems.",
            "content": "Newton's Second Law relates the mass of an object, the acceleration of that object, and the net force acting on that object.",
            "uuid": "8778d7c4-b9c4-4d35-a8ff-28488849047a"
        },
        "finding_acceleration":
        {
            "title": "Finding Acceleration",
            "subtitle": "Finding Acceleration from a Free-Body Diagram",
            "level": 2,
            "horizontal": 4,
            "letter": "C",
            "prerequisites": ["finding_net_force","newtons_second_law", "friction_1"],
            "objective": "Given the mass of an object and several forces acting on that object in one dimension, determine the acceleration of the object.",
            "content": "A physicist finds acceleration of an object by first finding net force from a quantitative free-body diagram, then finding acceleration from Newton's Second Law.",
            "uuid": "a131a756-1dd9-4e12-b8ef-b5cbb73b325f"
        },
        "friction_1":
        {
            "title": "Friction 1",
            "subtitle": "Static vs. Kinetic Friction",
            "level": 1,
            "horizontal": 4,
            "letter": "D",
            "prerequisites": [],
            "objective": "Recognize when and how friction is applied; differentiate between two different types of friction.",
            "content": "Kinetic friction acts on objects that are moving; static friction acts on objects that are not moving.",
            "uuid": "bdd2d8bd-3725-409c-bf56-6aca566409cd"
        },
        "block_dragging_1":
        {
            "title": "Block Dragging 1",
            "subtitle": "Dragging a Block Without Friction",
            "level": 2,
            "horizontal": 2,
            "letter": "E",
            "prerequisites": ["finding_acceleration"],
            "objective": "Given a block of a certain mass, draw a free-body diagram of the block when it is not moving or being pushed on a surfaced without friction; determine the net force and acceleration of the block.",
            "content": "Gravity, normal force, and applied force act on a block being dragged; by understanding these forces a physicist can understand the motion of the block.",
            "uuid": "28a149bd-78b0-4872-b90c-b0ab53d960c5"
        },
        "find_missing_force":
        {
            "title": "Find The Missing Force",
            "level": 2,
            "horizontal": 6,
            "letter": "F",
            "prerequisites": ["finding_acceleration"],
            "objective": "Given a free-body diagram and the net force and/or an acceleration and mass, identify the magnitude and direction of an unknown force in a problem.",
            "content": "A physicist sometimes must find a particular force to find the net force acting on a block.",
            "uuid": "acacfeba-cd88-4fe9-95d2-db97278c3eb4"
        },
        "block_dragging_2":
        {
            "title": "Block Dragging 2",
            "subtitle": "Dragging With Kinetic Friction",
            "level": 3,
            "horizontal": 2,
            "letter": "G",
            "prerequisites": ["block_dragging_1"],
            "objective": "For a block moving on a surface with kinetic friction; draw a free-body diagram of the block, determine the acceleration of coefficient of kinetic friction; apply Newton's first and second laws to analyzing the block.",
            "content": "Gravity, normal force, and applied force, and kinetic friction act on a block being dragged; by understanding these forces a physicist can understand the motion of the block.",
            "uuid": "169d20af-4f7b-417e-b6c8-1a772ff24d05"
        },
        "friction_2":
        {
            "title": "Friction 2",
            "level": 3,
            "horizontal": 1,
            "letter": "X",
            "prerequisites": ["block_dragging_2"],
            "objective": "Recognize qualitative differences between static and kinetic friction; Explain that the magnitude of friction is independent of surface area.",
            "content": "The magnitude of friction is independent of surface area of the object being dragged; maximum static friction is stronger than kinetic friction.",
            "uuid": "f70801f8-b5f5-4579-b647-22a904967948"
        },
        "elevators_1":
        {
            "title": "Elevators 1",
            "subtitle": "Drawing a Free-Body Diagram Given Acceleration of an Elevator",
            "level": 3,
            "horizontal": 6,
            "letter": "H",
            "prerequisites": ["find_missing_force"],
            "objective": "Given a person in an elevator with a particular mass and acceleration, draw a correct free-body diagram of that person.",
            "content": "Inside an elevator, gravity and normal force act on the rider; normal force is a constraint force that adjusts to match a particular acceleration",
            "uuid": "cbf3cbac-c273-4d95-b8c0-ce7cb4e8eee4"
        },
        "block_dragging_3":
        {
            "title": "Block Dragging 3",
            "subtitle": "Dragging a Non-Moving Box",
            "level": 4,
            "horizontal": 2,
            "letter": "I",
            "prerequisites": ["block_dragging_2"],
            "objective": "Given a block experiencing an applied force on a floor with both static and kinetic friction, draw a correct free-body diagram of the block, determine the motion of the block, and defend your answers using principles of friction.",
            "content": "If a block is not moving, a physicist determines if it will move by comparing applied force to maximum static friction; static friction is a constraint force.",
            "uuid": "f9807bd7-6fed-4420-93fe-a071cc577e91",
            "inClass_AP": true
        },
        "vertical_friction":
        {
            "title": "Vertical Friction",
            "level": 4,
            "horizontal": 1,
            "letter": "J",
            "prerequisites": ["block_dragging_3"],
            "objective": "Draw a free-body diagram including friction as it acts on an object pressed against a wall or pole.",
            "content": "Friction can be analyzed in several situations other than simply a block being dragged on a horizontal surface.",
            "uuid": "28bc868a-760c-4cda-9f47-bd2d0e8d25d9"
        },
        "elevators_2":
        {
            "title": "Elevators 2",
            "subtitle": "Drawing a Free-Body Diagram Given Motion of An Elevator",
            "level": 4,
            "horizontal": 6,
            "letter": "K",
            "prerequisites": ["elevators_1"],
            "objective": "Given the description of motion of an elevator that is NOT moving at a constant velocity, draw a correct free-body diagram of a person in that elevator, defend that free-body diagram, and use it to describe what the person will feel.",
            "content": "Normal force changes in an elevator, leading to counterintuitive feelings; a physicist can make sense of these feelings by analyzing the forces and acceleration of a person in an elevator.",
            "uuid": "2c9250e1-6ed1-4324-a718-4ce387b1d758"
        },
        "block_dragging_4":
        {
            "title": "Block Dragging 4",
            "subtitle": "An Applied Force-Time Graph of a Block",
            "level": 5,
            "horizontal": 1,
            "letter": "L",
            "prerequisites": ["block_dragging_3"],
            "objective": "Given a force-time graph of a block on a surface, draw free-body diagrams for the block at different times and defend them; quantitatively analyze the surface based on the block.",
            "uuid": "711b0ffd-afd3-4a55-83dc-feebc822802c"
        },
        "friction_algebra":
        {
            "title": "Friction Algebra",
            "subtitle": "Symbolically Solving Friction Problems",
            "level": 5,
            "horizontal": 3,
            "letter": "M",
            "prerequisites": ["block_dragging_3"],
            "objective": "Given a block being dragged on a surface, draw an algebraic free-body diagram on the block, reflect the motion of the block using algebraic conditions.",
            "uuid": "7b4768b0-8804-4f10-b183-918b8f4a782f"
        },
        "elevators_3":
        {
            "title": "Elevator Problems 3",
            "subtitle": "Qualitative Kinematic Graphs and Free-Body Diagrams of an Elevator",
            "level": 5,
            "horizontal": 6,
            "letter": "N",
            "prerequisites": ["elevators_2"],
            "objective": "Draw kinematic graphs representing a person moving in a hypothetical elevator, draw free-body diagrams representing the forces on that person at a particular time, defend the free-body diagrams, and describe what the person will feel using the free-body diagram.",
            "uuid": "b4b9c673-ff4d-4148-9180-b956822ff67f"
        },
        "artificial_gravity":
        {
            "title": "Artificial Gravity",
            "level": 6,
            "horizontal": 6,
            "letter": "O",
            "prerequisites": ["elevators_3"],
            "objective": "Apply our knowledge of forces in elevators to determine appropriate speeds of a rocket and the use of the 'vomit comet' to practice weightlessness.",
            "uuid": "ffd98e4e-3cb3-4bbf-aa2a-050e01708f60"
        },
        "vomit_comet":
        {
            "title": "The Vomit Comet",
            "level": 6,
            "horizontal": 5,
            "letter": "P",
            "prerequisites": ["elevators_3"],
            "objective": "Apply knowledge of forces in elevators to develop a quantiative model of the dynamics and kinematics of astronauts in NASA's weightlessness training plane (colloquially known as the vomit comet)",
            "uuid": "a6c05b50-eec5-431e-a4fe-de397e98137f"
        },
        "chinese_pole":
        {
            "title": "The Chinese Pole",
            "level": 6,
            "horizontal": 3,
            "letter": "Q",
            "prerequisites": ["friction_algebra"],
            "objective": "Use knowledge of static and kinetic friction to create a quantitative model of tricks done on the Chinese Pole by a circus performer.",
            "uuid": "9c995a76-090e-440c-8550-ebdd6c6e0a83"
        }
    }
};


drawAdjustableUnitMap(testUnit);