/*
* Wire Bender
* Description:
* Author:
* Date: 12/2/17
*/

// create servo object to control a servo
Servo bend_servo;
// Init cloud functions
// Cloud functions must return int and take one Stringint
int process_instructions(String instructions);
int bend_to_angle(String angle_string);
int feed_mm(String mm_string);
int soleniod_state(String binary_string);
// Pin to control the servo
const int servo_pin = D0;
// Maximum angle the bending servo can go
const int MAX_ANGLE = 90;
// Minimum angle the bending servo can go
const int MIN_ANGLE = -90;
// The angle at which the bending pin is just to the left of the straight wire
// const int HIGH_SIDE_ANGLE = 97;
// The angle at which the bending pin is just to the right of the straight wire
// const int LOW_SIDE_ANGLE = 86;
// The angle of the server that is directly below the wire.
const int SERVO_HOME = 94;
// Pin to control the solenoid
const int solenoid_pin = D1;
// Step pin for stepper motor
const int step_pin = D2;
// Direction pin for stepper motor
const int direction_pin = D3;
// Steps for 360 degree stepper turn
const int STEPS_PER_TURN = 200;
// Minimum delay between steps in microseconds
const int STEP_DELAY = 5000;
// The angle of a step for the stepper motor
const float STEP_ANGLE = 1.8;
// The current approximation for MM / STEP
const float MM_PER_STEP = 0.1625;
// The theoretical MM / STEP given radius of 5.75
const float TH_MM_PER_STEP = 0.1806415776;
// Current stepper angle
float angle = 0.0;


void setup() {
  pinMode(solenoid_pin, OUTPUT);
  // attaches the servo on pin 9 to the servo object
  bend_servo.attach(servo_pin);
  // Initialize the servo to a certain angle
  bend_servo.write(98);
  // Register the clouds function with a name and with the function
  // (Name of function, function call)
  Particle.function("process", process_instructions);
  Particle.function("bend", bend_to_angle);
  Particle.function("feed", feed_mm);
  Particle.function("solenoid", soleniod_state);
  // Init the serial port
  Serial.begin(9600);
  // Init pins to outpur
  pinMode(step_pin, OUTPUT);
  pinMode(solenoid_pin, OUTPUT);
  pinMode(direction_pin, OUTPUT);
}

void loop() {

}

int process_instructions(String instructions) {
  while (instructions.trim() != ""){
    int i = instructions.indexOf(",");
    String command = instructions.substring(0,i);
    String action = command.substring(0,1);
    String value = command.substring(1);
    Serial.println("Action: " + action);
    Serial.println("Value: " + value);
    Serial.println("-----");

    char char_action = action[0];

    switch (char_action) {
      case 'b':
        bend_to_angle(value);
        delay(1000);
        break;
      case 'f':
        feed_mm(value);
        delay(100);
        break;
      case 's':
        soleniod_state(value);
        delay(100);
        break;
    }
    instructions = instructions.substring(i+1);
  }
  return 1;
}

// =================== FEED FUNCTIONS ======================

// this function automatically gets called upon a matching POST request
int bend_to_angle(String angle_string) {
  // Convert the string angle_string to an integer
  int angle = angle_string.toInt();

  if (angle <= MAX_ANGLE && angle >= MIN_ANGLE) {
    int servo_angle = map(angle, 90, -90, 21, 167);
    bend_servo.write(servo_angle);
    return 1;
  } else {
    Serial.print("Warning: value ");
    Serial.print(angle);
    Serial.println(" is outside of valid Servo range");
    return -1;
  }

  // scale it to use it with the servo (value between 0 and 180)
  // if (val < 180 && val > 0){
  //   // sets the servo position according to the scaled value
  //   myservo.write(val);
  //   Serial.print("Servo moving to: ");
  //   Serial.println(myservo.read());
  //   // waits for the servo to get there
  //   delay(2000);
  // } else {
  //   Serial.print("Warning: value ");
  //   Serial.print(val);
  //   Serial.println(" is outside of valid Servo range");
  // }
}

// =================== FEED FUNCTIONS ======================

// this function automatically gets called upon a matching POST request
int feed_mm(String mm_string) {
  // Convert the string angle_string to an integer
  int mm = mm_string.toInt();
  steps(mmToSteps(mm));
  return 1;
}

// Converts mm to steps given the MM_PER_STEP value (there is some implicit
// error because this functions maps from real numbers to discrete numbers -
// also the extruder doesn't always extrude the amount it theoretically
// should).
int mmToSteps(float mm) {
  return round(mm / MM_PER_STEP);
}

// Calculates the error from converting mm in real space to steps in discrete
// space.
float mmToStepsError(float mm) {
  return abs(MM_PER_STEP * round(mm / MM_PER_STEP) - mm);
}

// Utitlity function to play around with the theoretical error that results from
// mapping from real to discrete space.
void avgError() {
  double maxE = 0;
  double avg = 0;
  for (int i=0; i<10000; i++) {
    maxE = max(maxE, mmToStepsError(i));
    maxE = max(maxE, mmToStepsError((double)i + 0.25));
    maxE = max(maxE, mmToStepsError((double)i + 0.5));
    maxE = max(maxE, mmToStepsError((double)i + 0.75));
    avg = avg + mmToStepsError(i) + mmToStepsError(i + 0.25) + mmToStepsError(i + 0.5) + mmToStepsError(i + 0.75);
  }
  avg = avg / 40000.0;
  Serial.print("maximum theoretical error: ");
  Serial.println(maxE);
  Serial.print("avg theoretical error: ");
  Serial.println(avg);
}

// Steps the stepper motor number_of_steps steps. If number_of_steps < 0 the
// motor will rotate in the opposite direction.
void steps(int number_of_steps) {
  bool move_forward = true;
  // Establishing the direction
  if (number_of_steps < 0) {
    move_forward = false;
    number_of_steps = -number_of_steps;
  }
  // Generating the steps
  for (int i = 0; i < number_of_steps; i++) {
    step(move_forward);
    delayMicroseconds(STEP_DELAY);
  }
}

// Steps the stepper motor a single step either forward or backward
void step(bool forward) {
  // setting the direction
  if (forward == true) {
    digitalWrite(direction_pin, HIGH);
  } else {
    digitalWrite(direction_pin, LOW);
  }
  // creating a step
  digitalWrite(step_pin, HIGH);
  // minimum delay is 1.9us
  digitalWrite(step_pin, LOW);
}


// ================== SOLENOID FUNCTIONS ====================

// this function automatically gets called upon a matching POST request
int soleniod_state(String binary_string) {
  int binary = binary_string.toInt();
  switch (binary) {
    case 0:
      disengage_solenoid();
      break;
    case 1:
      engage_solenoid();
      break;
  }
}

void engage_solenoid() {
  digitalWrite(solenoid_pin, HIGH);
}

void disengage_solenoid() {
  digitalWrite(solenoid_pin, LOW);
}
