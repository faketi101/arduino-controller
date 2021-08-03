#include <Servo.h>

int buzzerPin = 11;
int lightPin = 9;
Servo servo_1;
void setup() {
  // put your setup code here, to run once:
  pinMode(buzzerPin, OUTPUT);
  pinMode(lightPin, OUTPUT);
  servo_1.attach(8);
  
  Serial.begin(9600);
  
  startupSound();
}

void loop() {
  // put your main code here, to run repeatedly:
  statusManager();
  delay(100);
 }
int statusManager(){
   // CHeck to see if Serial data is being received
  if (Serial.available() > 0) {
    
    // Create a new string variable to receive Serial data
    String receivedString = "";
    String mod = "";
    String st = "";
    
    // Loop through received data and append to the receivedString variable
    while (Serial.available() > 0) {
      receivedString += char(Serial.read ());      
    }
    
    // Print received Serial data
    Serial.println(receivedString);
      mod = receivedString.substring(0,3);
      st = receivedString.substring(4);
      
      if(mod == "l01" && st == "1"){
        digitalWrite(lightPin,HIGH);
      }else if(mod == "l01" && st == "0"){
        digitalWrite(lightPin,LOW);
      }else if(mod == "s01"){
        servo_1.write(st.toInt());
      }
    
  }
}

int startupSound(){
  
  digitalWrite(buzzerPin, HIGH);
  delay(100);
  digitalWrite(buzzerPin, LOW);
  delay(100);
  digitalWrite(buzzerPin, HIGH);
  delay(100);
  digitalWrite(buzzerPin, LOW);
}
