/*
* Wire Bender
* Description:
* Author:
* Date: 12/2/17
*/

// create servo object to control a servo
Servo myservo;
// Pin to control the servo
const int servo_pin = D0;
// Step pin for stepper motor
const int step_pin = D1;
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
// variable to read the value from the analog pin
int val;

void setup() {
  // attaches the servo on pin 9 to the servo object
  myservo.attach(servo_pin);
  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
    // Bends the wire apprx. 50 degrees
    // myservo.write(100);
    // delay(2000);
    // myservo.write(165);
    // delay(2000);
    int n = Serial.parseInt();
    steps(n);



    // NOTE: Used to parse integer inputs and write them to servo
    // val = Serial.parseInt();
    // Serial.print("recieving: ");
    // Serial.println(val);

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
    if (move_forward) {
      angle = (angle + STEP_ANGLE) % 360;
    } else {
      angle = (angle - STEP_ANGLE) % 360;
    }
    // Delay for proper speed
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
