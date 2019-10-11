#!/bin/bash
# Bash Menu Script Example

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

bold=$(tput bold)
normal=$(tput sgr0)

menu() {
  echo -e "
  ${GREEN}============================${NC}
    ${RED}${bold}1) ${NC}RN Info${normal}
    ${RED}${bold}2) ${NC}Chek ADB${normal}
    ${RED}${bold}3) ${NC}Show Package${normal}
    ${RED}${bold}4) ${NC}Run Android${normal}
    ${RED}${bold}5) ${NC}Run IOS${normal}
    ${RED}${bold}6) ${NC}Run Log${normal}
    ${RED}${bold}7) ${NC}Build Android Release${normal}
    ${RED}${bold}8) ${NC}Clean gradlew${normal}
    ${RED}${bold}9) ${NC}Run Android Release${normal}
    ${RED}${bold}q) ${NC}Quit${normal}
  ${GREEN}============================${NC}
  "
  echo -n "Please enter your choice: "
  read CHOICE
}

info() {
  react-native info
  break
}

checkADB() {
  adb devices
  break
}

showPackage() {
  cat package.json
  break
}

runAndroid() {
  react-native run-android
  break
}

runIos() {
  react-native run-ios
  break
}

runLog() {
  react-native run-log
}


buildAndroidRelease() {
  cd android && ./gradlew assembleRelease
  break
}

gradlewClean() {
  cd android && ./gradlew clean
  break
}

runAndroidRelease() {
  react-native run-android --variant=release
  break
}

while true
do
  menu
  case $CHOICE in
    1)
      info
    ;;
    2)
      checkADB
    ;;
    3)
      showPackage
    ;;
    4)
      runAndroid
    ;;
    5)
      runIos
    ;;
    6)
      runLog
    ;;
    7)
      buildAndroidRelease
    ;;
    8)
      gradlewClean
    ;;
    9)
      runAndroidRelease
    ;;
    q)
      break
    ;;
    *)
      echo menu
    ;;
  esac
done