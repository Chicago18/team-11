#Authors: David Yun, Anna Truelove, Joyce Zhong
#Title: Easy PT
#Purpose: MLH HackNC Fall 2018

from flask import Flask
from flask_ask import question, Ask, statement

app = Flask(__name__)
ask = Ask(app, "/")

global stage
global send_track
global session_num
global brandnewsess

stage = "start"
send_track = "initial"
session_num = 0
brandnewsess = True


@ask.launch
def launched():
    global stage
    stage = "start"
    response = "welcome back Rameses. you seem to have one message from your PT and one daily session incomplete. Would you like to hear options?"
    # wait for 10 sec
    return question(response)


@ask.intent("get_options")
def options():
    global stage
    stage = "get_options"
    response = "your options are: get message, start my session, send message to my p.t. . if you would like to hear that again, say options"
    return question(response)


@ask.intent("get_msg")
def get_msg():
    global stage
    stage = "get_msg"
    response = "here is your message: hi rameses, hope youre doing well. dont forget about your appointment at our office next week. best regards, doctor strange." + " "
    response += "end of messages. would you like to hear that again?"
    return question(response)


@ask.intent("send_msg")
def send_msg():
    global stage
    stage = "send_msg"
    if send_track == "initial":
        response = "lets send that message! what would you like to say to your physical therapist?"
        return question(response).reprompt("I didn't get that. What was your message?")


@ask.intent("start_sess")
def start_sess():
    global stage
    global session_num
    global brandnewsess
    if session_num == 0:
        stage = "start_sess"
        if brandnewsess:
            response = "lets start that session! are you ready to party? yes, or no?"
            return question(response)
        elif brandnewsess is False:
            response = "This session consists of three exercises. Exercise one: Hold Bridge for five seconds. Lie on your back. Bend both knees and walk your ankles directly beneath your knees keeping your feet straight. Extend your arms along your body, palms face down."
            response += " Press evenly into the soles of your feet, lift your pelvis off the ground, walk your shoulder blades towards one another and underneath your back. Puff your chest towards your chin. Roll your thighs inward and down. Keep your knees stacked over your ankles throughout the duration of the exercise."
            response += " that is it for exercise one. would you like to move on to excercise two - yes or no?"
            session_num = 1
            return question(response)
    if session_num == 1:
        response = "Exercise 2: Moving Warrior Two for five seconds: Stand with your legs one leg's distance apart, feet parallel. Pivot your right foot out to ninety degrees. Line your right heel up with your left arch. Engage your core by lifting your navel towards your chin. Keeping your chest and hips open, elevate your arms to shoulder height. Bend your right knee so that it stacks over your ankle and keep it tracking between your third and fourth toes. Then straighten your leg making sure not to lock your knee and bend it again to come back to warrior two. "
        response += " that is it for exercise two. would you like to move on to excercise three - yes or no"
        session_num = 2
        return question(response)
    if session_num == 2:
        response = "Exercise 3: Leg Slides for 5 seconds: Lie down with your legs up the wall. Cross your ankles and bend your knees. Slide your heels up and down the wall working between flexion and extension."
        response += " that is it for exercise three. you have finished your excercises for this session. what else would you like to do?"
        session_num = 3
        return question(response)


@ask.intent("AMAZON.YesIntent")
def yesIntent():
    global stage
    global brandnewsess
    global session_num
    if stage == "get_options":
        return question(response)
    if stage == "get_msg":
        return get_msg()
    if stage == "send_msg":
        return question(response)
    if stage == "start_sess":
        if session_num == 0:
            if brandnewsess:
                brandnewsess = False
                return start_sess()
        elif session_num == 1:
            statement("continuing the session...")
            return start_sess()
        elif session_num == 2:
            statement("continuing the session...")
            return start_sess()
        else:
            return question("I didn't get that, would you like to hear the options?")


@ask.intent("AMAZON.NoIntent")
def noIntent():
    if stage == "start":
        return question("what would you like to do?")
    if stage == "get_options":
        return question("okay then, what else would you like to do?")
    if stage == "get_msg":
        return question("okay then, what else would you like to do?")
    if stage == "send_msg":
        return question("okay, I discarded the message. what else would you like to do?")
    if stage == "start_sess":
        if session_num == 0:
            return question("okay then, what else would you like to do?")
        else:
            return question("putting session on hold, what else would you like to do?")

@ask.intent("AMAZON.FallbackIntent")
def missionfailedfallback():
    if stage == "start":
        return question("okay. what else would you like to do?")
    if stage == "get_options":
        return question("okay. what else would you like to do?")
    if stage == "get_msg":
        return question("okay. what else would you like to do?")
    if stage == "send_msg":
        return question("okay. sent. what else would you like to do?")
    if stage == "start_sess":
        return question("okay. what else would you like to do?")


if __name__ == "__main__":
    app.run()
