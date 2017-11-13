// create servo object to control a servo
Servo myservo;
// Pin to control the servo
const int servo_pin = D0;
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
    myservo.write(100);
    delay(2000);
    myservo.write(165);
    delay(2000);

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
