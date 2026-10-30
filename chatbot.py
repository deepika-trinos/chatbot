# A very simple chatbot that runs in the terminal.
# Module 1: the bot repeats back whatever you type, until you say "bye".


def main():
    print("Bot: Hello! I am a simple chatbot. Type 'bye' to leave.")

    while True:
        user_message = input("You: ")

        if user_message.lower() == "bye":
            print("Bot: Goodbye!")
            break

        print("Bot: You said: " + user_message)


if __name__ == "__main__":
    main()
