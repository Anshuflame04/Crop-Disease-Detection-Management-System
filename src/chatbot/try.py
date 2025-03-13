import google.generativeai as genai
import os

# Set your API key (keep it secure; don't hard-code in production)
os.environ["GOOGLE_API_KEY"] = "AIzaSyDncRUAl5s2Y6g6uvmhDCBUWGgf2bS33vY"  # Replace with your actual Google API key
genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

# Initialize the model
try:
    model = genai.GenerativeModel("models/gemini-pro")
except Exception as e:
    print(f"Model initialization failed: {str(e)}")
    exit()

def format_response(response: str) -> str:
    # Clean up any leading/trailing whitespace
    response = response.strip()

    # Replace asterisks with dashes for bullet points
    response = response.replace('* ', '- ')
    response = response.replace('**', '')

    # Split the response into lines for processing
    lines = response.splitlines()
    formatted_lines = []

    for line in lines:
        line = line.strip()  # Remove whitespace from each line
        if line:  # Only process non-empty lines
            # Check if the line starts with a digit followed by a period (for numbered lists)
            if line[0].isdigit() and '.' in line:  
                formatted_lines.append(line)  # Keep numbered items as they are
            else:
                formatted_lines.append(f"- {line}")  # Format as bullet points

    # Join the lines back into a single string, ensuring each item starts on a new line
    # Add an extra newline for better spacing between items
    return '\n\n'.join(formatted_lines)  # Double newline for spacing between items

def start_chat():
    print("Welcome to the Anshu Chatbot!")
    print("Type 'exit' to quit.\n")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'exit':
            print("Exiting the chatbot.")
            break
        
        try:
            # Send the user's input to the chatbot API
            prompt = f"User: {user_input}\nBot:"
            response = model.generate_content(prompt)
            formatted_response = format_response(response.text)
            print(f"Bot: {formatted_response}")
        except Exception as e:
            print(f"Error generating response: {e}")

# Start the chatbot
if __name__ == "__main__":
    start_chat()
