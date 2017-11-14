// create servo object to control a servo
Servo bend_servo;
// Cloud functions must return int and take one Stringint
int bendFunction(String command);
// Pin to control the servo
const int servo_pin = D0;
const int solenoid_pin = D1;
// variable to read the value from the analog pin
int val;

void setup() {
  pinMode(solenoid_pin, OUTPUT);
  // attaches the servo on pin 9 to the servo object
  bend_servo.attach(servo_pin);
  // Initialize the servo to a certain angle
  bend_servo.write(97);
  // Register the cloud function with a name and with the function
  // (Name of function, function call)
  Particle.function("bend", bendFunction);
}

void loop() {

}

// this function automatically gets called upon a matching POST request
int bendFunction(String command) {
  int angle = command.toInt();

  digitalWrite(solenoid_pin, HIGH);
  delay(500);
  bend_servo.write(angle);
  delay(1000);
  bend_servo.write(97);
  digitalWrite(solenoid_pin, LOW);

  return 1;
}
