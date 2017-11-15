/*
* Wire Bender
* Description:
* Author:
* Date: 12/2/17
*/

// create servo object to control a servo
Servo bend_servo;
// Cloud functions must return int and take one Stringint
int bend_to_angle(String angle_string);
// Pin to control the servo
const int servo_pin = D0;
// Maximum angle the bending servo can go
const int MAX_ANGLE = 166;
// Minimum angle the bending servo can go
const int MIN_ANGLE = 21;
// The angle at which the bending pin is just to the left of the straight wire
// const int HIGH_SIDE_ANGLE = 97;
// The angle at which the bending pin is just to the right of the straight wire
// const int LOW_SIDE_ANGLE = 86;
// Pin to control the solenoid
const int solenoid_pin = D1;
// Step pin for stepper motor
const int step_pin = D3;
// Direction pin for stepper motor
const int direction_pin = D2;
// Steps for 360 degree stepper turn
const int STEPS_PER_TURN = 200;
// Minimum delay between steps in microseconds
const int STEP_DELAY = 5000;
// The angle of a step for the stepper motor
const float STEP_ANGLE = 1.8;
// Current stepper angle
float angle = 0.0;


void setup() {
  pinMode(solenoid_pin, OUTPUT);
  // attaches the servo on pin 9 to the servo object
  bend_servo.attach(servo_pin);
  // Initialize the servo to a certain angle
  bend_servo.write(94);
  // Register the cloud function with a name and with the function
  // (Name of function, function call)
  Particle.function("bend", bend_to_angle);
  // Init the serial port
  Serial.begin(9600);
  // Init pins to outpur
  pinMode(step_pin, OUTPUT);
  pinMode(solenoid_pin, OUTPUT);
  pinMode(direction_pin, OUTPUT);
}

void loop() {
  // Turn the feeding stepper motor if a number is given on serial
  if (Serial.available() > 0) {
    int n = Serial.parseInt();
    if (n > 0) {
      steps(-1 * n);
    }
  }
}


// this function automatically gets called upon a matching POST request
int bend_to_angle(String angle_string) {
  // Convert the string angle_string to an integer
  int angle = angle_string.toInt();

  if (angle <= MAX_ANGLE && angle >= MIN_ANGLE) {
    digitalWrite(solenoid_pin, HIGH);
    delay(500);
    bend_servo.write(angle);
    delay(1000);
    digitalWrite(solenoid_pin, LOW);
    delay(1000);
    bend_servo.write(94);
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

// Steps the stepper motor number_of_steps steps. If number_of_steps < 0 the
// motor will rotate in the opposite direction.
void steps(int number_of_steps) {
  bool move_forward = true;
  // Establishing the direction
  if (number_of_steps >= 0) {
    move_forward = true;
  } else {
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
